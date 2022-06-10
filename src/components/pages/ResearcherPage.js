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
    const [labels, setLabels] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);


    const handleStart = (s) => {
        if (s) {
            setStart(s)
        }
    }

    const handleEnd = (e) => {
        if (e) {
            setEnd(e);
        }
    }

    const [start, setStart] = useState();
    const [end, setEnd] = useState();


    const setLabelsValue = (array, st) => {
        let arr = [];
        let s = (start) ? new Date(start) : new Date(st);
        for (let index = 0; index < array.length; index++) {
            s.setDate(s.getDate() + 1);
            arr.push(`${s.getFullYear()}-${s.getMonth()+1}-${s.getDate()}`);
        }
        setLabels(arr)
    }
    const getFeatures = async () => {
        return await axios.get(`${serverURL}/researcher/features/${start}/${end}`);

    }
    const setForGragh = async (arr) => {
        if (arr.length > 0) {
            setData(arr[0]);
            setLabelsValue(arr[0], +arr[1]);
        } else {
            setData(arr);
            setLabelsValue(arr);
        }

        (showBar) ? setShowBar(false) : setShowBar(true);
    }



    const showSteps = async (e) => {
        // let response = [10, 20, 45, 30, 55, 70, 60]//await getFeatures();
        let response = await getFeatures();
        let arr = [];
        if (response.data.Steps.length > 0) {
            arr = extract(response.data.Steps[0].days, response.data.Steps[0].start);


        }
        setLabel('Steps');
        setMin(1000);
        setMax(20000);
        setForGragh(arr);
    }
    const showHR = async () => {
        let response = await getFeatures();
        let arr = [];
        // console.log(response);
        if (response.data.HR.length > 0) {
            arr = extract(response.data.HR[0].days, response.data.HR[0].start);


        }
        setLabel('HR');
        setMin(0);
        setMax(130);
        setForGragh(arr);
    }
    const showDistance = async () => {
        let response = await getFeatures();
        let arr = [];
        if (response.data.Distance.length > 0) {
            arr = extract(response.data.Distance[0].days, response.data.Distance[0].start);

        }
        setLabel('Distance');
        setMin(0);
        setMax(15000);
        setForGragh(arr);
    }
    const showAM = async () => {
        let response = await getFeatures();
        let arr = [];
        if (response.data.Active_min.length > 0) {
            arr = extract(response.data.Active_min[0].days, response.data.Active_min[0].start);

        }
        setLabel('Active Minutes');
        setMin(0);
        setMax(300);
        setForGragh(arr);
    }

    const showSleep = async () => {
        let response = await getFeatures();
        let arr = [];
        if (response.data.Sleeping.length > 0) {
            arr = extract(response.data.Sleeping[0].days, response.data.Sleeping[0].start);

        }
        setLabel('Hour of Sleeps');
        setForGragh(arr);
    }

    const extract = (days_dict, startPulled) => {
        let result = []
        if (!start || !end || start < startPulled) {
            for (let key in days_dict) {
                result.push(Object.values(days_dict[key])[0])
            }
        }
        else {
            let arr = [];
            let s = new Date(start);
            let e = new Date(end);
            const numOfDaysGraph = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24));
            if (parseInt(startPulled) === s.getTime()) {
                arr = days_dict.slice(0, numOfDaysGraph);
            }
            let startP = new Date(+startPulled);
            const DiffStarts = Math.ceil(Math.abs(s - startP) / (1000 * 60 * 60 * 24));
            arr = (numOfDaysGraph + DiffStarts > days_dict.length) ? days_dict.slice(DiffStarts, days_dict.length) : days_dict.slice(DiffStarts, numOfDaysGraph + DiffStarts);
            console.log(arr);
            for (let key in arr) {
                result.push(Object.values(arr[key])[0])
            }
        }

        return [result, startPulled];
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
            
            <div style={{ position: 'absolute', top: 20, left: '65%', width: '200px', backgroundColor: 'lightcyan' }}>
                 <input type='date' className='start' value={start} onChange={e => handleStart(e.target.value)} />
                 <input type='date' className='end' value={end} onChange={e => handleEnd(e.target.value)} />
            </div>
            {showBar &&
                <div style={{ position: "absolute", top: '100px', left: '25%', height: '50%', width: '40%', backgroundColor: 'white' }}>
                    
                    <BarChart data ={data} label={label} labels={labels} min={min} max={max}/>
                </div>
            }

        </div>
    );
}

export default ResearcherPage;





                    
        // <div>
        //     <div >
        //         <Sidebar history={props.history} content={content} />
        //     </div>


        //     {showBar &&
        //         <div style={{ position: "absolute", top: '100px', left: '25%', height: '50%', width: '40%', backgroundColor: 'white' }}>
        //             <Bar style={{ textAlign: 'center' }}
        //                 data={state}
        //                 options={{
        //                     title: {
        //                         display: true,
        //                         fontSize: 20
        //                     },
        //                     legend: {
        //                         display: true,
        //                         position: 'right'
        //                     },
        //                     scales: {
        //                         y:
        //                         {
        //                             min: min,
        //                             max: max,
        //                             stepSize: 1,
        //                         },
        //                     }
        //                 }}
        //             />
        //             <Line style={{ textAlign: 'center' }}
        //                 data={state}
        //                 options={{
        //                     title: {
        //                         display: true,
        //                         fontSize: 20
        //                     },
        //                     legend: {
        //                         display: true,
        //                         position: 'right'
        //                     },
        //                     scales: {
        //                         y:
        //                         {
        //                             min: min,
        //                             max: max,
        //                             stepSize: 1,
        //                         },
        //                     }
        //                 }} />
        //         </div>

        //     }