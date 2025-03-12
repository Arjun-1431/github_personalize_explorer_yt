export const explorePopularRepos = async (req, res) => {
	const { language } = req.params;

	try {
		// 5000 requests per hour for authenticated requests
		const response = await fetch(
			`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`,
			{
				headers: {
					authorization: `token ${process.env.GITHUB_API_KEY}`,
				},
			}
		);
		const data = await response.json();

		//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

		res.status(200).json({ repos: data.items });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


export const recommended = async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: "GitHub username is required" });
    }

    try {
        const response = await axios.get(`https://api.github.com/users/${username}/starred`, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("GitHub API Error:", error.response?.data || error.message);
        res.status(500).json({
            error: error.response?.data?.message || "Failed to fetch repositories",
        });
    }
};

