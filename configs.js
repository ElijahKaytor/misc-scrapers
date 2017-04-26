/** configs.js - Contains configuration for the scraper
 */



/** @namespace **/
var config = {};



/** Northern Lights forecast **/
config.aurora = {
    
    url: 'http://www.gi.alaska.edu/AuroraForecast/Alaska/',
    output: 'aurora',
    
};



/** YXY Arrivals/Departures confgiuration **/
config.yxy = {
    
    url: [].join.bind(['http://www.hpw.gov.yk.ca/yxy/', '.htm']),
    pages: ['arrivals', 'departures'],
    
    output: 'yxy',
    
    // Airline aliases
    airlines: {
        
        wj: 'West Jet',
        ac: 'Air Canada',
        airnorth: 'Air North',
        
    },
    
};



/** Weather scraper configuration **/
config.weather = {
    
    url: [].join.bind(['https://weather.gc.ca/city/jump_e.html?city=', '']),
    pages: [
        
        'Dawson, YT',
        'Whitehorse',
        'Watson Lake',
        //'Vancouver',
        //'Atlin',
        
    ],
    
    // City aliases
    aliases: {
        
        'Dawson, YT': 'dawson',
        'Whitehorse': 'whitehorse',
        'Watson Lake': 'watsonlake',
        
    },
    
    output: 'weather',
    
};



/** Export the configuration **/
module.exports = config;
