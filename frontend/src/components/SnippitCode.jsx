import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";




export default function SnippitCode() {
  const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
  const location = useLocation();
  const repo = location.state?.repo; // Receiving repo data

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!repo) return;

    const fetchRepoContents = async (url) => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (response.status === 403) {
          setError("API rate limit exceeded or access denied. Try again later.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Unexpected response from GitHub API.");

        const filePromises = data
          .filter((file) => file.type === "file") // Ignore folders
          .map(async (file) => {
            const content = await fetchFileContent(file.url);
            return { ...file, content, score: analyzeFileContent(content) };
          });

        const fetchedFiles = await Promise.all(filePromises);

        // Sort files based on logic score
        const sortedFiles = fetchedFiles.sort((a, b) => b.score - a.score);

        setFiles(sortedFiles.slice(0, 5)); // Show top 5 main logic files
        setLoading(false);
      } catch (error) {
        console.error("Error fetching repository contents:", error);
        setError("Error loading repository data.");
        setLoading(false);
      }
    };

    const fetchFileContent = async (fileUrl) => {
      try {
        const response = await fetch(fileUrl, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (response.status === 403) {
          return "API rate limit exceeded or access denied.";
        }

        const data = await response.json();
        return data.content ? atob(data.content) : "Unable to fetch file content.";
      } catch (error) {
        console.error("Error fetching file content:", error);
        return "Error loading file content.";
      }
    };

    const analyzeFileContent = (code) => {
      let score = 0;

      // Count import statements
      const importMatches = code.match(/import\s+\w+|from\s+\w+|require\(['"`]\w+/g);
      score += importMatches ? importMatches.length * 2 : 0;

      // Count function definitions
      const functionMatches = code.match(/function\s+\w+|def\s+\w+|const\s+\w+\s*=\s*\(?\s*\)?\s*=>/g);
      score += functionMatches ? functionMatches.length * 3 : 0;

      // Count class definitions
      const classMatches = code.match(/class\s+\w+/g);
      score += classMatches ? classMatches.length * 5 : 0;

      // Detect execution entry points
      if (code.includes("if __name__ == '__main__'") || code.includes("app.listen(") || code.includes("main()")) {
        score += 10;
      }

      return score;
    };

    fetchRepoContents(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/`);
  }, [repo]);

  if (!repo) {
    return (
      <div className="p-5">
        <h1 className="text-2xl font-bold text-gray-200">No Repository Selected</h1>
        <p className="text-gray-400 mt-2">Please select a repository from the list.</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-gray-200">{repo.name} - Main Logic Files</h1>
      <p className="text-gray-400 mt-2">{repo.description || "No description available."}</p>

      {error ? (
        <p className="text-red-400 mt-4">{error}</p>
      ) : loading ? (
        <p className="text-gray-400 mt-4">Loading main logic files...</p>
      ) : (
        files.map((file, index) => (
          <div key={index} className="mt-6 p-4 bg-gray-800 rounded-lg text-gray-300">
            <h2 className="text-lg font-semibold text-white">{file.name}</h2>
            <pre className="whitespace-pre-wrap break-words text-sm">{file.content}</pre>
          </div>
        ))
      )}
    </div>
  );
}
