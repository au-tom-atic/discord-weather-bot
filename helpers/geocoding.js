const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

async function getCoords(args) {
    //geocoding api request
    let googleKey = process.env.GOOGLE_KEY;
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        args
    )}&key=${googleKey}`;

    const response = await axios.get(url);

    const data = response.data;
    if (!data || data.status === "ZERO_RESULTS") {
        const error = new HttpError(
            "Could not find location for the given value.",
            422
        );
        throw error;
    }

    let locationData = {
        placeName: data.results[0].formatted_address,
        coords: data.results[0].geometry.location
    }

    return locationData;
}

exports.getCoords = getCoords;
