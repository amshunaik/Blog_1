import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") {
      alert("Fill complete details to create a post");
      return;
    }

    try {
      await axios.post("https://blogpost1-nxy5.onrender.com/posts", { title, content });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="w-[600px] mt-12">
      <h1 className="text-2xl font-bold text-center">CREATE NEW POST</h1>

      <form onSubmit={handleSubmit} className="mt-12">
        <div className="pt-8">
          <label className="block p-1 bg-gray-200">Title</label>
          <input
            type="text"
            placeholder="Enter title ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="block p-1 border-2 w-full mb-2 text-orange-600 text-lg"
          />
        </div>

        <div>
          <label className="block p-1 bg-gray-200">Content</label>
          <textarea
            placeholder="Enter Content ......"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="block p-1 border-2 w-full mb-2 text-lg text-gray-800"
            rows="6"
          />
        </div>

        <div className="flex gap-8 mt-8 float-right">
          <button type="button" onClick={() => navigate("/")} className="px-2 py-1 bg-gray-300 rounded-lg">
            Cancel
          </button>
          <button type="submit" className="bg-black px-2 py-1 text-white rounded-lg">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
