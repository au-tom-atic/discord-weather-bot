module.exports = {
    name: "weather",
    aliases: ["w"],
    description: "gives you the weather, duh",
    cooldown: 5,
    args: true,
    execute(message, args) {
        const city = args.join(" ");
        message.channel.send("one day I will get the weather for " + city);
    },
};
