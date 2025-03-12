import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";

const LikeProfile = ({ userProfile, onLike }) => {
  const { authUser } = useAuthContext();

  // Ensure userProfile is defined and has login property before accessing
  const isOwnProfile = userProfile?.login && authUser?.username === userProfile.login;
  const [isLiked, setIsLiked] = useState(false); // Track like status

  const handleLikeProfile = async () => {
    if (!userProfile?.login) {
      toast.error("User profile is invalid");
      return;
    }

    try {
      const res = await fetch(`/api/users/like/${userProfile.login}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      toast.success(data.message);

      setIsLiked((prev) => !prev); // Toggle like status
      onLike(!isLiked); // Notify parent component of the like status
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Return null if authUser or userProfile is invalid, or if it's the own profile
  if (!authUser || !userProfile || isOwnProfile) return null;

  return (
    <button
      className={`p-2 text-xs w-full font-medium rounded-md bg-glass border ${
        isLiked ? "border-red-400 text-red-400" : "border-blue-400 text-blue-400"
      } flex items-center gap-2`}
      onClick={handleLikeProfile}
    >
      <FaHeart size={16} /> {isLiked ? "Liked" : "Like Profile"}
    </button>
  );
};

export default LikeProfile;
