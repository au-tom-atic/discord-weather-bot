const Discord = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    description: "helps you",
    execute(message) {
        let helpEmbeddedMsg = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`Help`)
        .setAuthor(
            `Help Message`,
            "https://hotemoji.com/images/emoji/x/1nytysx1j5ajx.png",
            "https://github.com/au-tom-atic/discord-weather-bot"
        )
        .setURL("https://openweathermap.org")
        .setDescription(
            `Description of my commands. \n*{PLACE} is optional if a location is stored for your account*`
        )
        .setThumbnail(
            `https://hotemoji.com/images/emoji/x/1nytysx1j5ajx.png`
        )
        .addFields(
            {
                name: '`weather w minimal m {PLACE}`',
                value: `*Provides a concise weather report for {PLACE}*`,
            },
            {
                name: '`forecast f {PLACE}`',
                value: `*Provides a 3 day forecast for {PLACE}*`,
            },
            {
                name: '`detailed d dw {PLACE}`',
                value: `*Provides a detailed weather report for {PLACE}*`,
            },
            {
                name: '`alert advisory a {PLACE}`',
                value: `*Provides weather alerts for {PLACE}*`,
            },
            {
                name: '`units u [imperial | metric]`',
                value: `*Save preferences for metric or imperial*`,
            },
            {
                name: '`location l {PLACE}`',
                value: `*Remember this {PLACE} for weather, detailed weather, and alert commands*`,
            },
            {
                name: '`help h`',
                value: `*betterhelp.com/zeroweather for 10% off your first month*`,
            }
        )
        .setTimestamp()
        .setFooter("weather data provided by openweathermap");
    message.channel.send(helpEmbeddedMsg);
    },
};
