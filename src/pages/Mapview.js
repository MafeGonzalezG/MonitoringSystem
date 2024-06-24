import React, { useState } from 'react';
import CustomNavbar from '../components/navbar/navbar';
import MapComponent from '../components/map/map';
import Sidebar from '../components/Sidebar/Sidebar';
import Slidebar from '../components/Slidebar/Slidebar';
import Popup from '../components/popup/popup';
import 'bootstrap/dist/css/bootstrap.min.css';
import SpinnerModal from './LoadingModal';
export default function Mapview() {
  const [mapStyle, setMapStyle] = useState('light-v11');
  const [mapType, setMapType] = useState('');
  const [year, setYear] = useState(0);
  const [showBar, setShowBar] = React.useState(false);
  const [lnglatclick, setLnglatclick] = useState([]);
  const [lnglat, setLnglat] = useState([]);
  const [sourceisLoading, setSourceisLoading] = useState(false);
  const [max, setMax] = useState(10);
  const [popUpview, setPopUpview] = useState(false);
  const [popUpSettings, setPopUpSettings] = useState({});

  return (
    <div className="App">
      <MapComponent mapStyle={mapStyle} setMax={(max)=>setMax(max)} lnglat={lnglat} setlnglatclick={(newcoord)=>setLnglatclick(newcoord)}
        setShowBar = {(bar)=> setShowBar(bar)}  mapType={mapType} year={year} setPopUpview={(view)=>setPopUpview(view)} setPopUpSettings={(settings)=>setPopUpSettings(settings)}
        setSourceisLoading={(isloading)=>setSourceisLoading(isloading)}/> 
      <SpinnerModal show={sourceisLoading} />
      <div className="app-body">
        <CustomNavbar onpressMap={(map) => setMapStyle(map)} onChange={(newdir) => setLnglat(newdir)} />
        <div className="container-fluid h-100 w-100">
          <div className="row no-gutters h-100 w-100 d-flex align-items-end justify-content-between">
            <div className="col-4 justify-content-center">
              <Sidebar onChange={(newMapType) => setMapType(newMapType)} mapStyle={mapStyle} />
            </div>
            <div className="col-4 d-flex justify-content-center">
              {showBar ? <Slidebar max={max}  onChange={(newYear) => setYear(newYear)} /> : null}
            </div>
            <div className="col-4 justify-content-center">
              {popUpview ? <Popup onChange={setPopUpview} popUpSettings={popUpSettings}/> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
