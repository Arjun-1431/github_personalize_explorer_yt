import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { StarIcon } from "@heroicons/react/24/solid";

const ShowTotalStars = () => {
  const { analysisData } = useAuthContext();
  const [monthlyStars, setMonthlyStars] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (analysisData && analysisData.starsPerMonth) {
      const allMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      // Initialize an empty array for all months
      let starsData = new Array(12).fill(0);
      let monthsData = new Array(12).fill("");

      // Filter data for the selected year
      const filteredData = analysisData.starsPerMonth.filter(item =>
        new Date(item.month).getFullYear() === selectedYear
      );

      // Populate starsData and monthsData
      filteredData.forEach(item => {
        const monthIndex = new Date(item.month).getMonth(); // 0 for Jan, 1 for Feb, etc.
        starsData[monthIndex] = item.stars;
        monthsData[monthIndex] = allMonths[monthIndex];
      });

      setMonthlyStars(starsData);
      setMonths(monthsData);
    }
  }, [analysisData, selectedYear]);

  const chartConfig = {
    series: [{ name: "Stars", data: monthlyStars }],
    options: {
      chart: { type: "line", height: 300, toolbar: { show: false } },
      title: {
        text: `GitHub Stars Trend (${selectedYear})`,
        align: "center",
        style: { color: "#ffffff", fontSize: "16px" },
      },
      colors: ["#FFD700"],
      stroke: { curve: "smooth", width: 2 },
      markers: { size: 5, colors: ["#FFD700"], strokeColors: "#ffffff" },
      xaxis: {
        categories: months.length ? months : ["No Data Available"],
        labels: { style: { colors: "#cccccc", fontSize: "12px" } },
      },
      yaxis: {
        labels: { style: { colors: "#cccccc", fontSize: "12px" } },
        title: { text: "Stars Count", style: { color: "#ffffff" } },
      },
      grid: { borderColor: "#444444", strokeDashArray: 5 },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val) => `Stars: ${val}`,
        },
        x: {
          formatter: (val) => `Month: ${val}`,
        },
      },
    },
  };

  return (
    <Card className="bg-black text-white shadow-lg rounded-lg">
      <CardHeader
  floated={false}
  shadow={false}
  color="transparent"
  className="flex flex-col md:flex-row md:items-center p-6 gap-4 justify-between"
>
  <div className="flex items-center gap-4">
    <div className="w-max rounded-lg bg-gray-800 p-4 text-yellow-400 flex-shrink-0">
      <StarIcon className="h-7 w-7" />
    </div>
    <div>
      <Typography variant="h6" color="white" className="font-bold flex items-center gap-2">
        GitHub Stars Analysis
        {analysisData?.totalStars !== undefined && (
          <span className="bg-gray-800 px-3 py-1 rounded-lg text-yellow-400 text-sm">
            {analysisData.totalStars} Stars
          </span>
        )}
      </Typography>
      <Typography variant="small" color="gray" className="font-normal mt-2">
        Select a year to view GitHub stars trend.
      </Typography>
    </div>
  </div>
</CardHeader>


      <div className="flex justify-center w-[30%] mt-1 ml-10">
  <Select
    value={selectedYear}
    onChange={(e) => setSelectedYear(Number(e))}
    className="bg-gray-800 text-white p-2 rounded-lg w-full"
  >
    {[2018,2019,2020,2021,2022,2023, 2024, 2025].map((year) => (
      <Option key={year} value={year}>
        {year}
      </Option>
    ))}
  </Select>
</div>


      <CardBody className="px-6 pb-6">
        <Chart
          options={chartConfig.options}
          series={chartConfig.series}
          type="line"
          height={300}
        />
      </CardBody>
    </Card>
  );
};

export default ShowTotalStars;
