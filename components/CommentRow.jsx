import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export default function Comment({ review, showComments, setShowComments }) {
	const session = useSession();
	const supabase = useSupabaseClient();

	const [loading, setLoading] = useState(false);
	const [commentTotal, setCommentTotal] = useState(null);

	useEffect(() => {
		getCommentTotal();
		return () => {};
	}, [supabase]);

	async function getCommentTotal() {
		try {
			setLoading(true);
			let commentTotal = await supabase
				.from("comments")
				.select("*", { count: "exact" })
				.eq("review_id", review.id);
			if (commentTotal) {
				setCommentTotal(commentTotal);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-row items-center justify-between ">
			<div className="flex flex-row items-center justify-end w-full gap-4">
				<button
					onClick={() => setShowComments(!showComments)}
					className={`flex flex-row items-center transition-all text-sm gap-1 px-2 py-1 hover:bg-gray-200 rounded-md relative z-0 text-gray-600 font-mono    ${
						showComments ? "bg-gray-200" : ""
					}`}
				>
					{commentTotal && <p>{commentTotal.count}</p>}

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
