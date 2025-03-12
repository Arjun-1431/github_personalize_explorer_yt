import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { formatDate } from "../utils/functions";
import { useAuthContext } from "../context/AuthContext"; // Import the context

const LikesPage = () => {
  const { authUser } = useAuthContext(); // Get the authenticated user details from context
  const [likes, setLikes] = useState([]);

  // Log authenticated user details for debugging
  useEffect(() => {
    if (authUser) {
      console.log("Authenticated User Details: ", authUser);
      setLikes(authUser.likedBy || []); // Use the `likedBy` array from authUser directly
    } else {
      console.error("authUser is null or undefined.");
      toast.error("User not found!");
    }
  }, [authUser]); // Update `likes` when `authUser` changes

  // Log likes state for debugging
  useEffect(() => {
    console.log("Likes State: ", likes);
  }, [likes]);

  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg px-4">
      <h2 className="text-2xl font-bold text-center my-4">Your Likes</h2>
      <table className="w-full text-sm text-left rtl:text-right bg-glass overflow-hidden">
        <thead className="text-xs uppercase ">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">No</div>
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {likes.length > 0 ? (
            likes.map((user, idx) => (
              <tr className="bg-glass border-b" key={user._id || idx}>
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <span>{idx + 1}</span>
                  </div>
                </td>
                <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.avatarUrl || "https://via.placeholder.com/150"}
                    alt="User Avatar"
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">{user.username || "Unknown User"}</div>
                  </div>
                </th>
                <td className="px-6 py-4">
                  {user.likedDate ? formatDate(user.likedDate) : "Unknown Date"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FaHeart size={22} className="text-red-500 mx-2" />
                    Liked your profile
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No likes to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LikesPage;
