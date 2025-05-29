import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import profile_pic from "../assets/profile_pic.jpg";
import { useState } from "react";
import Upload from "./Upload";
import { AiOutlineCheck } from "react-icons/ai";

const EditProfileForm = () => {
  const { user, updateUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchBio = async () => {
      const authToken = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://localhost:5001/api/profile/bio", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Bio:", data.bio);
          setBio(data.bio);
        } else {
          throw new Error("Fetching bio failed");
        }
      } catch (error) {
        console.error("Fetching bio error: ", error);
      }
    };
    const fetchName = async () => {
      const authToken = localStorage.getItem("accessToken");
      try {
        const response = await fetch("http://localhost:5001/api/profile/name", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Bio:", data.name);
          setName(data.name);
        } else {
          throw new Error("Fetching name failed");
        }
      } catch (error) {
        console.error("Fetching name error: ", error);
      }
    };

    fetchBio();
    fetchName();
  }, []);

  const handleBioUpdate = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch("http://localhost:5001/api/profile/bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ bio }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Updated Bio:", data.user.bio);
        localStorage.setItem("user", JSON.stringify(data.user));

        updateUser(data.user);
        setBio(data.user.bio);
      } else {
        console.error("Error updating bio:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch("http://localhost:5001/api/profile/name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Updated name:", data.user.name);
        localStorage.setItem("user", JSON.stringify(data.user));

        updateUser(data.user);
        setName(data.user.name);
      } else {
        console.error("Error updating name:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  return (
    <div className="flex flex-col  w-[400px] md:w-[700px] p-10">
      <p className="text-[20px] md:p-0 px-1 font-medium ">Edit Profile</p>
      <div className="bg-[#EFEFEF]  w-[330px] md:w-[430px] lg:w-[530px]  h-[100px] flex mt-10 items-center p-5 rounded-xl">
        <img
          className="w-[60px] h-[60px] rounded-full object-cover"
          src={user.profilePic || profile_pic}
        />
        <div className="ml-3">
          <p className="text-[16px]">{user.username}</p>
          <p className="text-[14px] text-[#737373]">{user.name}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-[14px] p-2 hover:bg-blue-600 rounded-xl font-medium text-white ml-auto bg-[#0095F6]"
        >
          Change Photo
        </button>
        {isModalOpen && (
          <Upload setIsModalOpen={setIsModalOpen} updateUser={updateUser} />
        )}
      </div>
      <p className="text-[20px] md:p-0 px-1 font-medium mt-10">Bio</p>

      <form onSubmit={handleBioUpdate} className="mt-5 relative">
        <textarea
          className={`w-[315px] h-[90px] md:w-[430px] lg:w-[530px] lg:h-[70px] border-2 rounded-xl p-2 text-[14px] resize-none overflow-y-hidden ${
            bio && bio.length > 149
              ? "border-red-400 outline-none"
              : "border-gray-200"
          }`}
          type="text"
          name="bio"
          maxLength={150}
          onChange={(e) => setBio(e.target.value)}
          value={bio}
        />
        <p className="absolute right-1 mr-5 md:left-1/2 md:ml-[68px] lg:ml-[170px] bottom-2 text-gray-500 text-[12px] font-medium  p-1">
          {bio.length || 0}/150
        </p>
        <button className="absolute bottom-1/2 ml-2 text-[20px] text-blue-500 hover:text-blue-600">
          <AiOutlineCheck />
        </button>
      </form>

      <p className="text-[20px] px-1 md:p-0 font-medium mt-10">Name</p>
      <form onSubmit={handleNameUpdate} className="mt-5 relative">
        <input
          className="w-[315px] md:w-[430px] lg:w-[530px] h-[70px] border-2 rounded-xl p-2 text-[14px] resize-none overflow-y-hidden border-gray-200"
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <button className="absolute bottom-1/2 ml-2 text-[20px] text-blue-500 hover:text-blue-600">
          <AiOutlineCheck />
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
