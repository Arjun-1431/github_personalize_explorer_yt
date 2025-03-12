import React, { useState, useEffect } from "react";
import { IoLocationOutline } from "react-icons/io5";
import {
  RiGitRepositoryFill,
  RiUserFollowFill,
  RiUserFollowLine,
} from "react-icons/ri";
import { FaXTwitter, FaEye } from "react-icons/fa6";
import { TfiThought } from "react-icons/tfi";
import { formatMemberSince } from "../utils/functions";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LikeProfile from "./LikeProfile"; // Import the LikeProfile component

const ProfileInfo = ({ userProfile }) => {
  const { setUserProfile, setAnalysisData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false); // Track the like status of the profile
  const navigate = useNavigate();

  const memberSince = formatMemberSince(userProfile?.created_at);

  // Fetch GitHub analysis data (optional step)
  const fetchGitHubAnalysis = async () => {
    if (!userProfile?.login) {
      console.error("GitHub username not available.");
      return;
    }
  
    try {
      setLoading(true);
  
      const GITHUB_TOKEN = "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"; // Your GitHub Token
      const headers = {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      };
  
      // Fetch repositories
      const reposResponse = await fetch(
        `https://api.github.com/users/${userProfile.login}/repos`,
        { headers }
      );
      if (reposResponse.status === 403) throw new Error("Rate limit exceeded or invalid token.");
      
      const reposData = await reposResponse.json();
      if (!Array.isArray(reposData)) throw new Error("Unexpected data format for repositories.");
  
      // Initialize tracking objects
      let totalStars = 0, totalCommits = 0, totalPRs = 0, totalIssues = 0;
      const monthlyStars = {}, commitDetails = {}, pullRequestDetails = {}, issueDetails = {};
      const repositoriesIssues = [];
      const contributions = { commits: 0, prs: 0, issues: 0 }; // Store the contributions data
  
      // Fetch events for contributions analysis (commits, PRs)
      const eventsResponse = await fetch(
        `https://api.github.com/users/${userProfile.login}/events?per_page=100`,
        { headers }
      );
      if (eventsResponse.status === 403) throw new Error("Rate limit exceeded or invalid token.");
  
      const eventsData = await eventsResponse.json();
      if (!Array.isArray(eventsData)) throw new Error("Unexpected data format for events.");
  
      // Process repositories data
      for (const repo of reposData) {
        totalStars += repo.stargazers_count;
        const createdAt = new Date(repo.created_at);
        const monthYear = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, "0")}`;
        monthlyStars[monthYear] = (monthlyStars[monthYear] || 0) + repo.stargazers_count;
  
        // Fetch issues for this repository
        const issuesResponse = await fetch(
          `https://api.github.com/repos/${userProfile.login}/${repo.name}/issues?state=all`,
          { headers }
        );
        const issuesData = await issuesResponse.json();
        let repoIssuesCount = 0;
  
        issuesData.forEach((issue) => {
          if (!issue.pull_request) {
            totalIssues++;
            repoIssuesCount++;
            const issueDate = new Date(issue.created_at);
            const issueMonthYear = `${issueDate.getFullYear()}-${(issueDate.getMonth() + 1).toString().padStart(2, "0")}`;
            issueDetails[issueMonthYear] = (issueDetails[issueMonthYear] || 0) + 1;
          }
        });
  
        if (repoIssuesCount > 0) {
          repositoriesIssues.push({ repository: repo.name, totalIssues: repoIssuesCount });
        }
      }
  
      // Process GitHub events (commits, PRs)
      eventsData.forEach((event) => {
        if (event.type === "PushEvent") {
          totalCommits += event.payload.commits.length;
          event.payload.commits.forEach((commit) => {
            const commitDate = new Date(event.created_at);
            const commitMonthYear = `${commitDate.getFullYear()}-${(commitDate.getMonth() + 1).toString().padStart(2, "0")}`;
            commitDetails[commitMonthYear] = (commitDetails[commitMonthYear] || 0) + 1;
          });
          contributions.commits += event.payload.commits.length; // Add to commits count
        } else if (event.type === "PullRequestEvent") {
          totalPRs++;
          const prRepoName = event.repo.name;
          pullRequestDetails[prRepoName] = (pullRequestDetails[prRepoName] || 0) + 1;
          contributions.prs++; // Add to PR count
        }
      });
  
      // Convert data to array format
      const starsPerMonth = Object.keys(monthlyStars).map((month) => ({ month, stars: monthlyStars[month] }));
      const commitsPerMonth = Object.keys(commitDetails).map((month) => ({ month, commits: commitDetails[month] }));
      const issuesPerMonth = Object.keys(issueDetails).map((month) => ({ month, issues: issueDetails[month] }));
      const repositoriesPRs = Object.keys(pullRequestDetails).map((repoName) => ({ repository: repoName, totalPullRequests: pullRequestDetails[repoName] }));
      const totalPullRequests = Object.values(pullRequestDetails).reduce((sum, count) => sum + count, 0);
  
      // Save analysis data in AuthContext
      setAnalysisData({
        starsPerMonth,
        commitsPerMonth,
        issuesPerMonth,
        totalCommits,
        totalPRs,
        totalStars,
        totalIssues,
        contributions: contributions.commits + contributions.prs + contributions.issues, // Total contributions
        repositoriesPRs,
        repositoriesIssues,
        totalPullRequests,
      });
  
      // Log contributions to console
      console.log("Contributions Data: hai ", contributions);
  
      setLoading(false);
      navigate("/analysis");
    } catch (error) {
      console.error("Error fetching analysis:", error.message);
      setLoading(false);
    }
  };
  

  
  // Handle when like status changes
  const handleLike = (likedStatus) => {
    setLiked(likedStatus);
    // Optionally save like status to the backend or local state
  };

  useEffect(() => {
    if (userProfile) {
      setUserProfile(userProfile);
    }
  }, [userProfile]);

  return (
    <div className="lg:w-1/3 w-full flex flex-col gap-2 lg:sticky md:top-10">
      {/* Profile Info */}
      <div className="bg-glass rounded-lg p-4">
        <div className="flex gap-3 items-center">
          <a href={userProfile?.html_url} target="_blank" rel="noreferrer">
            <img
              src={userProfile?.avatar_url}
              className="rounded-md w-24 h-24 mb-2"
              alt="User Avatar"
            />
          </a>
          <div>
            <h1 className="text-lg font-bold">
              {userProfile?.name || "No Name"}
            </h1>
            <p className="text-sm text-gray-500">@{userProfile?.login}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          {userProfile?.bio || "No bio available"}
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          {userProfile?.location && (
            <span className="flex items-center gap-1 text-xs">
              <IoLocationOutline size={14} /> {userProfile.location}
            </span>
          )}
          {userProfile?.twitter_username && (
            <a
              href={`https://twitter.com/${userProfile.twitter_username}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
            >
              <FaXTwitter size={14} /> @{userProfile.twitter_username}
            </a>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-xs">
            <RiGitRepositoryFill size={16} /> Repositories:{" "}
            {userProfile?.public_repos || 0}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <RiUserFollowLine size={16} /> Followers:{" "}
            {userProfile?.followers || 0}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <RiUserFollowFill size={16} /> Following:{" "}
            {userProfile?.following || 0}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <TfiThought size={16} /> Member Since: {memberSince || "N/A"}
          </div>
        </div>
      </div>

      {/* View GitHub Account Button */}
      <button
        onClick={() => window.open(userProfile?.html_url, "_blank")}
        className="bg-blue-500 text-white font-medium text-xs p-2 rounded-md mt-2 flex items-center gap-2"
      >
        <FaEye size={16} /> View Account
      </button>

      {/* LikeProfile Button */}
      <LikeProfile userProfile={userProfile} onLike={handleLike} />

      {/* View GitHub Analysis Button */}
      <button
        onClick={fetchGitHubAnalysis}
        className={`bg-glass font-medium text-xs p-2 rounded-md cursor-pointer border ${
          loading ? "border-gray-400 text-gray-400" : "border-blue-400"
        } flex items-center gap-2`}
        disabled={loading}
      >
        <FaEye size={16} /> {loading ? "Loading..." : "View Analysis"}
      </button>
    </div>
  );
};

export default ProfileInfo;
