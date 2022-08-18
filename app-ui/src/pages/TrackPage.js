import React from 'react';
import { Link } from 'react-router-dom';
import TrackList from '../components/TrackList';
import CarDiv from '../components/CarDiv';

import tracks from '../constants/global';
import trackURL from '../constants/trackURLs';
import carInfo from '../constants/car';



function TrackPage() {


  function printArray() {
    console.log("Track List " + tracks);
    console.log("Track URLS " + trackURL);
    console.log(carInfo);
  }

    return (
      <>
        <h2>Race Tracks Selected</h2>
        <Link className='link' to ="/">Return to Home Page</Link>
        <CarDiv></CarDiv>
        <TrackList tracks={tracks}></TrackList>
      </>
    );
  }
  
  export default TrackPage;