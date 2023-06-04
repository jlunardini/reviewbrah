import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DeleteRow({ review, showEdit, session, supabase, getFeed, getProfile }) {
	async function deleteReview() {
		const remove = await supabase.from("reviews").delete().eq("id", review.id);
		getFeed();
	}
	const [confirmDelete, setConfirmDelete] = useState(false);

	return (
		<div className="flex flex-row items-center justify-end w-full gap-4">
			<AnimatePresence>
				{!confirmDelete && (
					<motion.div className="flex flex-row">
						<motion.button layout="size" onClick={() => setConfirmDelete(!confirmDelete)}>
							<motion.svg
								initial={false}
								animate={{
									opacity: 1,
									width: "auto",
									transition: {
										delay: 0.5,
									},
								}}
								exit={{
									opacity: 0,
									width: 0,
								}}
								key="confirm-delete-button"
								transition={{
									type: "tween",
									ease: "easeInOut",
								}}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-5 h-5 lg:w-5 lg:w-5 stroke-red-500"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
								/>
							</motion.svg>
						</motion.button>
					</motion.div>
				)}
				{confirmDelete && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							width: "auto",
							transition: {
								delay: 0.5,
							},
						}}
						exit={{ opacity: 0, width: 0 }}
						key="yes-confirm-delete"
						transition={{
							type: "tween",
							ease: "easeInOut",
						}}
						layout="size"
						className="flex flex-row items-center gap-2"
					>
						<motion.button onClick={() => deleteReview()}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-5 h-5 lg:w-5 lg:w-5 stroke-red-400"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</motion.button>
						<motion.button onClick={() => setConfirmDelete(!confirmDelete)}>
							<motion.svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-5 h-5 lg:w-5 lg:w-5 stroke-gray-400"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</motion.svg>
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
