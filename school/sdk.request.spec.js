const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const LocalServer = require('../support/local.server')
const { JSDOM } = require('jsdom')
const dom = new JSDOM(``)
global.window = dom.window
const sut = fs.readFileSync(path.join(__dirname, 'sdk.js')).toString()
const request = (new Function(sut + '; return Sdk.request;'))()

describe('Sdk Request', ()=> {

    var server
    var headers

    beforeEach((done)=>{
        server = new LocalServer((req, response)=>{
            headers = req.headers
            response.setHeader('Access-Control-Allow-Origin', '*')
            response.setHeader('Access-Control-Allow-Headers', 'OData-MaxVersion,OData-Version,Prefer')
            response.setHeader('Content-Type', 'application/json')
            if (req.method === 'GET' && req.url === '/error') {
                response.statusCode = 500
                response.end()
            }
            else if (req.method === 'GET' && req.url === '/forbidden') {
                response.statusCode = 401
                response.write(JSON.stringify({ error:'sorry :)' }))
                response.end()
            }
            else {
                if (req.method === 'GET') {
                    response.write(JSON.stringify({ id:42 }))
                    response.end()
                }
                else if (req.method === 'POST') {
                    var body = ''
                    req.on('data', (chunk)=> { body += chunk })
                    req.on('end', ()=> {
                        response.write(JSON.stringify({ received:JSON.parse(body) }))
                        response.end()
                    })
                }
                else {
                    response.end()
                }
            }
        })
        server.start(done)
    })
    afterEach((done)=>{
        server.stop(done)
    })
    it('exposes entity data via GET', ()=> {
        return request({
            method: 'GET',
            uri: `http://localhost:${server.port}/products(this-id)`
        })
        .then(function(xhr) {
            return JSON.parse(xhr.response)
        })
        .then(function(data) {
            expect(data).to.deep.equal({ id:42 })
        })
        .catch(function(error) {
            throw error
        })
    })
    it('sends the expected headers', ()=> {
        return request({
            method: 'GET',
            uri: `http://localhost:${server.port}/products(this-id)`
        })
        .then(function() {
            [
                { key:'accept', value: 'application/json' },
                { key:'content-type', value: 'application/json; charset=utf-8' },
                { key:'prefer', value: 'odata.maxpagesize=10' },
                { key:'odata-maxversion', value: '4.0' },
                { key:'odata-version', value: '4.0' }
            ].forEach((header)=> {
                expect(headers[header.key]).to.equal(header.value)
            })
        })
        .catch(function(error) {
            throw error
        })
    })
    it('sends given data', ()=> {
        return request({
            method: 'POST',
            uri: `http://localhost:${server.port}/messages`,
            data: { message:'ping' }
        })
        .then(function(xhr) {
            return JSON.parse(xhr.response)
        })
        .then(function(data) {
            expect(data).to.deep.equal({ received: { message:'ping' } })
        })
        .catch(function(error) {
            throw error
        })
    })
    it('resists error 500', ()=> {
        return request({
            method: 'GET',
            uri: `http://localhost:${server.port}/error`
        })
        .catch(function(error) {
            expect(error).to.equal('Unexpected Error')
        })
    })
    it('resists less disrupting error', ()=> {
        return request({
            method: 'GET',
            uri: `http://localhost:${server.port}/forbidden`
        })
        .catch(function(error) {
            expect(error).to.equal('sorry :)')
        })
    })
})
