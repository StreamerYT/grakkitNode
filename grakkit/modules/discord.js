let discord = require('discord.js')
server.discord = new discord.Client()
let settings

module.exports = s=>{
    settings=s
    s.chatregex2=s.chatregex2.split("username").map(t=>t.includes('text')?t.split('text'):t)
    server.discord.once('ready',()=>{
        if(settings.console){
            server.discord.on('message',(msg)=>{
                if(msg.author.bot) return 0;
                if(msg.channel.id!=settings.console) return 0;
                let cmd = msg.content.split(" ")[0].toLowerCase()
                if(cmd=='eval'||cmd=='grakkit:eval') return msg.reply("It is forbidden to use eval so that it is not possible to hack the server through discord")
                server.jar.stdin.write(msg.content+'\n')
                setTimeout(()=>send(),250)
            })
            settings._dconsole=[]
            server.on('console',m=>settings._dconsole.push(m))
            function send(m='') {
                if(settings._dconsole.length<1) return 0;
                m+=settings._dconsole.splice(0,1)[0]
                if(settings._dconsole.length>0&&(m+'\n'+settings._dconsole[0]).length<=1200) return send(m+'\n')
                server.discord.channels.cache.get(settings.console).send(m)
            }
            setInterval(()=>send(),5000)
        }
        if(settings.chat&&settings.chatregex1&&settings.chatregex2&&settings.chatsend){
            console.log(settings.chatregex2)
            server.discord.on("message",(msg)=>{
                if(msg.author.bot) return 0;
                if(msg.channel.id!=settings.chat) return 0;
                server.jar.stdin.write(`tellraw @a {"text":"${settings.chatsend.replace('username',msg.author.username).replace('text',msg.content.replace('"','\\"'))}"}\n`)
            })
            server.on('console',msg=>{
                if(!!settings.chatregex1.exec(msg)){
                    msg=msg.split(settings.chatregex2[0])[1]
                    console.log(msg)
                    msg=msg.split(settings.chatregex2[1][0])
                    server.discord.channels.cache.get(settings.chat).send(`**${msg.join("**: ")}`)
                }
            })
        }

        console.log(`Discord ready!`)
        if(s.startServer) server.start()
    })
    server.discord.login(settings.token)
}
