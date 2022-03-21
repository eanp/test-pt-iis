import React from 'react';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

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

export default function BarData({props}) {
    return <Bar options={options} data={props} />;
}
