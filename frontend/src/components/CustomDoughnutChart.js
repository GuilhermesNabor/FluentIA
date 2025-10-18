import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

const CustomDoughnutChart = ({ data, summaryText }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new ChartJS(ctx, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    cutout: '75%',
                },
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [data]);

    return (
        <div className="chart-container">
            <canvas ref={chartRef}></canvas>
            <p className="chart-summary">{summaryText}</p>
        </div>
    );
};

export default React.memo(CustomDoughnutChart);