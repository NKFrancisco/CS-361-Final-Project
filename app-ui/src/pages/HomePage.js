import React from 'react';
import tracks from '../data/tracks';
import TrackTable from '../components/TrackTable';
import trackList from '../constants/global'
import getInfo from '../components/GetTrackInfo';
import trackInformation from '../constants/trackURLs';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";


function HomePage() {

  const [vehicleInfo, setVechicleInfo] = useState({
    make: '',
    model: '',
    mpg:''
  });

  const handleChange = (event) => {
    setVechicleInfo({ ...vehicleInfo, [event.target.name]: event.target.value });
    console.log(vehicleInfo);
  };
    
  let history = useHistory();
        
  const handleSubmit = (event) => {
      console.log("handleSubmit");
      getInfo(vehicleInfo);
      event.preventDefault();
      setTimeout(() => {
        console.log("setTimeout");
        history.push(`/TrackPage`);
      }, 2500); 
  };

    return (
      <>
      
        <h2>Race Tracks of America</h2>
        <p>Directions: Enter vehicle information then select one or more tracks to get more information</p>
        <form onSubmit={handleSubmit}>
          <label>Make: </label>
          <input type="text" name="make" value={vehicleInfo.make} onChange={handleChange} required></input>
          <label>Model: </label>
          <input type="text" name="model" value={vehicleInfo.model} onChange={handleChange} required></input>
          <label>MPG: </label>
          <input type="text" name="mpg" value={vehicleInfo.mpg} onChange={handleChange} required></input>
        
        <br></br>
        
        <TrackTable tracks={tracks}></TrackTable>
          <input type='submit'></input>
        </form>

      </>
    );
  }

  export default HomePage;