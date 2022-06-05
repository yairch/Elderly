import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { serverURL } from '../../ClientUtils'



function ResearcherPage(props) {
    const [showBar, setShowBar] = useState(false);
    // const [showLine, setShowLine] = useState(false);
    const [data, setData] = useState([]);
    const [label, setLabel] = useState('');

    let state = {
        labels: ['day 1', 'day 2', 'day 3',
            'day 4', 'day 5', 'day 6', 'day 7'],
        datasets: [
            {
                label: label,
                fill: true,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: data
            }
        ]
    }

    // useEffect(() => {
    //     if ()
    // });

    const getFeatures = async () => {
        return await axios.get(`${serverURL}/researcher/features`);
    }

    const showSteps = async () => {
        let response = [10, 20, 45, 30, 55, 70, 60]//await getFeatures();
        // let response = await getFeatures();
        setLabel('Steps')
        setData(response);
        (showBar) ? setShowBar(false) : setShowBar(true);
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
                <input  type='date' className='from' value='from'/>
                <input type='date' className='to' value='to' />
            </div>
            {showBar &&
                <div style={{ position: "absolute", top: '100px', left: '25%', height: '50%', width: '40%', backgroundColor: 'white' }}>
                    <Bar style={{ textAlign: 'center' }}
                        data={state}
                        options={{
                            title: {
                                display: true,
                                fontSize: 20
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            },
                            scales: {
                                y:
                                {
                                    min: 0,
                                    max: 100,
                                    stepSize: 1,
                                },
                            }
                        }}
                    />
                    <Line style={{ textAlign: 'center' }}
                        data={state}
                        options={{
                            title: {
                                display: true,
                                fontSize: 20
                            },
                            legend: {
                                display: true,
                                position: 'right'
                            },
                            scales: {
                                y:
                                {
                                    min: 0,
                                    max: 100,
                                    stepSize: 1,
                                },
                            }
                        }} />
                </div>

            }
        </div>
    );
}

export default ResearcherPage;