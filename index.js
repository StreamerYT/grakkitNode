let server = require('./grakkit')
server.initModule('require')
server.on('ready',()=>server.require('./indexg.js'))
