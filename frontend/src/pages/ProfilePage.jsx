import React, { useEffect, useState } from "react";
import Profile from "../components/Profile";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { LiaTableSolid } from "react-icons/lia";
import SharePhotos from "../components/SharePhotos";
import PostCard from "../components/PostCard.jsx";
import { usePost } from "../context/PostContext";
import Spinner from "../components/Spinner.jsx";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const [showSpinner, setShowSpinner] = useState(true);
  const {
    posts,
    fetchMyPosts,
    loadingPosts,
    removePost,
    selectedPostId,
    setSelectedPostId,
  } = usePost();
  const [isPostViewOpen, setIsPostViewOpen] = useState(false);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSpinner(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (selectedPostId) {
      const foundPost = posts.find((post) => post._id === selectedPostId);
      if (foundPost) {
        setActivePost(foundPost);
        setIsPostViewOpen(true);
      }
    }
  }, [selectedPostId, posts]);

  return (
    <div className="flex flex-row overflow-x-hidden">
      <Sidebar />

      {showSpinner ? (
        <div className="h-[90vh] w-[100%] flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col w-full p-4 md:ml-[249px] justify-between items-center"
        >
          <Profile />
          <div className="border-t border-gray-200 w-[80%] h-auto mb-auto mt-10 flex justify-center p-2 gap-1 items-center">
            <LiaTableSolid />
            <p className="text-[12px] font-medium">POSTS</p>
          </div>

          {loadingPosts ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-3 gap-1"
            >
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onPostDeleted={removePost}
                  autoOpen={selectedPostId === post._id}
                  setSelectedPostId={setSelectedPostId}
                />
              ))}
            </motion.div>
          )}

          {posts.length === 0 && <SharePhotos />}

          <Footer />
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;
