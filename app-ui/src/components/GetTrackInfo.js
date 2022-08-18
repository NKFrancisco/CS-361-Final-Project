import React from 'react';
import carInfo from '../constants/car';
import trackList from '../constants/global';
import trackURL from '../constants/trackURLs';
import trackInformation from '../constants/trackInformation';


function getInfo(vehicleInfo) {

    let trackName = '';
    let trackLinks = [];
    let trackLocation = '';
    let trackOpened = '';
    let trackSurface = '';
    let trackLength = '';
    let trackTurns = '';
    let trackRec = '';
    let gasEst = '';

    //Calls Partner Microservice 
    //Get Offical Links 
    const callMicro = async (trackName) => {

        //Replace space with _ for URL 
        let trackString = trackName;
        let trackURLAppend = trackString.replace(/ /g, '_');
        console.log(trackURLAppend);

        //Body data
        let trackBody = {url: trackURLAppend};

        //Parameters
        const params = {
            body: JSON.stringify(trackBody),
            mode: 'cors',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            method: "POST"
        }

        console.log(params.body);

        fetch('http://localhost:3000/GetLink', params)
        .then((response) => response.json())
        .then((data) => {
            //Get URL from resonse removing excess 
            let dataString = data;
            console.log("dataString: " + dataString);
            let stringStart = dataString.search("http");
            let stringEnd = dataString.length - 2;
            let url = dataString.slice(stringStart, stringEnd);
            console.log(url);
            trackURL.push(url)
            //trackLink = url;
            trackLinks.push(url);
        });
    }

    //Get car image 
    const getImg = async () => {

        console.log("getImg");

        //Make_Model String
        let makeModel = carInfo.make + "_" + vehicleInfo.model;
        //console.log(makeModel);

        //Call my microservice to get car image url
        const response = await fetch('http://localhost:3000/GetCar?' 
        + new URLSearchParams({
        'content': `${makeModel}`
        }))

        const data = await response.json();

        //Save url 
        if (data != undefined) {
            carInfo.url = data;
        }
    };

    //Get track info 
    const getInfo = async (trackName, trackLink) => {

        console.log("getInfo on " + trackName);
        console.log("getInfo on " + trackLink);

        //Body data
        let trackBody = {'content': `${trackName}`};

        //Call my microservice to get track info
        const response = await fetch('http://localhost:3000/GetInfoBox?' 
        + new URLSearchParams({
        'content': `${trackName}`,
        'mpg': `${carInfo.mpg}`
        }))
        .then((response) => response.json())
        .then((data) => {
            
            trackLocation = data[0].location
            trackOpened = data[0].opened
            trackSurface = data[0].surface
            trackLength = data[0].length
            trackTurns = data[0].turns
            if (data[0].lapRec == null) {
                trackRec = "N/A"
            } else {
                trackRec = data[0].lapRec;
            }
            gasEst = data[0].gas

            const abc = JSON.stringify(data);
            console.log(abc);

        });

        //Add to object to array 
        let tempObj = {
            name: trackName, 
            url: trackLink, 
            location: trackLocation, 
            opened: trackOpened,
            surface: trackSurface,
            len: trackLength,
            turns: trackTurns,
            lapRec: trackRec,
            gas: gasEst
         }

         trackInformation.push(tempObj);
    };
    
    //Save Vechicle info 
    carInfo.make = vehicleInfo.make;
    carInfo.model = vehicleInfo.model;
    carInfo.mpg = vehicleInfo.mpg;

    //Get car image 
    getImg();

    //Loop through track list and get data 
    for (let i = 0; i < trackList.length; i++) {
        callMicro(trackList[i]);
        getInfo(trackList[i], trackLinks[i]);
    }

}

export default getInfo;
