export const handleLoginWithGithub = () => {
	window.open("/api/auth/github/callback", "_self");
};
