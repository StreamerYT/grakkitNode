globalThis.global=globalThis

global.send = (name,data)=>console.log(`_grakkit@node_ ${JSON.stringify({name,data})}`)

global.server = {}


server._events = {}
server.on=function (name,func){
    if(!server._events[name])server._events[name]=[]
    server._events[name].push(func)
}
server._emit = function (name,...args){
    if(server._events[name])server._events[name].forEach(f=>f(...args))
}
server.emit = function (name,...args){
    send('event',{name,args})
    if(server._events[name])server._events[name].forEach(f=>f(...args))
}
let grakkit = Java.type('org.bukkit.Bukkit').getPluginManager().getPlugin('grakkit');
global.command = function(options){
    grakkit.register(
        grakkit.getName(),
        options.name,
        options.aliases||[],
        'permission','message',
        (sender, name, args) => options.execute?options.execute(sender,name,[...args]):null,
        (sender, name, args) => options.tabComplete?(options.tabComplete(sender,name,[...args])||[]):[]
    );
}


let consolesender = Java.type('org.bukkit.Bukkit').getConsoleSender()
command({name:'eval',execute:(sender,name,args)=>{if(sender==consolesender)eval(args.join(' '))}})

server.emit('ready')
