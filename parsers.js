/** parsers.js - Contains all the parsers for the data scraper
 */



/** @namespace **/
var parsers = {};



/** Aurora Forecase parser - http://www.gi.alaska.edu/AuroraForecast/Alaska/
 *  @param {jQuery}     $       jQuery instance loaded with the HTML to parse
 *  @param {Object}     data    Configuration data
 */
parsers.aurora = function($, data) {
    
    var output = {};
    
    
    // The classes are in the form .level-{x}l and .level-{x}n where x is the level
    output.status = $('.levels [class^=level-][class$=l]').text().match(/^\w+/)[0];
    output.level = parseInt($('.levels [class^=level-][class$=n]').text(), 10);
    
    
    return output;
    
};



/** YXY Arrivals/Departures parser - http://www.gov.yk.ca/yxy/{arrivals,departures}.htm
 *  @param {jQuery}     $       jQuery instance loaded with the HTML to parse
 *  @param {Object}     data    Configuration data
 */
parsers.yxy = function($, data) {
    
    
    // Function to get the text of the nth child
    var nthChildUnbound = function(n) {
        
        // Get the innerText of child {n}
        return $('td:nth-child(' + n + ')', this).text();
        
    };
    
    
    // Map the table rows to objects
    return $('tr[bgcolor]').map(function(index, element) {
        
        var row = {};
        
        
        // Localize the nthChild function
        var nthChild = nthChildUnbound.bind(element);
        
        
        // Get the airline information
        row.airline = $('td:nth-child(2) img', element).attr('src');
        // Strip useless information
        row.airline = row.airline.match(/^([a-z]+)/i)[1];
        // Resolve any aliases
        row.airline = data.airlines[row.airline] || row.airline;
        
        
        // Get the rest of the information
        row.flight = nthChild(4);
        row.cities = nthChild(6);
        row.time   = nthChild(8);
        row.status = nthChild(10);
        
        
        // The departures page has an offset of 3 for time and status info
        if (data.page === 'departures') {
            
            row.time   = nthChild(8 + 3);
            row.status = nthChild(10 + 3);
            
        }
        
        // Parse the flight to an int
        row.flight = parseInt(row.flight, 10);
        
        
        return row;
        
    }).get();
    
    
};



/** Environment Canada parser - https://weather.gc.ca/city/jump_e.html?city=Whitehorse
 *  @param {jQuery}     $       jQuery instance loaded with the HTML to parse
 *  @param {Object}     data    Configuration data
 */
parsers.weather = function($, data) {
    
    
    var output = {};
    
    
    var temp = $('#mainContent span.wxo-metric-hide');
    var icon = temp.parent().parent().parent().prev().find('img');
    
    
    // Comments are still for the weak
    output.temperature = temp.first().text().replace(/\s/g, '');
    output.condition = icon.attr('alt');
    output.image = icon.attr('src');
    
    
    return output;
    
    
};



/** Export the parser **/
module.exports = parsers;
