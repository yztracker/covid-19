/* eslint-disable no-unused-vars */
import {Circle,Popup} from 'react-leaflet'
import React from 'react';
import numeral from 'numeral';

export const sortData =(data) =>{
    const sortedData=[...data];

    sortedData.sort((a,b)=>{
        if(a.cases>b.cases){
            return -1;
        }
        else{
            return 1;
        }
    
    });
    return sortedData;
}


//地圖上畫圓

export const showDataOnMap =(data,casesType="cases") =>(
    data.map(country=>(
        <Circle center={[country.countryInfo.lat, country.countryInfo.long]}
                fillOpacity={0.4}
        >
        
        </Circle>
    ))

)