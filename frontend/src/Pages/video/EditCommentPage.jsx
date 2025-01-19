import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditCommentPage = () => {
  const { videoId } = useParams();  // Fetch videoId from URL params
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null); // State to store the comment being edited
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/v1/comments/${videoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setComments(response.data.data);  // Set the comments for the video
      } catch (error) {
        setError("Failed to load comments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  const handleEditChange = (e) => {
    setEditingComment({ ...editingComment, content: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `/api/v1/comments/c/${editingComment._id}`,
        { content: editingComment.content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Comment updated successfully!");
      setEditingComment(null); // Close the edit form after saving
      navigate(0); // Refresh the page to reflect the updated comment
    } catch (error) {
      alert("Failed to update comment. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);  // Close the edit form without saving
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Manage Comments</h2>
        
        {editingComment ? (
          <>
            <h3 className="text-lg font-semibold mb-2">Editing Comment</h3>
            <textarea
              value={editingComment.content}
              onChange={handleEditChange}
              className="w-full h-32 p-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <div>
            {comments.length === 0 ? (
              <div>No comments available for this video.</div>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="bg-gray-700 p-4 rounded-md mb-4">
                  <p className="text-gray-300">{comment.content}</p>
                  <div className="mt-2 flex gap-4">
                    <button
                      onClick={() => setEditingComment(comment)}  // Set the comment to be edited
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        const confirmed = window.confirm("Are you sure you want to delete this comment?");
                        if (confirmed) {
                          try {
                            await axios.delete(`/api/v1/comments/c/${comment._id}`, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                            });
                            setComments(comments.filter(c => c._id !== comment._id));  // Remove the comment from the list
                            alert("Comment deleted successfully!");
                          } catch (err) {
                            console.error("Failed to delete comment", err);
                            alert("Failed to delete comment. Please try again.");
                          }
                        }
                      }}
                      className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCommentPage;