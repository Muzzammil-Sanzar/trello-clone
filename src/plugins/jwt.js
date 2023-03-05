const fp = require('fastify-plugin');
const configuration = require('../config/configuration');

module.exports = fp( function(fastify, option, done){
    fastify.register(require('fastify-jwt'), {
        secret: configuration.secretKey
    })

    fastify.decorate('authenticate', async function(req, reply){
        try{
            await req.jwtVerify()
        } catch (err) {
            reply.send(err)
        }
    })
    done()
} )