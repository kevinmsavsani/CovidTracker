import {React, useState} from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import coronaIcon from '../../assets/covid19.png'
import 'leaflet/dist/leaflet.css';
import { useSelector } from 'react-redux'

const covidIcon = new Icon({
  iconUrl: coronaIcon,
  iconSize: [25, 25]
})


function CovidMap() {
  const [ activeCovid, setActiveCovid ] = useState( null );
  const data = useSelector((store) => store.items);

  return (
      <MapContainer 
          center = { [ 20.593683, 78.962883 ] }
          zoom = { 5 }
          scrollWheelZoom = { true } 
          className="h-5/6"
      >
      <TileLayer 
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        url = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
      />

       {/* <TileLayer 
          attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' 
          url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        /> */}
       {data.length && data.map(eachData => (
         <Marker 
            key={eachData.index} 
            position= {[eachData.latitude, eachData.longitude]}
            eventHandlers={{
              click: () => {
                setActiveCovid(eachData)
              }
            }}
            icon= {covidIcon}
          />
       ))}

      { activeCovid && (
        <Popup 
          position={ [ activeCovid.latitude, activeCovid.longitude ] }
          onClose={()=> {
            setActiveCovid(null)
          }} 
        >
          <div>
            <h1>{ activeCovid.location }</h1>
            <p>Total Active Cases:                { activeCovid.totalActive }</p>
            <p>Total cured/discharged: { activeCovid.curedCumulative }</p>
            <p>Deaths:                     { activeCovid.deathsCumulative }</p>
          </div>
        </Popup>
      )}

      </MapContainer> 
  );
}

export default CovidMap;


