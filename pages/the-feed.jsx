import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Primary from "../layouts/Primary";
import { useEffect, useState } from "react";
import ReviewCard from "../components/ReviewCard";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

export default function TheFeed({}) {
	const session = useSession();
	const supabase = useSupabaseClient();
	const router = useRouter();
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
				.select("*, user_id!inner ( username )")
				.not("user_id.username", "is", "null")
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

	return (
		<Primary nav={true}>
			<div className="flex flex-col w-full mb-16 lg:mb-24">
				<div className="mb-8 text-left">
					<p className="text-2xl text-gray1">All Recent Reviews:</p>
				</div>
				<motion.div className="grid grid-cols-6 gap-6 lg:gap-24 w-full">
					{feed &&
						feed.map((item, i) => (
							<ReviewCard
								key={item.id}
								i={i}
								review={item}
								username={true}
								category={true}
								showEdit={false}
							/>
						))}
				</motion.div>
			</div>
		</Primary>
	);
}
