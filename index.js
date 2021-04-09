const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');

dotenv.config();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
	if(message.content === '-hello') {
        message.channel.send('sup?');
    }

    if(message.content === '-goodbye') {
        message.channel.send('c ya');
    }

    if(message.content === '-help') {
        message.channel.send('chill, I am barely starting');
    }
});

client.login(process.env.DISCORD_BOT);