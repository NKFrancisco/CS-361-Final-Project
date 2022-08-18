import React from 'react';
import SelectTrack from './SelectTrack'

function TrackRow ({track}) {

    return (
        <tr>
            <SelectTrack trackname={track.name}/>
            <td>{track.name}</td>
            <td>{track.city}</td>
            <td>{track.state}</td>
        </tr>
    );
}

export default TrackRow;