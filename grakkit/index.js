let {spawn} = require('child_process')
let fs = require('fs')

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
    server.eval(`server._emit('${name}',JSON.parse('${JSON.stringify(args)}'))`)
    if(server._events[name])server._events[name].forEach(f=>f(...args))
}

server.eval = s=>jar.stdin.write(`eval ${s}\n`)

server.ondata={}
server.initModule=n=>require('./modules/'+n.toLowerCase()+'.js')
server.ondata.event = a=>server._emit(a.name,...a.args)

function log(data){
    data=data.toString()
    ' '.repeat(2).split(' ').forEach(()=>{
        if(data.endsWith('\n')) data=data.substring(0,data.length-1)
    })
    let d = data.split('INFO]: ')[1]
        d = d?d.split(' ')[0]:null
    if(d&&d=="_grakkit@node_"){
        data = JSON.parse(data.split('INFO]: ')[1].split(' ').slice(1).join(" "))
        if(server.ondata[data.name])server.ondata[data.name](data.data)
    }else{
        console.log(data)
    }
}

let jar = spawn('java',`-jar ${fs.readdirSync('./server').find(f=>f.endsWith('.jar'))}`.split(' '),{cwd:"./server"})
jar.on('close',c=>process.exit(c));
jar.stdout.on('data',log);
jar.stderr.on('data',log);
process.stdin.on('data',d=>jar.stdin.write(d))



module.exports = global.server
