import React, { useMemo } from 'react';
import { Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import './EnergyMonitor.css';

const EnergyMonitor = ({ totalConsumption, hourlyData }) => {
  const chartData = useMemo(() => {
    if (hourlyData) return hourlyData;
    
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      value: Math.floor(Math.random() * (totalConsumption * 1.2))
    }));
  }, [hourlyData, totalConsumption]);

  return (
    <div className={`energy-monitor-container ${totalConsumption ? '' : 'dark'}`}>
      <div className="energy-monitor-header">
        <div className={`energy-monitor-icon ${totalConsumption ? '' : 'dark'}`}>
          <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className={`energy-monitor-title ${totalConsumption ? '' : 'dark'}`}>
            Current Consumption
          </h3>
          <p className={`energy-monitor-value ${totalConsumption ? '' : 'dark'}`}>
            {totalConsumption}W
          </p>
        </div>
      </div>
      
      <div className="energy-monitor-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="hour"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={value => `${value}W`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgb(31 41 55)',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
              wrapperClassName="custom-tooltip"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnergyMonitor;