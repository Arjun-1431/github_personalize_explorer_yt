import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

import ProfileInfo from "../components/ProfileInfo";
import Repos from "../components/Repos";
import Search from "../components/Search";
import SortRepos from "../components/SortRepos";
import Spinner from "../components/Spinner";

const DEFAULT_USERNAME = "Arjun-1431";

const HomePage = () => {
	const { authUser } = useAuthContext();
	const [userProfile, setUserProfile] = useState(null);
	const [repos, setRepos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [sortType, setSortType] = useState("recent");

	const getUserProfileAndRepos = useCallback(async (username) => {
		if (!username) return;

		setLoading(true);
		try {
			const res = await fetch(`/api/users/profile/${username}`);
			const { repos, userProfile } = await res.json();

			repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by most recent

			setRepos(repos);
			setUserProfile(userProfile);
		} catch (error) {
			toast.error("Failed to fetch profile: " + error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	// Fetch profile & repos when the component mounts or when the user logs in
	useEffect(() => {
		const username = authUser?.username || DEFAULT_USERNAME;
		getUserProfileAndRepos(username);
	}, [authUser, getUserProfileAndRepos]);

	const onSearch = async (e, username) => {
		e.preventDefault();
		if (!username) return;

		setLoading(true);
		setRepos([]);
		setUserProfile(null);

		await getUserProfileAndRepos(username);
		setSortType("recent");
		setLoading(false);
	};

	const onSort = (sortType) => {
		let sortedRepos = [...repos];

		if (sortType === "recent") {
			sortedRepos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
		} else if (sortType === "stars") {
			sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
		} else if (sortType === "forks") {
			sortedRepos.sort((a, b) => b.forks_count - a.forks_count);
		}

		setSortType(sortType);
		setRepos(sortedRepos);
	};

	return (
		<div className='m-4'>
			<Search onSearch={onSearch} />
			{repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType} />}
			<div className='flex gap-4 flex-col lg:flex-row justify-center items-start'>
				{userProfile && !loading && <ProfileInfo userProfile={userProfile} />}
				{!loading && <Repos repos={repos} />}
				{loading && <Spinner />}
			</div>
		</div>
	);
};

export default HomePage;
