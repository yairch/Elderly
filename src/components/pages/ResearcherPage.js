import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';

function researcherPage(props){
    
    // useEffect(() => {
    //     if ()
    // });
        
    // const getFeatures = async() =>{
    //     let features = await axios()
    // }
    
    const showSteps= ()=>{

    }
    const showHR= ()=>{

    }
    const showDistance= ()=>{

    }
    const showAM= ()=>{

    }
    const showSleep= ()=>{

    }
    
    const content = (
    <div className="buttons-section">
        <button
            className="sb-btn"
            onClick={() => showSteps()}>
            צעדים
        </button><br />
        <button
            className="sb-btn"
            onClick={() => showHR()}>
            דופק
        </button>
        <button
            className="sb-btn"
            onClick={() => showAM()}>
            דקות אקטיביות
        </button>
        <button
            className="sb-btn"
            onClick={() => showDistance()}>
            מרחק
        </button>
        <button
            className="sb-btn"
            onClick={() => showSleep()}>
            שינה
        </button>
        

    </div>
);

    return (
		<div className="page">
			<Sidebar history={props.history} content={content}/>
		</div>
	);
}

export default researcherPage;