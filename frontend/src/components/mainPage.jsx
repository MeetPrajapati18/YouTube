import React from "react";

const Main = () => {
  return (
    <main className="py-8 bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto">
        {/* Trending Section */}
        <h2 className="text-xl mb-4 font-bold text-gray-200">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Video Card 1 */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Video Thumbnail"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Video Title 1</h3>
              <p className="text-sm text-gray-400">Channel Name</p>
            </div>
          </div>

          {/* Video Card 2 */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Video Thumbnail"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Video Title 2</h3>
              <p className="text-sm text-gray-400">Channel Name</p>
            </div>
          </div>

          {/* Video Card 3 */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Video Thumbnail"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Video Title 3</h3>
              <p className="text-sm text-gray-400">Channel Name</p>
            </div>
          </div>

          {/* Video Card 4 */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Video Thumbnail"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Video Title 4</h3>
              <p className="text-sm text-gray-400">Channel Name</p>
            </div>
          </div>

          {/* Video Card 5 */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Video Thumbnail"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Video Title 5</h3>
              <p className="text-sm text-gray-400">Channel Name</p>
            </div>
          </div>

          {/* Video Card 6 */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/300x200"
              alt="Video Thumbnail"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">Video Title 6</h3>
              <p className="text-sm text-gray-400">Channel Name</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
