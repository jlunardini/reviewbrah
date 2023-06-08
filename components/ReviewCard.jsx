import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import RankingRow from "./RankingRow";
import CommentRow from "./CommentRow";
import DeleteRow from "./DeleteRow";
import BookmarkRow from "./BookmarkRow";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewCard({ review, i, username, category, showEdit, getFeed }) {
	var date = new Date(review.created_at);
	var parsed = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
	const session = useSession();
	const supabase = useSupabaseClient();
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState();
	const [confirmCommentDelete, setConfirmCommentDelete] = useState(false);

	async function deleteReview() {
		const remove = await supabase.from("reviews").delete().eq("id", review.id);
		getFeed();
	}

	async function getComments() {
		try {
			let { data, error, status } = await supabase
				.from("comments")
				.select(`*, user_id(username, id)`)
				.eq("review_id", review.id)
				.order("created_at", { ascending: false });
			if (error && status !== 406) {
				throw error;
			}
			if (data) {
				console.log(data);
				setComments(data);
			}
		} catch (error) {
			alert("Error loading comments");
		} finally {
		}
	}

	async function addComment() {
		try {
			const updates = {
				user_id: session.user.id,
				review_id: review.id,
				comment: newComment,
			};
			let { error } = await supabase.from("comments").insert(updates);
			if (error) throw error;
		} catch (error) {
			console.log(error);
		} finally {
			setNewComment("");
			getComments();
		}
	}

	async function deleteComment(commentID) {
		const remove = await supabase.from("comments").delete().eq("id", commentID);
		getComments();
		setConfirmCommentDelete(false);
	}

	useEffect(() => {
		getComments();
		return () => {};
	}, []);

	// const comments = [
	// 	{ name: "theg00chmane", comment: "testing comment, testing comment, testing comment" },
	// 	{
	// 		name: "theg00chmane",
	// 		comment:
	// 			"testing comment, testing comment, testing comment, testing comment, testing comment",
	// 	},
	// ];

	return (
		<motion.div
			initial={false}
			animate={{
				opacity: 1,
				height: "auto",
			}}
			exit={{ opacity: 0, height: 0, transitionEnd: { display: "none" } }}
			key={review.id}
			layout="size"
			className="flex flex-col col-span-6 "
		>
			<motion.div
				layout="size"
				className="flex flex-col md:flex-row gap-6 lg:gap-8 bg-white2 shadow-md rounded-lg p-8  peer relative z-10"
			>
				{review.image && (
					<img
						src={review.image}
						className="rounded-md w-full md:w-80 h-80 flex-shrink-0 object-cover"
					/>
				)}
				<div className="flex flex-col justify-center relative w-full">
					<div className="flex flex-col flex-grow h-full justify-center">
						<p className="text-sm text-gray-400 mb-6">{parsed}</p>
						<h2 className="font-semibold text-xl font-sans mb-4">{review.name}</h2>
						<p className="mb-2 text-gray-600">{review.review}</p>
						<div className="flex flex-row items-center gap-2 mt-4">
							{review.score < 0 ? (
								<>
									<div className="flex flex-row items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className={`${
												review.score <= -2 ? "fill-yellow-300" : "hover:fill-yellow-300"
											} w-6 h-6 cursor-pointer peer`}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
											/>
										</svg>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className={`${
												review.score <= -1 ? "fill-yellow-300" : ""
											} w-6 h-6 cursor-pointer peer-hover:fill-yellow-300 hover:fill-yellow-300`}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
											/>
										</svg>
									</div>
								</>
							) : (
								<div className="flex flex-row-reverse items-center">
									<svg
										className={`${
											review.score >= 2 ? "fill-yellow-300" : "hover:fill-yellow-300"
										} w-6 h-6 peer cursor-pointer`}
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
										/>
									</svg>
									<svg
										className={`${
											review.score >= 1 ? "fill-yellow-300" : "peer-hover:fill-yellow-300"
										} w-6 h-6 cursor-pointer hover:fill-yellow-300`}
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
										/>
									</svg>
								</div>
							)}
						</div>
					</div>
				</div>
			</motion.div>
			<motion.div
				layout="size"
				className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between mt-8 md:mt-6"
			>
				<div className="flex flex-row-reverse items-center gap-2 lg:gap-4">
					{category && review.category && review.category === "item" && (
						<Link
							href={"/categories/item"}
							className="flex flex-row items-center text-sm bg-transparent rounded-md font-semibold text-amber-400 hover:text-amber-500"
						>
							<span>#Food</span>
						</Link>
					)}

					{category && review.category && review.category === "food" && (
						<Link
							href={"/categories/food"}
							className="flex flex-row items-center text-sm bg-transparent  rounded-md font-semibold  text-sky-400 hover:text-sky-500"
						>
							<span>#Food</span>
						</Link>
					)}

					{category && review.category && review.category === "experience" && (
						<Link
							href={"/categories/experience"}
							className="flex flex-row items-center text-sm bg-transparent rounded-md font-semibold text-purple-400  hover:text-purple-500"
						>
							<span>#Experience</span>
						</Link>
					)}

					{category && review.category && review.category === "media" && (
						<Link
							href={"/categories/media"}
							className="flex flex-row items-center text-sm bg-transparent  rounded-md font-semibold text-green-500 hover:text-green-600"
						>
							<span>#Media</span>
						</Link>
					)}

					{username && (
						<Link
							href={`/users/${review.user_id.username}`}
							className="hover:text-gray-500 text-gray1 text-sm rounded-md font-semibold self-start"
						>
							#{review.user_id.username}
						</Link>
					)}
				</div>
				<div className="flex ml-4 gap-1">
					<CommentRow
						review={review}
						setShowComments={setShowComments}
						showComments={showComments}
					/>
					<RankingRow review={review} />
					<BookmarkRow review={review} />
				</div>
				{showEdit && (
					<DeleteRow review={review} session={session} supabase={supabase} getFeed={getFeed} />
				)}
			</motion.div>
			<AnimatePresence>
				{showComments && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						key="comments"
						transition={{
							type: "tween",
							ease: "easeInOut",
						}}
						className="flex flex-col items-center w-full"
						layout
					>
						{!showEdit && (
							<motion.div layout className="mt-12 flex flex-col w-full">
								<p className="text-sm text-gray1 mb-2 font-semibold">Add a comment</p>
								<motion.div layout="size" className="flex flex-row gap-2">
									<motion.textarea
										layout="size"
										id="new_comment"
										type="text"
										value={newComment}
										className="shadow-sm w-full rounded-md bg-white2 px-4 py-4"
										onChange={(e) => setNewComment(e.target.value)}
									/>
									<AnimatePresence>
										{newComment != "" && (
											<motion.button
												onClick={() => addComment()}
												initial={{ opacity: 0, width: 0, height: "100%" }}
												animate={{ opacity: 1, width: "auto", height: "100%" }}
												exit={{ opacity: 0, width: 0, height: "100%" }}
												key="comments"
												transition={{
													type: "tween",
													ease: "easeInOut",
												}}
												className="bg-green-200 rounded-md text-sm hover:bg-green-300 text-left"
											>
												<motion.span
													initial={{ opacity: 0, width: 0, height: "100%" }}
													animate={{ opacity: 1, width: "auto", height: "100%" }}
													exit={{ opacity: 0, width: 0, height: "100%" }}
													className="px-4"
												>
													Add
												</motion.span>
											</motion.button>
										)}
									</AnimatePresence>
								</motion.div>
							</motion.div>
						)}
						<AnimatePresence>
							{comments &&
								comments.map((comment) => (
									<motion.div
										initial={false}
										animate={{
											opacity: 1,
											height: "auto",
										}}
										exit={{ opacity: 0, height: 0, transitionEnd: { display: "none" } }}
										key={comment.id}
										layout
										className="w-full"
									>
										<motion.div className="mt-12 mb-8 flex flex-col md:flex-row w-full items-start md:items-center">
											<motion.div layout className="flex flex-col md:mr-8 gap-1 md:w-[200px]">
												<motion.p layout className="text-sm text-gray1">
													{comment.user_id.username}
												</motion.p>
												<motion.p layout className="text-sm text-gray-400">
													{parsed}
												</motion.p>
											</motion.div>
											<motion.div className="mt-4 lg:mt-0 flex items-start justify-between rounded-lg bg-white2 p-4 px-8 shadow-sm w-full relative">
												<motion.p>{comment.comment}</motion.p>
												<AnimatePresence>
													{comment.user_id.id === session.user.id && !confirmCommentDelete && (
														<motion.button
															layout
															initial={false}
															animate={{
																opacity: 1,
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
															onClick={() => setConfirmCommentDelete(!confirmCommentDelete)}
														>
															<motion.svg
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
													)}
													{confirmCommentDelete && (
														<motion.div
															animate={{
																opacity: 1,
																transition: {
																	delay: 0.5,
																},
															}}
															exit={{
																opacity: 0,
															}}
															key="yes-confirm-delete"
															transition={{
																type: "tween",
																ease: "easeInOut",
															}}
															layout
															className="flex flex-row items-center gap-2"
														>
															<motion.button onClick={() => deleteComment(comment.id)}>
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
															<motion.button
																onClick={() => setConfirmCommentDelete(!confirmCommentDelete)}
															>
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
											</motion.div>
										</motion.div>
									</motion.div>
								))}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
