import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Sample PR data for the last year
const prData = [12, 18, 25, 30, 40, 35, 50, 45, 38, 28, 20, 15]; // PRs per month
const mergedData = [10, 15, 22, 28, 36, 30, 45, 40, 34, 25, 18, 12]; // Merged PRs

export default function ShowPRAnalysis({ totalPRs }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-black">Pull Requests Analysis (Past Year)</h3>
      <p className="text-black">Total PRs: {totalPRs}</p>
      <ChartContainer
        width={1000}
        height={400}
        series={[
          { data: prData, label: 'Opened PRs', type: 'line' },
          { data: mergedData, label: 'Merged PRs', type: 'line' },
        ]}
        xAxis={[{ scaleType: 'point', data: months }]}
      >
        <LinePlot />
        <MarkPlot />
        <ChartsXAxis />
        <ChartsYAxis />
        <ChartsTooltip />
      </ChartContainer>
    </div>
  );
}
