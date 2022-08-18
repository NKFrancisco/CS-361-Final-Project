import React, { useState } from 'react';
import trackList from '../constants/global'

function SelectTrack (trackname){

    const handleChange = event => {

        //Replace space with _ for URL 
        let trackString = trackname.trackname;

        //Add to array
        if (event.target.checked) {
            trackList.push(trackString);
        } 
        //Remove from array
        else {

            for (var i = 0; i < trackList.length; i++) {

                if (trackList[i] === trackString) {
                    trackList.splice(i,1);
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