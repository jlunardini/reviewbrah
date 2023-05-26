import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Primary from "../layouts/Primary";
import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";

export default function TheFeed({}) {
	const session = useSession();
	const supabase = useSupabaseClient();
	const [loading, setLoading] = useState(false);
	const [feed, setFeed] = useState(null);

	useEffect(() => {
		getFeed();
		return () => {};
	}, [supabase]);

	async function getFeed() {
		try {
			setLoading(true);
			let { data, error, status } = await supabase
				.from("reviews")
				.select(`*, user(username)`)
				.order("created_at", { ascending: false });
			if (error && status !== 406) {
				throw error;
			}
			if (data) {
				setFeed(data);
			}
		} catch (error) {
			alert("Error loading user data!");
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Primary>
			<div className="px-4 mx-auto lg:w-[800px] flex flex-col">
				<div className="flex flex-col w-full mb-16 lg:mb-24">
					<h1 className="text-2xl lg:text-3xl mb-6 col-span-6">All recent reviews:</h1>
					<div className="grid grid-cols-6 gap-12 lg:gap-8 w-full">
						{feed && feed.map((item) => <ReviewCard key={item.id} review={item} username={true} />)}
					</div>
				</div>
			</div>
		</Primary>
	);
}
