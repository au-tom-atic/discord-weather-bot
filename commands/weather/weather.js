const request = require("request");
const dotenv = require("dotenv");
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
                message.channel.send(error.body.message);
            } else {
                console.log("body:", body);
                let weather = JSON.parse(body);
                try {
                    const weatherResponse = `Current temp in ${weather.name} is ${weather.main.temp}\u00B0F`;
                    message.channel.send(weatherResponse);
                }
                catch(error)
                {
                    message.channel.send('something went wrong, sorry');
                }
            }
        });
    },
};
