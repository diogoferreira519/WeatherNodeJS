const constants = {
    openWeather :{
        BASE_URL : 'https://api.openweathermap.org/data/2.5/weather?q=',
        SECRET_KEY:'73e2858af92e61edb6718af650df1384',
        getSearch : function(city){
            return `https://api.openweathermap.org/data/2.5/find?q=${city}&appid=${this.SECRET_KEY}`
        }
    }
}
module.exports = constants;