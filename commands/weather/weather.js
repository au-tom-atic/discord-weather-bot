const request = require("request");
const dotenv = require("dotenv");
const Discord = require("discord.js");
dotenv.config();

module.exports = {
    name: "weather",
    aliases: ["w"],
    description: "gives you the weather, duh",
    cooldown: 5,
    args: true,
    execute(message, args) {
        const city = args.join("+");

        let apiKey = process.env.WEATHER_KEY;
        let cityName = city;
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

        request(url, function (err, response, body) {
            if (err) {
                console.log("error:", error);
                message.channel.send(
                    "Sorry, we encountered an error. Please try again or Google the weather or something"
                );
            } else {
                let weather = JSON.parse(body);
                try {
                    const weatherEmbeddedResponse = new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(`Weather Report`)
                        .setDescription(`Weather Report for ${weather.name}`)
                        .setThumbnail(`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`)
                        .addFields(
                            {
                                name: "Description",
                                value: `${weather.weather[0].main}, ${weather.weather[0].description}`,
                            },
                            {
                                name: "Current temp",
                                value: `${weather.main.temp}\u00B0`,
                                inline: true,
                            },
                            {
                                name: "Feels Like",
                                value: `${weather.main.feels_like}\u00B0`,
                                inline: true,
                            },
                            {
                                name: "Min/Max",
                                value: `${weather.main.temp_min}\u00B0/${weather.main.temp_max}\u00B0`,
                                inline: true,
                            }
                        )
                        .setTimestamp()
                        .setFooter(
                            "crazy weather we are having lately, right?",
                        );
                        message.channel.send(weatherEmbeddedResponse);      

                } catch (error) {
                    message.channel.send("something went wrong, sorry");
                }
            }
        });
    },
};
