module.exports = function (server){
    server.require=(module,autoRequireOnRestart)=>{
        let r = ()=>server.eval(`require('${path.join(__dirname,'../../',module)}')`)
        if(server.ready){
            r()
            if(autoRequireOnRestart) return server.on('ready',()=>r())
            delete r
        }else{
            server[autoRequireOnRestart?'on':'once']('ready',()=>{r();if(!autoRequireOnRestart)delete r;})
        }
    }
}
