import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

export default function RankingRow({ review }) {
	const session = useSession();
	const supabase = useSupabaseClient();

	const [loading, setLoading] = useState(false);
	const [ranking, setRanking] = useState(null);

	useEffect(() => {
		getRanking();
		return () => {};
	}, [supabase]);

	async function getRanking() {
		try {
			setLoading(true);
			let ranking = await supabase
				.from("rankings")
				.select("*", { count: "exact" })
				.eq("review_id", review.id);
			if (ranking) {
				setRanking(ranking);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	async function addRanking() {
		try {
			const updates = {
				user_id: session.user.id,
				review_id: review.id,
				created_at: new Date().toISOString(),
			};
			let add = await supabase.from("rankings").upsert(updates);
		} catch (error) {
			console.log(error);
		} finally {
			getRanking();
		}
	}

	async function deleteRanking() {
		try {
			let remove = await supabase
				.from("rankings")
				.delete()
				.eq("review_id", review.id)
				.eq("user_id", session.user.id);
			console.log(remove);
		} catch (error) {
			console.log(error);
		} finally {
			getRanking();
		}
	}

	function returnHeart() {
		if (!ranking || !session || !session.user) return;
		else if (review.user_id.id === session.user.id) {
			return (
				<div className="flex flex-row items-center text-sm gap-1 px-2 py-1 rounded-md relative z-0  text-gray-600 font-mono">
					{ranking.count && <span>{ranking.count}</span>}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5 stroke-red-500 fill-red-500"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
						/>
					</svg>
				</div>
			);
		} else if (ranking.count === 0) {
			return (
				<button
					onClick={() => addRanking()}
					className="flex flex-row items-center gap-1 px-2 py-1 text-sm hover:bg-gray-200 rounded-md relative z-0 text-gray-600 font-mono"
				>
					{ranking.count && <span>{ranking.count}</span>}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5 stroke-red-500"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
						/>
					</svg>
				</button>
			);
		} else if (
			ranking.count > 0 &&
			ranking.data.filter((x) => x.user_id === session.user.id).length === 0
		) {
			return (
				<button
					onClick={() => addRanking()}
					className="flex flex-row items-center text-sm gap-1 px-2 py-1 hover:bg-gray-200 rounded-md relative z-0 text-gray-600 font-mono"
				>
					{ranking.count && <span>{ranking.count}</span>}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5 stroke-red-500"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
						/>
					</svg>
				</button>
			);
		} else if (
			ranking.count > 0 &&
			ranking.data.filter((x) => x.user_id === session.user.id).length === 1
		) {
			return (
				<button
					onClick={() => deleteRanking()}
					className="flex flex-row items-center text-sm gap-1 px-2 py-1 hover:bg-gray-200 rounded-md relative z-0 text-gray-600 font-mono"
				>
					{ranking.count && <span className="">{ranking.count}</span>}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5 stroke-red-500 fill-red-500"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
						/>
					</svg>
				</button>
			);
		}
	}

	return (
		<div className="flex flex-row items-center justify-between ">
			<div className="flex flex-row items-center justify-end w-full gap-4">{returnHeart()}</div>
		</div>
	);
}
