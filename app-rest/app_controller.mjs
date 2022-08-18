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

//GET Test
app.get('/', (req, res) => {

    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

    console.log(req.query.content);
    res.send(JSON.stringify(req.query.content));
});

//POST to Microservice 
app.post('/GetLink', (req, res) => {

    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });

    let url = "http://localhost:8080";

    let data = req.body;

    console.log("Express");
    console.log(data.url);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        //console.log(xhr.status);
        console.log(xhr.responseText);
        res.status(200).send(JSON.stringify(xhr.response));
    }};

    let wikiLink = '{"url": "https://en.wikipedia.org/wiki/' + data.url + '"}';

    console.log(wikiLink);

    xhr.send(wikiLink);
})

//Get Car Image 
app.get('/GetCar', async (req, res) => {

    console.log("GetCar");
    console.log(req.query.content);

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

        //Check URL String
        console.log(wikiURL);

        //Goto URL
        await page.goto(wikiURL);

        //Goto Info Box and get images 
        const imgSrcs = await page.evaluate ( () => {
            const srcs = Array.from(
                document.querySelectorAll('.infobox-image img')
            ).map((image) => image.getAttribute("src"));
            return srcs;
        });

        console.log("page has been loaded!");

        console.log(imgSrcs[0]);

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

//Get Info Box Test 
app.get('/GetInfoBox', async (req, res) => {

    console.log("GetInfoBox");
    console.log(req.query.content);

    //Replace space with _ for URL 
    let trackString = req.query.content;
    let track_URL = trackString.replace(/ /g, '_');
    console.log(track_URL);
    console.log("MPG " + req.query.mpg);

    // Wiki img scrapper 
    try {
        // Initialize Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //Wiki URL Base 
        const wikiURL = "https://en.wikipedia.org/wiki/" + track_URL;

        //Check URL String
        console.log(wikiURL);

        //Goto URL
        await page.goto(wikiURL);

        //Goto Info Box and search th
        const thInfo = await page.evaluate ( () => {
            const ths = Array.from(document.querySelectorAll('#mw-content-text > div.mw-parser-output > table.infobox.vcard tr')).map(th => th.innerText);
            return ths
        });
  
        console.log("Test thInfo: " + thInfo);
        console.log("Array length = " + thInfo.length);

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
            console.log("Looking through ths.. i = " + i + "thInfo[i]=" + thInfo[i]);
            console.log(" ");


            if (thInfo[i].includes("Location")) {
                console.log("!!!!!!!!!!! Found container for Location at " + i + thInfo[i] );
                console.log(" ");
                locationFound = true;
                tdLocation =  i;
            }
            
            if (thInfo[i].includes("Opened")) {
                console.log("!!!!!!!!!!! Found container for Opened at " + i + thInfo[i] );
                console.log(" ");
                openedFound = true;
                tdOpened =  i;
            }

            if ( surfaceFound === false && thInfo[i].includes("Surface")) {
                console.log("!!!!!!!!!!! Found container for Surface at " + i + thInfo[i] );
                console.log(" ");
                surfaceFound = true;
                tdSurface =  i;
            }

            if (thInfo[i].includes("Length") && lengthFound == false) {
                console.log("!!!!!!!!!!! Found container for Surface at " + i + thInfo[i] );
                console.log(" ");
                lengthFound = true;
                tdLength = i;
            }

            if (thInfo[i].includes("Turns") && turnsFound == false) {
                console.log("!!!!!!!!!!! Found container for Turns at " + i + thInfo[i] );
                console.log(" ");
                turnsFound = true;
                tdTurns = i;
            }

            if (thInfo[i].includes("record") && recFound == false) {
                console.log("!!!!!!!!!!! Found container for Lap Rec at " + i + thInfo[i] );
                console.log(" ");
                recFound = true;
                tdRec = i;
            }
        }
        
        //Get length num from string 
        let lengthString = thInfo[tdLength];
        let trackLengthNum = thInfo[tdLength].substring(7,11);
        console.log(lengthString);
        console.log(lengthString.substring(7,10));
        console.log("TRACK LENGTH NUM----------------------" + trackLengthNum)

        //Gas Estimate = 6 Sessions x 10 laps x trackLength 
        let gasEst = ((6 * 10 * parseInt(trackLengthNum)) / req.query.mpg);
        console.log("Gas Est NUM----------------------" + gasEst)
        
        res.send([{location: thInfo[tdLocation], opened: thInfo[tdOpened], surface: thInfo[tdSurface], length: thInfo[tdLength], turns: thInfo[tdTurns], lapRec: thInfo[tdRec], gas: gasEst}]);

    } 
    catch (error) 
    {
        console.log(error);

        //Send error message back
        res.send(JSON.stringify(error));
    }
})



async function gettdInfo(array, wiki) {

    console.log("GETTDINFO function!" + array + wiki);

    // Wiki img scrapper 
    try {
        // Initialize Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //Check URL String
        console.log("wiki: " + wiki);

        //Goto URL
        await page.goto(wiki);

        //Goto Info Box and get info
        const info = await page.evaluate ( () => {
            const tds = Array.from(document.querySelectorAll('#mw-content-text > div.mw-parser-output > table.infobox.vcard tr td')).map(td => td.innerText);
            return tds
        })

        console.log("page has been loaded!");

        console.log("Info Loop");
        for (let i = 0; i < info.length; i++) {
            console.log("info[" + i + "] = " + info[i]);
        }

        let trackData = [];

        //Add wanted tds to array to send back
        for (let i = 0; i < array.length; i++) {
            console.log("##### td: " + info[array[i]] + " " + i);
            trackData.push(info[array[i]]);
        }

        // End Puppeteer
        await browser.close();

        console.log("!!! trackData: " + trackData);
        let trackObj = [{}];

        //Add wanted tds to array to send back
        for (let i = 0; i < trackData.length; i++) {
            if (i == 0) {
                //Push Location
                trackObj.push({location: info[array[i]]})
            } else if (i == 1) {
                //Push Opened
                trackObj.push({opened: info[array[i]]})
            } else if (i == 2) {
                //Push Surface
                console.log("Adding surface at array index: " + array[i] + " i= " + i);
                console.log("info[array[i]] = " + info[array[i]]);
                trackObj.push({surface: info[array[i]]})
            } else if (i == 3) {
                //Push Length
                trackObj.push({length: info[array[i]]})
            } else if (i == 4) {
                //Push Turns
                trackObj.push({turns: info[array[i]]})
            } else if (i == 5) {
                //Push Lap rec
                if (info[array[i]] == undefined || null) {
                    trackObj.push({lapRec: "N/A"})
                } else {
                    trackObj.push({lapRec: info[array[i]]})
                }
            }
        }

        return trackObj;

    }
    catch (error) {
        console.log(error);
    }

};

//Used to increase row count for image 
async function checkTable(wiki) {
    console.log("checkTable function!" + wiki);

    let hasImg = false;

    // Wiki img scrapper 
    try {

        // Initialize Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //Check URL String
        console.log("wiki: " + wiki);

        //Goto URL
        await page.goto(wiki);

        //Goto Info Box and get info
        const rowInfo = await page.evaluate ( () => {
            //Check for imh in first row of table 
            const rows = Array.from(document.querySelectorAll('#mw-content-text > div.mw-parser-output > table.infobox.vcard tr')).map(tr => tr.childElementCount);
            return rows
        })

        console.log("page has been loaded!");

        console.log("HERE!!!!");

        console.log("rowInfo: " + rowInfo);

        if (rowInfo[0] == 1) {
            hasImg = true;
        } 

        // End Puppeteer
        await browser.close();

        return hasImg;

    }
    catch (error) {
        console.log(error);
    }
};


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});