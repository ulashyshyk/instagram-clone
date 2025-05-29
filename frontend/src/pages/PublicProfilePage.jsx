import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { LiaTableSolid } from "react-icons/lia";
import { useParams } from "react-router-dom";
import PublicProfile from "../components/PublicProfile";
import axios from "axios";
import camera2 from "../assets/camera2.png";
import PublicPostCard from "../components/PublicPostCard";
import { useAuth } from "../context/AuthContext";
const PublicProfilePage = () => {
  const { updateUser } = useAuth();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.get(
          `http://localhost:5001/api/profile/users/${username}`,
          config
        );
        setUser(response.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleFollowToggle = async () => {
    if (!user || followLoading) return;
    try {
      setFollowLoading(true);
      const token = localStorage.getItem("accessToken");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      await axios.put(
        `http://localhost:5001/api/profile/follow/${user._id}`,
        {},
        config
      );

      setUser((prev) => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing
          ? prev.followersCount - 1
          : prev.followersCount + 1,
      }));

      const meResponse = await axios.get(
        `http://localhost:5001/api/profile/me`,
        config
      );
      updateUser(meResponse.data);
    } catch (err) {
      console.error("Follow/Unfollow failed:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-[90vh] flex items-center">
        <Spinner />
      </div>
    );
  if (!user)
    return (
      <div className="flex h-[100vh] flex-row items-center justify-center">
        <p className="font-medium font-2xl">User not found.</p>
      </div>
    );
  return (
    <div>
      <div className="flex flex-row  overflow-x-hidden">
        <Sidebar />
        <div className="flex flex-col  w-full ml-[65px] p-4 md:ml-[249px] justify-between items-center">
          <PublicProfile
            user={user}
            onFollowToggle={handleFollowToggle}
            followLoading={followLoading}
          />
          <div className="border-t border-gray-200 w-[80%] h-auto mb-auto mt-10 flex justify-center p-2 gap-1 items-center">
            <LiaTableSolid />
            <p className="text-[12px] font-medium">POSTS</p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {user.posts.map((post) => (
              <PublicPostCard key={post._id} post={post} />
            ))}
          </div>

          {user.posts.length === 0 && (
            <div className=" mb-auto flex flex-col items-center gap-2 mt-3">
              <img
                className="w-[100px] h-[100px] rounded-full flex items-center justify-center md:mr-2 object-cover cursor-pointer"
                src={camera2}
              />
              <p className="font-bold text-[30px]">No Posts Yet</p>
            </div>
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
