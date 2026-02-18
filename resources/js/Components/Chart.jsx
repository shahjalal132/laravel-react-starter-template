import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function Chart({ option, style = { height: '400px', width: '100%' }, className = '' }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
            chartInstance.current.setOption(option);

            const handleResize = () => {
                chartInstance.current?.resize();
            };

            window.addEventListener('resize', handleResize);

            return () => {
                chartInstance.current?.dispose();
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.setOption(option, true);
        }
    }, [option]);

    return <div ref={chartRef} style={style} className={className} />;
}
