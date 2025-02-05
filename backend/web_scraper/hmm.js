
const cheerio = require("cheerio");
const axios = require("axios");

async function performScraping() {
    // downloading the target web page.
    // by performing an HTTP GET request in Axios
    
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://quotes.toscrape.com",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    let links = [];

    const $ = cheerio.load(axiosResponse.data);
    // finds the text section underneath the quote class
    // and prints it out on the console.
    
    $('.quote').find('.text').each((index, element) => {
        console.log(index, $(element).text());
    })
    
    $('a').each((index, element) => {
        let link = $(element).attr('href');

        links.push(link);
    })
    //console.log($('.quote').find('.text').text());    
    //console.log(axiosResponse.data);
}

console.log(performScraping())
var msg = 'Hello world';
console.log(msg);
