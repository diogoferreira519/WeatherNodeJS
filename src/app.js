const express = require('express');
const hbs = require("hbs");
const path = require("path");
const app = express();

const weatherData = require('../utils/weatherData');

const port = process.env.PORT || 3000

const publicStaticDirPath = path.join(__dirname, '../public')

const viewsPath = path.join(__dirname, '../templates/views');

const partialsPath = path.join(__dirname, '../templates/partials');

app.use(express.static(publicStaticDirPath));

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App'
    })
})
app.get('/weather', (req, res) => {
    const address = req.query.address
    if (!address) {
        return res.send({
            error: 'deve passar um endereço na caixa de texto da busca'
        })
    }
    weatherData(address, (error, { temperature, descricao, cityName, umidade, wind, main, nascerdoSolTimeStamp, pordoSolTimeStamp}) => {
        if (error) {
            return res.send({
                error
            })
        }
        res.send({
            temperature,
            descricao,
            cityName,
            umidade,
            wind,
            main,
            nascerdoSolTimeStamp,
            pordoSolTimeStamp
        })
    })
});
app.get("*", (req, res) => {
    res.render('404', {
        title: "page not found"
    })
})
app.listen(port, () => {
    console.log('Servidor rodando na porta:', port);
});