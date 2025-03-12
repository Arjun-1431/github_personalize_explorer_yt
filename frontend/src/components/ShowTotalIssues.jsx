import * as React from "react";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { useAuthContext } from "../context/AuthContext"; // Use custom hook to access context

export default function ShowTotalIssues() {
  const { repositoriesIssues, loading } = useAuthContext(); // Get repositoriesIssues and loading state from AuthContext

  console.log("Repositories Issues Data from AuthContext:", repositoriesIssues); // Log repositoriesIssues data

  // Check if data is still loading or unavailable
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!repositoriesIssues || repositoriesIssues.length === 0) {
    console.warn("No data available for repositoriesIssues!");
    return <p>No Data Available...</p>;
  }

  // Prepare chart data
  const xLabels = repositoriesIssues.map((_, index) => index);
  const yData = repositoriesIssues.map((repo) => repo.totalIssues);
  const repoNames = repositoriesIssues.map((repo) => repo.repository);

  return (
    <Box sx={{ width: "100%", maxWidth: 1000 }}>
      <LineChart
        xAxis={[
          {
            data: xLabels,
            scaleType: "linear",
            label: "Repositories",
            valueFormatter: (value) => repoNames[value] || "Unknown", // Formatting x-axis values
          },
        ]}
        yAxis={[{ id: "linearAxis", scaleType: "linear", label: "Total Issues" }]} // Y-axis for issue count
        series={[{ data: yData, label: "Issues Count", yAxisId: "linearAxis" }]} // Series data for chart
        height={400}
      />
    </Box>
  );
}
