
const constants  = require('../config.js');
const request = require('request');

const weatherData = (address, callback) => {
    let endereco = address.trim()
    const url = constants.openWeather.BASE_URL + encodeURIComponent(endereco) + '&appid=' + constants.openWeather.SECRET_KEY + '&lang=pt_br&units=metric';
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Não conseguiu capturar os dados da OpenWeather API', undefined)
        } else {
            callback(undefined, {
                cityName: body.name,
                temperature: body.main.temp,
                umidade: body.main.humidity,
                descricao: body.weather[0].description,
                wind: body.wind.speed,
                main: body.weather[0].main,
                nascerdoSolTimeStamp: body.sys.sunrise,
                pordoSolTimeStamp: body.sys.sunset,
            })
        }
    });
};
module.exports = weatherData;
