let node = globalThis.process

function globalFunctions(server){
    server._events = {}
    server.on=(n,f)=>{if(!server._events[n])server._events[n]={on:[],once:[]};server._events[n].on.push(f)}
    server.once=(n,f)=>{if(!server._events[n])server._events[n]={on:[],once:[]};server._events[n].once.push(f)}
    server.__emitonce=(n,f=server._events[n].once.splice(0,1)[0],...a)=>{if(f){f(...a);server.__emitonce(n,undefined,...a)}}
    server._emit=(n,...a)=>{if(server._events[n]){server._events[n].on.forEach(f=>f(...a));server.__emitonce(n,undefined,...a)}}
    server.emit=(n,...a)=>{node?server.eval(`global.server._emit('${n}',...JSON.parse(\`${JSON.stringify(a)}\`))`):server._send('event',{n,a});server._emit(n,...a)}
    if(node)server.ondata.event=d=>server._emit(d.n,...d.a)
}

if(node){
    global.fs = require('fs')
    global.path = require('path')
    let {spawn} = require('child_process')
    function log(server,data){data=data.toString()
        ' '.repeat(2).split(' ').forEach(()=>data.endsWith('\n')?data=data.substring(0,data.length-1):0)
        let d=data.split('INFO]: ')[1];d=d?d.split(' ')[0]:0
        if(d&&d=="_grakkit@node_"){
            d = JSON.parse(data.split('INFO]: ')[1].split(' ').slice(1).join(" "))
            if(server.ondata[d.n])server.ondata[d.n](d.d)
        }else{
            server._emit('console',data)
        }
    }
    let offlinejar = {stdin:{write:()=>{console.warn(new Error("You haven't started the server yet!"))}}}

    module.exports = function (cwd,file){
        let server = {_ready:0,autorestart:0,ondata:[],cwd:path.join(__dirname,'../',cwd),file,jar:offlinejar}
        globalFunctions(server)

        server.on('ready',()=>server._ready=1)
        server.on('stop',()=>{
            server.ready=0;
            server.jar=offlinejar
            if(server.autorestart){setTimeout(()=>server.start(),1000)}
        })
        
        server.execute = x=>server.jar.stdin.write(`${x}\n`)
        server.eval = x=>server.execute(`eval ${x}`)
        server.module = (name,...args)=>{
            let m;
            try{
                m=require('./modules/'+name+'.js')
                m=m(server,...args)
            }catch(e){
                console.log(`The ${name} module was not loaded!`,e.stack)
            }
            return m
        }

        server.start = function (){
            if(server.jar!=offlinejar) return console.log(new warn('You have already started the server!'))
            server.jar = spawn('java',`-jar ${file}`.split(' '),{cwd:server.cwd})
            server.jar.stdout.on('data',l=>log(server,l));
            server.jar.stderr.on('data',l=>log(server,l));
            server.jar.on('close',c=>server._emit('stop',c));
        }
        server.stop = function (){
            if(server._ready){
                server.execute('stop')
            }else{
                console.log("But I still try to turn it off.")
                if(server.jar==offlinejar){
                    console.warn(new Error("You haven't started the server yet!"))
                }else{
                    server.jar.kill()
                }
            }
        }

        return server
    }

}else{
    globalThis.global=globalThis
    global.server = {
        _send:(n,d)=>console.log(`_grakkit@node_ ${JSON.stringify({n,d})}`)
    }
    globalFunctions(global.server)
    global.Bukkit = Java.type('org.bukkit.Bukkit')
    let g = Bukkit.getPluginManager().getPlugin('grakkit');
    let c = Bukkit.getConsoleSender()
    g.register(g.getName(),'eval',[],'0','0',(s,n,a)=>s==c?eval([...a].join(' ')):0,s=>0)
    server.emit('ready')
}
