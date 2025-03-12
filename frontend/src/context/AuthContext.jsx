import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Create context
export const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); // Stores authenticated user data
  const [userProfile, setUserProfile] = useState(null); // Stores GitHub profile data
  const [analysisData, setAnalysisData] = useState(null); // Stores GitHub analysis data
  const [repositoriesIssues, setRepositoriesIssues] = useState([]); // Stores repositories issues data
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch user authentication status
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/check", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to authenticate user.");
        const data = await res.json();
        setAuthUser(data.user);
      } catch (error) {
        toast.error(error.message || "Authentication failed.");
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  // Fetch GitHub contributions when authUser is available
  useEffect(() => {
    if (!authUser?.githubUsername) return;

    const fetchGitHubAnalysis = async () => {
      setLoading(true);
      try {
        const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
        if (!GITHUB_TOKEN)
          throw new Error("GitHub token is missing in environment variables.");

        const headers = {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        };

        const [reposRes, eventsRes] = await Promise.all([
          fetch(
            `https://api.github.com/users/${authUser.githubUsername}/repos?per_page=100`,
            { headers }
          ),
          fetch(
            `https://api.github.com/users/${authUser.githubUsername}/events?per_page=100`,
            { headers }
          ),
        ]);

        if (!reposRes.ok || !eventsRes.ok) {
          throw new Error("GitHub API rate limit exceeded. Try again later.");
        }

        const [reposData, eventsData] = await Promise.all([
          reposRes.json(),
          eventsRes.json(),
        ]);
        if (!Array.isArray(reposData) || !Array.isArray(eventsData)) {
          throw new Error("Invalid GitHub API response.");
        }

        let totalStars = 0,
          totalCommits = 0,
          totalPRs = 0,
          totalIssues = 0;

        const monthlyStats = {
          stars: {},
          commits: {},
          prs: {},
          issues: {},
        };

        reposData.forEach((repo) => {
          totalStars += repo.stargazers_count;
          const monthYear = repo.updated_at.slice(0, 7);
          monthlyStats.stars[monthYear] =
            (monthlyStats.stars[monthYear] || 0) + repo.stargazers_count;
        });

        eventsData.forEach((event) => {
          const monthYear = event.created_at.slice(0, 7);
          switch (event.type) {
            case "PushEvent":
              totalCommits += event.payload.commits.length;
              monthlyStats.commits[monthYear] =
                (monthlyStats.commits[monthYear] || 0) +
                event.payload.commits.length;
              break;
            case "PullRequestEvent":
              totalPRs++;
              monthlyStats.prs[monthYear] =
                (monthlyStats.prs[monthYear] || 0) + 1;
              break;
            case "IssuesEvent":
              totalIssues++;
              monthlyStats.issues[monthYear] =
                (monthlyStats.issues[monthYear] || 0) + 1;
              break;
            default:
              break;
          }
        });

        const formattedData = {
          starsPerMonth: Object.entries(monthlyStats.stars).map(
            ([month, stars]) => ({ month, stars })
          ),
          commitsPerMonth: Object.entries(monthlyStats.commits).map(
            ([month, commits]) => ({ month, commits })
          ),
          prsPerMonth: Object.entries(monthlyStats.prs).map(([month, prs]) => ({
            month,
            prs,
          })),
          issuesPerMonth: Object.entries(monthlyStats.issues).map(
            ([month, issues]) => ({ month, issues })
          ),
          totalCommits,
          totalPRs,
          totalStars,
          totalIssues,
        };

        setAnalysisData(formattedData);
      } catch (error) {
        toast.error(error.message || "Failed to fetch GitHub data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubAnalysis();
  }, [authUser]);

  // Log `analysisData` whenever it changes
  useEffect(() => {
    if (analysisData) {
      console.log("GitHub Contributions Monthly:", analysisData);
    }
  }, [analysisData]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        loading,
        userProfile,
        setUserProfile,
        analysisData, // Make sure it's passed here
        setAnalysisData,
        repositoriesIssues,
        setRepositoriesIssues,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
