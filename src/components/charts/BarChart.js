import React from "react";


import { Bar, Bubble,Doughnut,Pie,Line,Scatter, } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Sidebar from "../sidebar/Sidebar";

const BarChart = () => {
    let state ={
        labels: ['30','2','10','12','41','12','68','96','11','5'],
        datasets:[{
            label:'Rainfall',
            backgroundColor: ['rgba(75,192,192,1)','rgba(192,75,192,1)','rgba(192,192,75,1)'],
            borderColor: 'rgba(0,0,0,1)',
            borderWidth:2,
            data:[30,2,10,12,41,12,68,96,11,5]
        }]
    }

    return(<div className="charts">
    <Bar style={{textAlign:'center'}}
        data={state}
        options= {{
            title:{
                display: true,
                text:'Average Rainfall per month',
                fontSize:20
            },
            legend:{
                display:true,
                position:'right'
            },
        }}
        />
        </div>
    );

}
export default BarChart;