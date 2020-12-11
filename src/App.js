/* eslint-disable no-unused-vars */
import React,{useState,useEffect} from 'react';
import './App.css';
import {FormControl, Select, MenuItem,Card, CardContent, Button,Grid} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';
import './util';
import {sortData} from "./util";

function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState('worldwide');
  const [countryInfo,setCountryInfo] =useState({})
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setMapCenter]=useState({lat:33.33,lng:-40.44});
  const [mapZoom,setMapZoom]=useState(3);
  const [data,setData]=useState({});
  const [mapCountries,setMapCountries]=useState([]); 
  useEffect(()=>{
    //讓worldwide顯示出資料，因為它不屬於country
    //index.js:1 Warning: Each child in a list should have a unique "key" prop. 會出現這個錯誤

    fetch("https://disease.sh/v3/covid-19/all")
      .then((response)=>response.json())
      .then((data)=>{
        setCountryInfo(data);
      });
  },[]);


  useEffect(() => {
    //程式碼在這裏面會被執行一遍
    //async -> send a request ,wait for it, do something with input
    const getCountriesData =async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name:country.country,
            value:country.countryInfo.iso2,
            
          }
        ));
        const sortedData = sortData(data);
        setData(data);
        setTableData(sortedData); 
        setCountries(countries); //只有countries 的部分
        setMapCountries(data); //全部的資料

      });
    };
    getCountriesData();
  }, [])


  const onCountryChange = async (event)=>{
    const countryCode=event.target.value;

    setCountry(countryCode);
    
    //得到country資料
    const url = countryCode === 'worldwide'  ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
     


    await fetch(url)
    .then(response =>response.json())
    .then(data =>{
      setCountry(countryCode);

      


      // All of the data from the country response
      setCountryInfo(data);
      



      //console.log(data.countryInfo)
      if(countryCode === "worldwide"){
        setMapCenter([34.80746, -40.4796]);
      }else{
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
      }
      //跟上面同結果
      /*countryCode === "worldwide"
      ? setMapCenter([34.80746, -40.4796])  
      : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);*/



    })
  }

  return (
    
    <div className="App">
      <div className="app_left">

      <div className="app_header">
      <h1>covid-19</h1>
      <FormControl className="app_dropdown">
        <Select
          variant='outlined'
          value={country}
          onChange={onCountryChange} >
          {/*用迴圈得到全部的國家*/}

              <MenuItem value='worldwide'>worldwide</MenuItem>
            
          {
            countries.map(country=>(
              <MenuItem value={country.value} >{country.name}</MenuItem>
            ))
          }

          </Select>
      </FormControl>
      </div>

      {/*InfoBOxs*/}
      <div className="app_stats">
        <InfoBox title='Conronavirus Cases' cases={countryInfo.todayCases} total={countryInfo.cases}/>
        <InfoBox title='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
        <InfoBox title='Deathes' cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>

      </div>
      <Map
          countries={mapCountries} //得到MapCountries State的資料
          center={mapCenter} //得到{lat,long}
          zoom={mapZoom} 
      />
      </div>
      <Card className="div_right">

          <CardContent>
          <h2 className="div_right_h2">Cases by country</h2>

          <Button className="Case_sort_people" onClick={(e)=>setTableData(data)}>A-Z排序</Button>

          <Table countries={tableData} />
          <LineGraph />
          </CardContent>
      </Card>

    </div>
  );
}

export default App;
