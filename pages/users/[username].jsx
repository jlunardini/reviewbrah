import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Primary from "../../layouts/Primary";
import { useEffect, useState } from "react";
import ReviewCard from "../../components/ReviewCard";
import { useRouter } from "next/router";

export default function User() {
	const session = useSession();
	const supabase = useSupabaseClient();
	const [loading, setLoading] = useState(false);
	const [feed, setFeed] = useState(null);
	const router = useRouter();

	useEffect(() => {
		if (router.query.username == undefined) {
			return;
		}
		async function getFeed() {
			try {
				setLoading(true);
				let profile = await supabase
					.from("profiles")
					.select(`id`)
					.eq("username", router.query.username)
					.single();
				let { data, error, status } = await supabase
					.from("reviews")
					.select(`*`)
					.eq("user_id", profile.data.id)
					.order("created_at", { ascending: false });
				if (error && status !== 406) {
					throw error;
				}
				if (data) {
					setFeed(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}
		getFeed();
		return () => {};
	}, [router]);

	return (
		<Primary nav={true}>
			<div className="flex flex-col w-full mb-16 lg:mb-24">
				<h1 className="text-2xl lg:text-3xl mb-6 col-span-6">
					Recent reviews by: {""}
					{router.query.username == undefined ? "" : router.query.username}
				</h1>
				<div className="grid grid-cols-6 gap-16 lg:gap-12 w-full">
					{feed &&
						feed.map((item) => (
							<ReviewCard key={item.id} review={item} username={false} category={true} />
						))}
				</div>
			</div>
		</Primary>
	);
}
