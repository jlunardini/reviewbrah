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
		if (router.query.category == undefined) {
			return;
		}
		async function getFeed() {
			try {
				setLoading(true);
				let { data, error, status } = await supabase
					.from("reviews")
					.select("*, user_id!inner ( username )")
					.not("user_id.username", "is", "null")
					.eq("category", router.query.category)
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

	function parseCat(cat) {
		if (cat === "media") {
			return "Media";
		} else if (cat === "item") {
			return "Item";
		} else if (cat === "experience") {
			return "Experience";
		} else if (cat === "media") {
			return "Media";
		}
	}

	return (
		<Primary nav={true}>
			<div className="flex flex-col w-full mb-16 lg:mb-24">
				<h1 className="text-2xl lg:text-3xl mb-6 col-span-6">
					Recent {""}
					{router.query.category == undefined ? "" : router.query.category} {""} reviews
				</h1>
				<div className="grid grid-cols-6 gap-8 lg:gap-12 w-full">
					{feed &&
						feed.map((item) => (
							<ReviewCard key={item.id} review={item} username={false} category={true} />
						))}
				</div>
			</div>
		</Primary>
	);
}
