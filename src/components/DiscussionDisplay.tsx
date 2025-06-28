import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabaseClient";
import { PostItem } from "./PostItem";

interface Props {
  discussionId: number;
}

interface PostWithDiscussion extends Post {
  discussions: {
    name: string;
  };
}

export const fetchDiscussionPost = async (
  discussionId: number
): Promise<PostWithDiscussion[]> => {
  const { data, error } = await supabase
    .from("groups")
    .select("*, discussions(name)")
    .eq("discussion_id", discussionId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithDiscussion[];
};

export const DiscussionDisplay = ({ discussionId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithDiscussion[], Error>({
    queryKey: ["discussionPost", discussionId],
    queryFn: () => fetchDiscussionPost(discussionId),
  });

  if (isLoading)
    return <div className="text-center py-4">Loading discussion posts...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );
  return (
    <div>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data && data[0].discussions.name} Discussion Posts
      </h2>

      {data && data.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this discussion yet.
        </p>
      )}
    </div>
  );
};