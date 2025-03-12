import React from "react";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { CodeBracketIcon } from "@heroicons/react/24/solid";
import { useAuthContext } from "../context/AuthContext";

const ShowTotalCommits = () => {
  const { analysisData } = useAuthContext();

  if (!analysisData || !analysisData.commitsPerMonth) {
    return <p className="text-center text-gray-500">No commit data available.</p>;
  }

  // Extract commit count and format month-year
  const monthlyCommits = analysisData.commitsPerMonth.map((entry) => entry.commits);
  const categories = analysisData.commitsPerMonth.map((entry) => {
    const [year, month] = entry.month.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" }); // "Jan 2025"
  });

  console.log("Monthly Commits Data:", analysisData.commitsPerMonth);

  const chartConfig = {
    series: [{ name: "Commits", data: monthlyCommits }],
    options: {
      chart: { toolbar: { show: false } },
      title: {
        text: "GitHub Commits Trend",
        align: "center",
        style: { color: "#ffffff", fontSize: "16px", fontFamily: "inherit" },
      },
      dataLabels: { enabled: false },
      colors: ["#007BFF"], // Changed color to blue
      stroke: { curve: "smooth", width: 2 },
      markers: { size: 4, colors: ["#007BFF"] },
      xaxis: {
        categories,
        labels: { style: { colors: "#cccccc", fontSize: "12px" } },
      },
      yaxis: {
        labels: { style: { colors: "#cccccc", fontSize: "12px" } },
      },
      grid: { borderColor: "#444444", strokeDashArray: 5 },
      fill: { opacity: 0.9 },
      tooltip: { theme: "dark" },
    },
  };

  return (
    <Card className="bg-black text-white">
      <CardHeader floated={false} shadow={false} color="transparent" className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-max rounded-lg bg-gray-800 p-5 text-blue-400">
            <CodeBracketIcon className="h-6 w-6" />
          </div>
          <div>
            <Typography variant="h6" color="white">
              GitHub Commits Analysis
            </Typography>
            <Typography variant="small" color="gray" className="max-w-sm font-normal">
              Track the total number of commits made on your GitHub profile over time.
            </Typography>
          </div>
        </div>
        {/* Total Commits Display */}
        {analysisData.totalCommits !== undefined && (
          <div className="flex items-center bg-gray-800 px-3 py-2 rounded-lg">
            <Typography variant="h6" color="white">
              {analysisData.totalCommits} Commits
            </Typography>
          </div>
        )}
      </CardHeader>
      <CardBody className="px-2 pb-0">
        <Chart type="bar" height={240} {...chartConfig} />
      </CardBody>
    </Card>
  );
};

export default ShowTotalCommits;
