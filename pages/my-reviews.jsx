import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Primary from "../layouts/Primary";
import Avatar from "../components/Avatar";
import ReviewCard from "../components/ReviewCard";
import AddNewCard from "../components/AddNewCard";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function MyReview({}) {
	const session = useSession();
	const supabase = useSupabaseClient();
	const [loading, setLoading] = useState(true);
	const [feed, setFeed] = useState(null);

	useEffect(() => {
		if (session && session.user) {
			getFeed();
		}
		return () => {};
	}, [supabase]);

	async function getFeed() {
		try {
			setLoading(true);
			let { data, error, status } = await supabase
				.from("reviews")
				.select(`name, review, user(username), score, image, created_at`)
				.eq("user", session.user.id)
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
				<AddNewCard />
				<div className="mt-20 lg:mt-24 flex flex-col w-full mb-16 lg:mb-24">
					<h1 className="text-2xl lg:text-3xl mb-6 col-span-6">Your recent reviews:</h1>
					<div className="grid grid-cols-6 gap-4 md:gap-6 w-full">
						{feed &&
							feed.map((item) => <ReviewCard key={item.id} review={item} username={false} />)}
					</div>
				</div>
			</div>
		</Primary>
	);
}
