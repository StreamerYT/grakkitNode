if(!!global.process){
    module.exports = function (server){
        if(!server.require)server.module('require')
        server.require('./grakkit/modules/function.js',1)
        server.function = function (func,autoRequireOnRestart,...args){
            let r = ()=>server.emit('_grakkit@node_&function',func.toString().replace(/\n/g,'_grakkit@node_&newLine'),...args)
            if(server.ready){
                r()
                if(autoRequireOnRestart) return server.on('ready',()=>{r()})
                delete r
            }else{
                server[autoRequireOnRestart?'on':'once']('ready',()=>{r();if(!autoRequireOnRestart)delete r;})
            }
        }
    }
}else{
    let rg = new RegExp('_grakkit@node_&newLine','g')
    server.on('_grakkit@node_&function',(f,...a)=>{eval(f.replace(rg,'\n'))(...a)})
}
