import React from 'react';
import TrackRow from './TrackRow'
import '../App.css'

function TrackTable({tracks}) {
    return(
        <div className='list-contain'>
            <table>
                <thead>
                    <tr>
                    <th> </th>
                    <th>Name</th>
                    <th>City</th>
                    <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track, i) => <TrackRow track={track} key={i}/>)}
                </tbody>
            </table>
        </div>
    );
}

export default TrackTable;