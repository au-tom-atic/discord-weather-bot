module.exports = {
    name: "help",
    aliases: ["h"],
    description: "helps you",
    execute(message) {
        message.channel.send("not ready to help you yet");
    },
};
