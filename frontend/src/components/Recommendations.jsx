import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import SortRepos from "../components/SortRepos";
import Repos from "../components/Repos";

const Recommended = () => {
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [topLanguage, setTopLanguage] = useState("");
  const [bestRepos, setBestRepos] = useState([]);
  const [sortType, setSortType] = useState("stars");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchUserRepos = useCallback(async (username) => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/profile/${username}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const { repos } = await res.json();
      const languageCount = {};
      repos.forEach((repo) => {
        if (repo.language) {
          languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        }
      });

      const mostUsedLanguage = Object.keys(languageCount).reduce(
        (a, b) => (languageCount[a] > languageCount[b] ? a : b),
        ""
      );

      setTopLanguage(mostUsedLanguage);
      if (mostUsedLanguage) {
        fetchBestRepos(mostUsedLanguage, 1);
      }
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast.error("Failed to fetch repositories: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBestRepos = async (language, page) => {
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=5&page=${page}`
      );
      if (!res.ok) throw new Error(`Failed to fetch best repositories. Status: ${res.status}`);

      const { items } = await res.json();
      if (items.length === 0) setHasMore(false);

      setBestRepos((prev) => [...prev, ...items]);
    } catch (error) {
      console.error("Error fetching best repositories:", error);
      toast.error("Failed to fetch best repositories: " + error.message);
    }
  };

  const onSort = (sortType) => {
    let sortedRepos = [...bestRepos];
    if (sortType === "stars") {
      sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortType === "forks") {
      sortedRepos.sort((a, b) => b.forks_count - a.forks_count);
    } else if (sortType === "recent") {
      sortedRepos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    setSortType(sortType);
    setBestRepos(sortedRepos);
  };

  useEffect(() => {
    if (authUser?.username) {
      fetchUserRepos(authUser.username);
    }
  }, [authUser, fetchUserRepos]);

  useEffect(() => {
    if (page > 1 && topLanguage) {
      fetchBestRepos(topLanguage, page);
    }
  }, [page]);

  return (
    <div className="m-4 bg-transparent">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {topLanguage && (
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto">
              <h2 className="text-2xl font-bold">Most Used Language</h2>
              <p className="text-3xl font-extrabold mt-2 text-yellow-400">{topLanguage}</p>
            </div>
          )}

          {bestRepos.length > 0 && (
            <div className="mt-6 bg-transparent p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-white">
                Top {topLanguage} Repositories on GitHub
              </h3>

              <SortRepos onSort={onSort} sortType={sortType} />

              {/* Display Repositories using the Repos Component */}
              <Repos repos={bestRepos} alwaysFullWidth={true} />

              {hasMore && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Recommended;
