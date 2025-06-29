import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { Post } from "./PostList";
import { supabase } from "../supabaseClient";
import { LikeButton } from "./LikeButton.tsx";
import { CommentSection } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { DeleteButton } from "./DeleteButton";

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

interface PostDetailProps {
  postId: number;
}

export const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data?.title}
      </h2>
      {data?.image_url && (
        <img
          src={data.image_url}
          alt={data?.title}
          className="mt-4 rounded object-cover w-full h-64"
        />
      )}
      <p className="text-gray-400">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>

      {user?.id === data?.user_id && (
        <DeleteButton postId={postId} onDeleted={() => navigate("/find-group")} />
      )}
      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
    </div>
  );
};