let path = require('path');
server.require=p=>server.eval(`require('${path.join(path.join(__dirname,'../../'),p)}')`)
