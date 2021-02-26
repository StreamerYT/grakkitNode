let node = !!globalThis.process 

if(node){
    server.initModule('require')
    server.require('./grakkit/modules/function.js')
    server.function = function (f,...args){
        server.emit('_grakkit@node_&function_',f.toString().replace(/\n/g,'_grakkit@node_&newLine_'),...args)
    }
}else{
    let rg = new RegExp('_grakkit@node_&newLine_','g')
    server.on('_grakkit@node_&function_',(f,...a)=>eval(f.replace(rg,'\n'))(...a))
}
