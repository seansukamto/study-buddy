import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";

const fetchGroups = async () => {
  const { data, error } = await supabase.from("groups").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const FindGroupPage = () => {
  const { data: groups, isLoading, isError } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Available Groups
      </h2>
      <ul className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
        {isLoading && <li className="text-black">Loading...</li>}
        {isError && <li className="text-red-500">Failed to load groups.</li>}
        {groups &&
          groups.map((group: any) => (
            <li key={group.id} className="py-2 border-b text-black">
              {group.title}
            </li>
          ))}
      </ul>
    </div>
  );
};