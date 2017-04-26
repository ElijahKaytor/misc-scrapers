/** scraper.js - Fetches the HTML data for parsers.js to parse
 */



/** Get the configs **/
var configs = require('./configs');



/** Load dependencies **/
// Parses the parse the HTML
var parsers = require('./parsers');
// Cheerio to load jQuery
var cheerio = require('cheerio');
// Unirest to make HTTP requests dead simple
var rest = require('unirest');
// Path library to get output filenames
var path = require("path");
// FileSystem API to write the output
var fs = require("fs");



/** Allow Self-signed certificates **/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';



/** Output folder **/
var outputFolder = 'data/';



/** Loop through all of the scrapers **/
Object.keys(configs).forEach(function(scraper) {
    
    var config = configs[scraper];
    var parser = parsers[scraper];
    
    
    // Set undefined configuration values
    config.pages = config.pages || [];
    config.aliases = config.aliases || {};
    
    
    // Get the URLs to scrape
    var urls = [config.url];
    
    // If it is a function, map the pages to URLs
    if (typeof config.url === 'function') {
        
        urls = config.pages.map(config.url);
        
    }
    
    
    // Count of URLs downloaded
    var urlsDownloaded = 0;
    // Object to store the data
    var data = {};
    
    // Scrape each of the URLs
    urls.forEach(function(url, index) {
        
        // Get the page
        var page = config.pages[index];
        
        // Download the URL
        rest.get(url).end(function(response) {
            
            console.log('Data receieved for %s:%s', scraper, page || 'root');
            
            // Load jQuery
            var $ = cheerio.load(response.body);
            
            // Call the parser
            if (config.pages.length > 1) {
                
                // Set the page for the parser
                config.page = page;
                
                // Check for page aliases
                page = config.aliases[page] || page;
                
                // If there is more than one page, store the result in a key 
                data[page] = parser($, config);
                
            } else {
                
                // If there is only one result, store the entire result as the data
                data = parser($, config);
                
            }
            
            
            
            // Increment the completed parse count
            urlsDownloaded++;
            
            // Check to see if we're done
            if (urlsDownloaded === urls.length) {
                
                var output = path.join(outputFolder + config.output);
                console.log('Saving %s...', output);
                
                // Add an updatedAt key if there is more than one page
                if (config.pages.length > 1) data.updatedAt = +new Date();
                
                // Write the data
                fs.writeFileSync(output + '.min.json', JSON.stringify(data));
                fs.writeFileSync(output + '.json', JSON.stringify(data, null, 4));
                
                console.log('...done');
                
            }
            
        });
        
    });
    
});
