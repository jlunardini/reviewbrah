import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Primary from "../layouts/Primary";
import Avatar from "../components/Avatar";
import ReviewCard from "../components/ReviewCard";
import AddNewCard from "../components/AddNewCard";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";

export default function MyReview({}) {
	const session = useSession();
	const supabase = useSupabaseClient();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [feed, setFeed] = useState(null);

	useEffect(() => {
		if (!session || !session.user) {
			router.push("/");
		}
		if (session && session.user) {
			getFeed();
		}
		return () => {};
	}, [session]);

	async function getFeed() {
		try {
			setLoading(true);
			let { data, error, status } = await supabase
				.from("reviews")
				.select(`id, name, review, user_id(username), score, image, category, created_at`)
				.eq("user_id", session.user.id)
				.order("created_at", { ascending: false });
			if (error && status !== 406) {
				throw error;
			}
			if (data) {
				setFeed(data);
				console.log(data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Primary nav={true}>
			<AddNewCard getFeed={getFeed} />
			<div className="mt-20 lg:mt-24 flex flex-col w-full mb-16 lg:mb-24">
				<h1 className="text-2xl lg:text-3xl mb-6 col-span-6">Your recent reviews:</h1>
				<div className="grid grid-cols-6 gap-16 lg:gap-12 w-full">
					{feed &&
						feed.map((item) => (
							<ReviewCard
								key={item.id}
								review={item}
								username={false}
								category={true}
								showEdit={true}
								getFeed={getFeed}
							/>
						))}
				</div>
			</div>
		</Primary>
	);
}
