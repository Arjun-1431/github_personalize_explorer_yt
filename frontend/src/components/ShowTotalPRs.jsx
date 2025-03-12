import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

export default function ShowTotalPRs({ repositoriesPRs = [] }) {
  // Check if repositoriesPRs is empty or undefined
  if (!repositoriesPRs || repositoriesPRs.length === 0) {
    return <p style={{ color: 'black' }}>No pull request data available.</p>;
  }

  // Find the repository with the highest PR count (best performing repository)
  const bestRepo = repositoriesPRs.reduce(
    (max, repo) => (repo.totalPullRequests > max.totalPullRequests ? repo : max),
    repositoriesPRs[0]
  );

  // Prepare data for the line chart
  const repoNames = repositoriesPRs.map((repo) => repo.repository);
  const pullRequestCounts = repositoriesPRs.map((repo) => repo.totalPullRequests);

  // Ensure the data for the chart is in a correct format
  const chartData = [
    {
      label: 'Pull Requests',
      data: pullRequestCounts,
      yAxisId: 'linearAxis',
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, color: 'white' }}>
      <p style={{ color: 'black' }}>
        Total PRs: {repositoriesPRs.reduce((total, repo) => total + repo.totalPullRequests, 0)}
      </p>
      <p style={{ color: 'black' }}>
        Best Performing Repository: {bestRepo.repository} with {bestRepo.totalPullRequests} PRs
      </p>
      <LineChart
        xAxis={[{ data: repoNames }]}  // Repository names on the X axis
        yAxis={[{ id: 'linearAxis', scaleType: 'linear' }]}
        series={chartData} // Use the chartData array
        leftAxis="linearAxis"
        height={400}
        sx={{
          '.MuiXAxis-tick': { color: 'white' },
          '.MuiYAxis-tick': { color: 'white' },
          '.MuiChart-tooltip': { color: 'white' },
        }}
      />
    </Box>
  );
}
