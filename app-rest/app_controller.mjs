import 'dotenv/config';
import express, { query } from 'express';
import fetch from "node-fetch";
import XMLHttpRequest from 'xhr2';
import cors  from 'cors'
import puppeteer from 'puppeteer';
import e from 'express';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());


//CORS
app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
 }) 

app.use(cors({
    origin: '*'
}));


//POST to Partners Microservice 
app.post('/GetLink', (req, res) => {

    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

    let url = "http://localhost:8080";
    let data = req.body;
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {

    if (xhr.readyState === 4) {
        res.status(200).send(JSON.stringify(xhr.response));
    }};

    let wikiLink = '{"url": "https://en.wikipedia.org/wiki/' + data.url + '"}';

    xhr.send(wikiLink);
})


//GET Car Image wiki scrapper
app.get('/GetCar', async (req, res) => {

    //Set res parameters
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    
    // Wiki img scrapper 
    try {
        // Initialize Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //Wiki URL Base 
        const wikiURL = "https://en.wikipedia.org/wiki/" + req.query.content;

        //Goto URL
        await page.goto(wikiURL);

        //Goto Info Box and get images 
        const imgSrcs = await page.evaluate ( () => {
            const srcs = Array.from(
                document.querySelectorAll('.infobox-image img')
            ).map((image) => image.getAttribute("src"));
            return srcs;
        });

        // End Puppeteer
        await browser.close();

        //Send back URL 
        res.send(JSON.stringify(imgSrcs[0]));

      } catch (error) {
        console.log(error);

        //Send error message back
        res.send(JSON.stringify("Could not find make or model"));
      }
    
});


//Get Info Box wiki scrapper 
app.get('/GetInfoBox', async (req, res) => {

    //Replace space with _ for URL 
    let trackString = req.query.content;
    let track_URL = trackString.replace(/ /g, '_');

    // Wiki img scrapper 
    try {
        // Initialize Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //Wiki URL Base 
        const wikiURL = "https://en.wikipedia.org/wiki/" + track_URL;

        //Goto URL
        await page.goto(wikiURL);

        //Goto Info Box and search th
        const thInfo = await page.evaluate ( () => {
            const ths = Array.from(document.querySelectorAll('#mw-content-text > div.mw-parser-output > table.infobox.vcard tr')).map(th => th.innerText);
            return ths
        });

        //Look for th titles wanted add index to array
        let tdIndex = [];
        let locationFound = false;
        let openedFound = false;
        let surfaceFound = false;
        let lengthFound = false; 
        let turnsFound = false;
        let recFound = false;
        let tdLocation;
        let tdOpened;
        let tdSurface;
        let tdLength;
        let tdTurns;
        let tdRec;

        //Loop through and find column titles wanted 
        for (let i = 0; i < thInfo.length; i++){

            if (thInfo[i].includes("Location")) {
                locationFound = true;
                tdLocation =  i;
            }
            
            if (thInfo[i].includes("Opened")) {
                openedFound = true;
                tdOpened =  i;
            }

            if ( surfaceFound === false && thInfo[i].includes("Surface")) {
                surfaceFound = true;
                tdSurface =  i;
            }

            if (thInfo[i].includes("Length") && lengthFound == false) {
                lengthFound = true;
                tdLength = i;
            }

            if (thInfo[i].includes("Turns") && turnsFound == false) {
                turnsFound = true;
                tdTurns = i;
            }

            if (thInfo[i].includes("record") && recFound == false) {
                recFound = true;
                tdRec = i;
            }
        }
        
        //Get length num from string 
        let lengthString = thInfo[tdLength];
        let trackLengthNum = thInfo[tdLength].substring(7,11);

        //Gas Estimate = 6 Sessions x 10 laps x trackLength 
        let gasEst = ((6 * 10 * parseInt(trackLengthNum)) / req.query.mpg);
        
        res.send([{location: thInfo[tdLocation], opened: thInfo[tdOpened], surface: thInfo[tdSurface], length: thInfo[tdLength], turns: thInfo[tdTurns], lapRec: thInfo[tdRec], gas: gasEst}]);

    } 
    catch (error) {
        console.log(error);
        //Send error message back
        res.send(JSON.stringify(error));
    }
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});