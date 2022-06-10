import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { serverURL } from '../../ClientUtils'
import BarChart from '../charts/BarChart';


function ResearcherPage(props) {
    const [showBar, setShowBar] = useState(false);
    // const [showLine, setShowLine] = useState(false);
    const [data, setData] = useState([]);
    const [label, setLabel] = useState('');
    const [labels, setLabels] = useState(['1','2','3','4','5','6','7']);


    const [start, setStart] = useState();
    const [end, setEnd] = useState();

    function changeLable(newLabel){
        setLabel(prev => prev = newLabel);   
    }

    // useEffect(() => {
    //     if ()
    // });

    const getFeatures = async () => {
        return await axios.get(`${serverURL}/researcher/features`);
    }

    const showSteps = async (e) => {
        
        let response = [10, 20, 45, 30, 55, 70, 60]//await getFeatures();
        // let response = await getFeatures();
  
        
        setData(response);
        (showBar) ? setShowBar(false) : setShowBar(true);
        setLabel('Steps');
    }
    const showHR = async () => {
        let response = await getFeatures();
        setData(response.data.HR);
        setLabel('HR');
        (showBar) ? setShowBar(false) : setShowBar(true);
    }
    const showDistance = async () => {
        let response = await getFeatures();
        setData(response.data.Distance);
        setLabel('Distance')
            (showBar) ? setShowBar(false) : setShowBar(true);
    }
    const showAM = async () => {
        let response = await getFeatures();
        setData(response.data.Active_min);
        setLabel('Active Minutes')
            (showBar) ? setShowBar(false) : setShowBar(true);
    }
    const showSleep = async () => {
        let response = await getFeatures();
        setData(response.data.Sleep);
        setLabel('Hour of Sleeps')
            (showBar) ? setShowBar(false) : setShowBar(true);

    }

    const content = (
        <div className="buttons-section">
            <button
                className="sb-btn"
                onClick={() => showSteps()}>
                צעדים
            </button>
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
            <Sidebar history={props.history} content={content} />
            
            
            <div style={{width:'30%'}}>
                <input  type='date' className='start' value={start} onChange={e=>setStart(e.target.value)}/>
                <input type='date' className='end' value={end} onChange={e=>setEnd(e.target.value)} />
            </div>
            {showBar &&
                <div style={{ position: "absolute", top: '100px', left: '25%', height: '50%', width: '40%', backgroundColor: 'white' }}>
                    
                    <BarChart data ={data} label={label} labels = {['1','2','3','4','5','6','7',]}/>
                    
                </div>

            }
        </div>
    );
}

export default ResearcherPage;