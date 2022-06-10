import React from "react";

import { Bar, Bubble,Doughnut,Pie,Line,Scatter, } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Sidebar from "../sidebar/Sidebar";

const BarChart = (props) => {
    const backgroundColors =[]
    
    const getRandomColor = () => {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
            }
    const getBackgroundColors = () =>{
        for (var i=0;i<props.labels.length; i++){
            backgroundColors.push(getRandomColor());
        }
        return backgroundColors;
    }
    let state = {
        labels: props.labels,
        datasets: [
            {
                label: props.label,
                fill: true,
                backgroundColor: getBackgroundColors(),
                borderColor: 'rgba(0,0,0,0.9)',
                borderWidth: 2,
                data: props.data
            }
        ]
    }
    return(
    <div className="charts">
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
                                    min: props.min,
                                    max: props.max,
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
                                    min: props.min,
                                    max: props.max,
                                    stepSize: 1,
                                },
                            }
                        }} />
    </div>
        );

}
export default BarChart;