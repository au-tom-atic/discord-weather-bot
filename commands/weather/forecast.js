const axios = require("axios");
const dotenv = require("dotenv");
const Discord = require("discord.js");
const geocoding = require("../../helpers/geocoding");
const Compass = require("cardinal-direction");
dotenv.config();

module.exports = {
    name: "forecast",
    aliases: ["f"],
    description: "gives you a 5 day forecast",
    cooldown: 5,
    args: true,
    async execute(message, args) {
        let coords = await geocoding.getCoords(args.join(" "));
        let apiKey = process.env.WEATHER_KEY;
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lng}&appid=${apiKey}&units=imperial&exclude=minutely,hourly,alerts,current`;

        const response = await axios.get(url);

        if (response) {
            let weatherEmbeddedResponse = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle(`Weather Forecast`)
                .setAuthor(
                    "Tom L",
                    "https://static.thenounproject.com/png/967229-200.png",
                    "https://github.com/au-tom-atic/discord-weather-bot"
                )
                .setURL("https://openweathermap.org")
                .setDescription(`5 forcast for ${args.join(" ")}`)
                .setThumbnail
                //`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
                ()
                .setTimestamp()
                .setFooter("weather data provided by openweathermap");

            for (const [index, day] of response.data.daily.entries()) {
                if (index === 0)
                    weatherEmbeddedResponse.setThumbnail(
                        `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
                    );
                if (index === 5) break;
                let timestamp = day.dt;
                let forecastDate = new Date(timestamp * 1000);
                var month = forecastDate.getMonth() + 1;
                var date = forecastDate.getDate();
                var year = forecastDate.getFullYear();

                weatherEmbeddedResponse.addFields({
                    name: `${month}/${date}/${year}`,
                    value: `Min: ${day.temp.min}\u00B0F | Max: ${
                        day.temp.max
                    }\u00B0F | Chance of rain: ${day.pop * 100}%
                            Humidity: ${day.humidity}% | Dew Point: ${
                        day.dew_point
                    }\u00B0F | Wind: ${Compass.cardinalFromDegree(
                        day.wind_deg
                    )}@${day.wind_speed}mph   
                            UV Index: ${day.uvi} | Description: ${
                        day.weather[0].description
                    }`,
                });
            }

            message.channel.send(weatherEmbeddedResponse);
        } else {
            message.channel.send("Sorry, something went wrong.");
        }
    },
};
