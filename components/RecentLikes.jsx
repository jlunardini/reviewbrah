import Card from "./Card";
import { useState, useEffect } from "react";
export default function RecentLikes({ user, supabase }) {
  const [recentLikes, setRecentLikes] = useState(null)
  useEffect(() => {
    getRecentLikes();
    return () => { };
  }, []);

  async function getRecentLikes() {
    const { data, error } = await supabase
      .from("rankings")
      .select("*, review_id!inner(user_id, name), user_id(username, id)")
      .filter("review_id.user_id", "neq", "73ea45c2-fd57-4dff-bd42-bd1e327bd435")
      .order("created_at", { ascending: false });
    setRecentLikes(data)
    console.log(data)
  }

  return (
    <Card>
      <h2 className="text-gray1 text-2xl">Recent Likes:</h2>
      <div className="flex flex-col mt-2">
        {recentLikes && recentLikes.map((like) => (
          <div key={like.id} className="w-full gap-2 grid grid-cols-6">
            <p className="col-span-2">{like.user_id.username}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 stroke-red-500 col-span-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <p className="col-span-2">{like.review_id.name}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
