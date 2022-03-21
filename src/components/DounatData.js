import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
    responsive: true,
        plugins: {
        legend: {
            display: false
        },
        title: {
            display: false,
            text: 'Chart.js Bar Chart',
        },
        },
    };
    

export default function DounatData({props}) {
    return <Doughnut options={options} data={props} />;
}
