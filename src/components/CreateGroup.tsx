import { useState } from "react";
import type { ChangeEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import type { Discussion } from "./DiscussionList.tsx";
import { fetchDiscussions } from "./DiscussionList.tsx";

interface PostInput {
  title: string;
  date: string;
  location: string;
  content: string;
  image_url: string | null;
  avatar_url: string | null;
  discussion_id?: number | null;
  user_id?: string | null;
}

const createGroup = async (post: PostInput, imageFile: File | null) => {
  let imageUrl = null;

  if (imageFile) {
    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, imageFile);

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicURLData } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    imageUrl = publicURLData.publicUrl;
  }

  const { data, error } = await supabase
    .from("groups")
    .insert({ ...post, image_url: imageUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreateGroup = () => {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [discussionId, setDiscussionId] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useAuth();

  const { data: discussions } = useQuery<Discussion[], Error>({
    queryKey: ["discussions"],
    queryFn: fetchDiscussions,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File | null }) => {
      return createGroup(data.post, data.imageFile);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutate({
      post: {
        title,
        date,
        location,
        content,
        image_url: null,
        avatar_url: user?.user_metadata.avatar_url || null,
        discussion_id: discussionId,
        user_id: user?.id,
      },
      imageFile: selectedFile,
    });
  };

  const handleDiscussionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDiscussionId(value ? Number(value) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border-2 border-gray-500 focus:border-blue-500 bg-transparent p-2 rounded outline-none text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="date" className="block mb-2 font-medium">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border-2 border-gray-500 focus:border-blue-500 bg-transparent p-2 rounded outline-none text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="location" className="block mb-2 font-medium">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border-2 border-gray-500 focus:border-blue-500 bg-transparent p-2 rounded outline-none text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border-2 border-gray-500 focus:border-blue-500 bg-transparent p-2 rounded outline-none text-white"
          rows={5}
          required
        />
      </div>

      <div>
        <label>Select Discussion</label>
        <select id="discussion" onChange={handleDiscussionChange}>
          <option value={""}> -- Choose a Discussion -- </option>
          {discussions?.map((discussion, key) => (
            <option key={key} value={discussion.id}>
              {discussion.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-200"
        />
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create Group"}
      </button>

      {isError && (
        <p className="text-red-500"> Error creating group: {error?.message}</p>
      )}
    </form>
  );
};