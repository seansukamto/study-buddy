import { useParams } from "react-router";
import { DiscussionDisplay } from "../components/DiscussionDisplay.tsx";

export const DiscussionPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="pt-20">
      <DiscussionDisplay discussionId={Number(id)} />
    </div>
  );
};