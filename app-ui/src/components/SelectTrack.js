import React, { useState } from 'react';
import trackList from '../constants/global'

function SelectTrack (trackname){


    const handleChange = event => {

        //Replace space with _ for URL 
        let trackString = trackname.trackname;
        //let trackURLAppend = trackString.replace(/ /g, '_');

        //Add to array
        if (event.target.checked) {
            console.log('Checked');
            console.log(trackString);

            trackList.push(trackString);
            console.info(trackList);
           
        } 
        //Remove from array
        else {
            console.log('Un-Checked');
            console.log(trackString);

            for (var i = 0; i < trackList.length; i++) {
                if (trackList[i] === trackString) {
                    console.log('Found!');
                    trackList.splice(i,1);
                    console.info(trackList);
                }
            }
        }
    }

    return (
        <td> 
            <input type="checkbox" onChange={handleChange} name="track" />&nbsp;
        </td>
    );
}

export default SelectTrack;