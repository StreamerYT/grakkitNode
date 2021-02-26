# Grakkit Node.js
[![Grakkit Logo](https://raw.githubusercontent.com/grakkit/grakkit/master/logo.png)](https://github.com/grakkit/grakkit)

Grakkit Node gives you the ability to share Grakkit and Node.js
# Usage
```js
let server = require('./grakkit');
// global.server=server;
```

## api for grakkit and node.js
```js
server.on(event,function);  // own EventEmitter for server compatibility.
server.emit(name,...args);  // activates immediately on grakkit and node.js. no matter where it was launched.
server._emit(name,...args); // required for events.
```

## api for grakkit only
```js
command({name,aliases,execute(sender,name,args),tabComplete(sender,name,args)}); // adds command to server.
send(name,data); // required for events and other.
```

## api for node.js only
```js
server.eval(script); // the same eval but in grakki.
server.initModule(name); // connects the module. You can delete unnecessary modules.
```

## modules for node.js
```js
server.require(path); // the same require but in grakkit.
server.function((data1,data2)=>{ // allows you to run functions in grakkit passing arguments
console.log('data1:',data1)
console.log('data2:',data2)
},123,456)
```
