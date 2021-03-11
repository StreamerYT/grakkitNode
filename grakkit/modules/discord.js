let Discord = require('discord.js');

module.exports = function (server,cfg,bot,ready=false) {
    if(cfg.console){
        server._logs = []
        server.on('console',m=>server._logs.push(m))
    }
    function botready() {
        bot.on('message',msg=>{if(msg.author.bot) return 0;
            switch (msg.channel.id){
                case (cfg.console?`${cfg.console}`:0):
                    let cmd = msg.content.split(" ")[0].toLowerCase()
                    if(cmd=='eval'||cmd=='grakkit:eval') 
                        return msg.reply("It is forbidden to use eval so that it is not possible to hack the server through discord")
                    server.execute(msg.content);
                break;
                case (cfg.chat?`${cfg.chat}`:0):
                    let message=cfg.chatregex.replace('$%message%$',msg.content).replace('$%username%$',msg.author.tag)
                    server.execute(`tellraw @a {"text":"${message}"}`)
                break;
                default:
                    if(msg.content.toLowerCase()=='grakkit@channel') msg.channel.send(`Channel id: ${msg.channel.id}`)
                break;
            }
        })
        if(cfg.console){
            function send(msg='') {
                if(server._logs.length<=0) return 0;
                msg+=server._logs.splice(0,1)[0]
                if( server._logs.length>=1 && (msg+'\n'+server._logs[0]).length<=1000 ) return send(msg+'\n')
                bot.channels.cache.get(cfg.console).send(msg)
            }
            setInterval(()=>send(),5000)
        }
        if(cfg.chat){
            let cr = cfg.chatregex.split("$%username%$").map(t=>t.includes('$%message%$')?t.split('$%message%$'):t)
            let regex = cfg.chatregex
                .replace('$%username%$','\\w{1,999}')
                .replace('$%message%$','.{1,999}')
                .replace(/\s/g,'\\s')
            regex = new RegExp(regex, '')
            server.on('console',msg=>{
                if(!server._ready)return 0;
                if(!!regex.exec(msg)){
                    msg=msg.split(cr[0])[1]
                    msg=msg.split(cr[1][0])
                    bot.channels.cache.get(cfg.chat).send(`**${msg.join("**: ")}`)
                }
            })
        }
    }
    if(!bot){
        bot=new Discord.Client()
        bot.login(cfg.token)
        if(ready) botready();
        else bot.once('ready',botready)
    }else{
        bot.once('ready',botready)
    }
    return bot
}
