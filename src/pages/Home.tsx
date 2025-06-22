import { useNavigate } from "react-router-dom";
import { PostList } from "../components/PostList";

export const Home = () => {
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    navigate("/create-group");
  };

  const handleFindGroup = () => {
    navigate("/find-group");
  };

  const handleRecordStudyTime = () => {
    navigate("/record-study-time");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold text-white mb-12 shadow-lg">
        Welcome to Study Buddy
      </h1>
      <div className="flex flex-col items-center space-y-8 mb-16">
        <button
          onClick={handleRecordStudyTime}
          className="px-12 py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg text-2xl transition-transform transform hover:scale-105"
        >
          Record Study Time
        </button>
        <div className="flex space-x-8">
          <button
            onClick={handleCreateGroup}
            className="px-12 py-6 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-lg text-2xl transition-transform transform hover:scale-105"
          >
            Create Group
          </button>
          <button
            onClick={handleFindGroup}
            className="px-12 py-6 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow-lg text-2xl transition-transform transform hover:scale-105"
          >
            Find Group
          </button>
        </div>
      </div>
      {/* Recent Posts Section */}
      <div className="w-full max-w-4xl px-4">
        <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Recent Posts
        </h2>
        <PostList />
      </div>
    </div>
  );
};