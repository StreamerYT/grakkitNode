let grakkit = require('./grakkit')
let server = grakkit('./server/','craftbukkit-1.12.2.jar')

server.on('console',l=>console.log(l))
process.stdin.on('data',d=>server.jar.stdin.write(d))

server.autorestart=1
server.start()
