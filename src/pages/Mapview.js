import React, { useState,useCallback } from 'react';
import CustomNavbar from '../components/navbar/navbar';
import MapComponent from '../components/map/map';
import Sidebar from '../components/Sidebar/Sidebar';
import Slidebar from '../components/Slidebar/Slidebar';
import Popup from '../components/popup/popup';
import 'bootstrap/dist/css/bootstrap.min.css';
import SpinnerModal from './LoadingModal';
/**
 * The main page of the app.
 * @component
 * @returns {JSX.Element} The rendered Mapview component.
 */
export default function Mapview() {
  const [mapStyle, setMapStyle] = useState('light-v11');
  const [mapType, setMapType] = useState();
  const [year, setYear] = useState(0);
  const [showBar, setShowBar] = React.useState(false);
  const [lnglat, setLnglat] = useState([]);
  const [sourceisLoading, setSourceisLoading] = useState(false);
  const [yearList, setYearList] = useState([]);
  const [popUpview, setPopUpview] = useState(false);
  const [popUpSettings, setPopUpSettings] = useState([]);
  const [inputFile, SetinputFile] = useState(null);

  return (
    <div className="App vh-100">
      <MapComponent mapStyle={mapStyle} setYearList={setYearList} lnglat={lnglat} setShowBar = {setShowBar}  mapType={mapType} year={year} setPopUpview={setPopUpview} setPopUpSettings={setPopUpSettings} 
        setSourceisLoading={setSourceisLoading} inputFile={inputFile} /> 
      <SpinnerModal show={sourceisLoading} />
      <div className="app-body d-flex flex-column vh-100">
        <CustomNavbar onpressMap={setMapStyle} onChange={setLnglat} SetinputFile={SetinputFile}/>
        <div className="container-fluid h-100 w-100">
          <div className="row no-gutters h-100 w-100 d-flex align-items-end justify-content-center">
            <div className="col-3  align-self-start">
              <Sidebar onChange={setMapType} mapStyle={mapStyle} />
            </div>
            <div className="col-4 d-flex justify-content-center">
              {showBar ? <Slidebar yearList={yearList}  onChange={setYear} /> : null}
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
