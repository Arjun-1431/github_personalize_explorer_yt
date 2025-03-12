import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Example from "./ShowTotalStars";
import ShowTotalCommits from "./ShowTotalCommits";
import ShowTotalPRs from "./ShowTotalPRs";
import ShowTotalIssues from "./ShowTotalIssues";
import ShowTotalContributions from "./ShowTotalContributions";

const Analysis = () => {
  const { analysisData } = useAuthContext(); // Get the analysis data from context
  const [loading, setLoading] = useState(true);
  const [visibleComponent, setVisibleComponent] = useState(""); // Track which component to show

  useEffect(() => {
    if (analysisData) {
      setLoading(false);
    }
  }, [analysisData]);

  if (loading) return <div>Loading analysis data...</div>;

  const handleShowComponent = (componentName) => {
    console.log(`Button clicked: ${componentName}`); // Debugging the button click
    setVisibleComponent(componentName); // Update the visible component
  };

  return (
    <div className="bg-gray-200 text-white p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center text-black">GitHub Profile Analysis</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 text-sm">
        <button
          className="text-black py-2 px-4 rounded-lg bg-white hover:bg-gray-200 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => handleShowComponent("stars")}
        >
          Analysing Profile Stars
        </button>
        <button
          className="text-black py-2 px-4 rounded-lg bg-white hover:bg-gray-200 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => handleShowComponent("commits")}
        >
          Analysing Profile Commits
        </button>
        {/* <button
          className="text-black py-2 px-4 rounded-lg bg-white hover:bg-gray-200 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => handleShowComponent("prs")}
        >
          Analysing Profile PRs
        </button> */}
        <button
          className="text-black py-2 px-4 rounded-lg bg-white hover:bg-gray-200 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => handleShowComponent("issues")}
        >
          Analysing Profile Issues
        </button>
        <button
          className="text-black py-2 px-4 rounded-lg bg-white hover:bg-gray-200 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => handleShowComponent("contributions")}
        >
          Pull Requests Analysis
        </button>
      </div>

      {/* Conditionally render the selected component */}
      <div className="mt-6">
        {visibleComponent === "stars" && <Example />}
        {visibleComponent === "commits" && (
          <ShowTotalCommits totalCommits={analysisData.totalCommits} />
        )}
        {visibleComponent === "prs" && (
          <ShowTotalPRs totalPRs={analysisData.totalPRs} />
        )}
        {visibleComponent === "issues" && (
          <ShowTotalIssues totalIssues={analysisData.totalIssues} />
        )}
        {visibleComponent === "contributions" && (
          <ShowTotalContributions contributions={analysisData.contributions} />
        )}
      </div>
    </div>
  );
};

export default Analysis;
