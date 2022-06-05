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
    const [labels, setLabels] = useState([]);


    const [start, setStart] = useState(Date);
    const [end, setEnd] = useState(Date);

    let state = {
        labels: labels,
        datasets: [
            {
                label: label,
                fill: true,
                backgroundColor: ['rgba(75,192,192,0.3)', 'rgba(192,75,192,0.3)', 'rgba(192,192,75,0.3)'],
                borderColor: 'rgba(0,0,0,0.9)',
                borderWidth: 2,
                data: data
            }
        ]
    }

    // useEffect(() => {
    //     if ()
    // });

    const setLabelsValue = (array) => {
        let arr = []
        for (let index = 0; index < array.length; index++) {
            arr.push(`day ${index}`);
        }
        setLabels(arr)
    }
    const getFeatures = async () => {
        return await axios.get(`${serverURL}/researcher/features/${start}/${end}`);
    }

    const showSteps = async (e) => {

        let response = [10, 20, 45, 30, 55, 70, 60]//await getFeatures();
        // let response = await getFeatures();
        setLabel('Steps');
        setData(response);
        setLabelsValue(response);
        (showBar) ? setShowBar(false) : setShowBar(true);
    }
    const showHR = async () => {
        let response = await getFeatures();
        setData(response.data.HR);
        setLabelsValue(response.data.HR);
        setLabel('HR');
        (showBar) ? setShowBar(false) : setShowBar(true);
    }
    const showDistance = async () => {
        let response = await getFeatures();
        setData(response.data.Distance);
        setLabelsValue(response.data.Distance);
        setLabel('Distance');
        (showBar) ? setShowBar(false) : setShowBar(true);
    }
    const showAM = async () => {
        let response = await getFeatures();
        setData(response.data.Active_min);
        setLabelsValue(response.data.Active_min);
        setLabel('Active Minutes');
        (showBar) ? setShowBar(false) : setShowBar(true);
    }
    const showSleep = async () => {
        let response = await getFeatures();
        setData(response.data.Sleep);
        setLabelsValue(response.data.Sleep);
        setLabel('Hour of Sleeps');
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
        <div>
            <div >
                <Sidebar history={props.history} content={content} />
            </div>

            <div style={{ position: 'absolute', top: 20, left: '40%', width: '200px', backgroundColor: 'lightcyan' }}>
                <input type='date' className='start' value={start} onChange={e => setStart(e.target.value)} />
                <input type='date' className='end' value={end} onChange={e => setEnd(e.target.value)} />

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