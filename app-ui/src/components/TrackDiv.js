import React from 'react';
import '../App.css'
import trackURL from '../constants/trackURLs';


function TrackDiv({track}) {

    console.log("TrackDiv");

    return(
        
        <div className='track-contain'>
            <p>{track} and {trackURL}</p>
            
        </div>
    );
}

export default TrackDiv;