import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateVideo = () => {
  const { videoId } = useParams(); // Extracting videoId from route params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/videos/${videoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const { title, description } = response.data;
        setFormData({
          title: title || "", // Default to an empty string if undefined
          description: description || "", // Default to an empty string if undefined
          thumbnail: null,
        });
      } catch (err) {
        setError("Failed to fetch video details.");
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, thumbnail: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    try {
      await axios.patch(`/api/v1/videos/${videoId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(`/videos/${videoId}`);
    } catch (err) {
      setError("Failed to update video.");
    }
  };

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-center mb-6">Update Video</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter video title"
            className="w-full p-3 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block font-semibold mb-1">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter video description"
            rows="5"
            className="w-full p-3 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        {/* Thumbnail Input */}
        <div>
          <label htmlFor="thumbnail" className="block font-semibold mb-1">
            Thumbnail:
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {preview && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Preview:</p>
            <img
              src={preview}
              alt="Thumbnail Preview"
              className="w-full max-w-sm rounded-md"
            />
          </div>
        )}
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          Update Video
        </button>
      </form>
    </div>
  );
};

export default UpdateVideo;
