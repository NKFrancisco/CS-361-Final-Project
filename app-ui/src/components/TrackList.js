import React from 'react';
import '../App.css'
import trackURL from '../constants/trackURLs';
import trackInformation from '../constants/trackInformation';

function TrackList({tracks}) {

    return(
        <div className='list-contain'>
            {trackInformation.map((track, i) => {
                return (
                <div key={`${track.name} 
                    ${track.url} 
                    ${track.location}
                    ${track.opened}
                    ${track.surface}
                    ${track.len}
                    ${track.turns}
                    ${track.lapRec}
                    ${track.gasEst}`} 
                    className='track-contain'>
                        <h3>{track.name}</h3>
                        <a href={track.url}>{track.url}</a>
                        <a href={trackURL[i]}>{trackURL[i]}</a>
                        <p>{track.location}</p>
                        <p>{track.opened}</p>
                        <p>{track.surface}</p>
                        <p>{track.len}</p>
                        <p>{track.turns}</p>
                        <p>{track.lapRec}</p>
                        <p>Gas Use Estimate(Gal): {track.gas}</p>
                </div>
                );
            })}
        </div>
    );
}

export default TrackList;