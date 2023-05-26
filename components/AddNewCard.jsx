import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ScoreRow from "./ScoreRow";

export default function AddNewCard({ getFeed }) {
	const session = useSession();
	const supabase = useSupabaseClient();
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState(null);
	const [review, setReview] = useState(null);
	const [score, setScore] = useState(0);
	const [file, setFile] = useState(null);
	const [category, setCategory] = useState(null);
	const [showError, setShowError] = useState({
		show: false,
		message: null,
	});

	async function uploadImage(event, session) {
		try {
			setLoading(true);
			if (!event.target.files || event.target.files.length === 0) {
				throw new Error("You must select an image to upload.");
			}
			const file = event.target.files[0];
			const fileExt = file.name.split(".").pop();
			const fileName = `${uuidv4()}.${fileExt}`;
			const filePath = `${fileName}`;
			let { data, error } = await supabase.storage
				.from("reviews")
				.upload(filePath, file, { upsert: true });
			let path = supabase.storage.from("reviews").getPublicUrl(`${fileName}`);
			setFile(path.data.publicUrl);
		} catch (error) {
			alert("Error uploading avatar!");
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	async function addReview() {
		if (name === null || name === "" || review == "" || review === null) {
			setShowError({
				show: true,
				message: null,
				fields: {
					name: name === null || name === "",
					review: review == "" || review === null,
				},
			});
			return;
		}
		try {
			setLoading(true);
			const updates = {
				user_id: session.user.id,
				name,
				review,
				score,
				image: file,
				category,
				created_at: new Date().toISOString(),
			};
			let { error } = await supabase.from("reviews").insert(updates);
			if (error) throw error;
			setName(null);
			setReview(null);
			setScore(0.0);
			setFile(null);
			getFeed();
		} catch (error) {
			alert("Error updating the data!");
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<h1 className="text-2xl lg:text-3xl mb-6">Add new</h1>
			<div className="flex flex-col lg:flex-row gap-4 lg:gap-8 bg-white shadow-sm p-5 rounded-lg">
				<div className="h-80 w-full lg:w-80 bg-gray-100 flex-shrink-0 rounded-md relative hover:bg-gray-200 group cursor-pointer border border-gray-200 shadow-sm">
					<label
						className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
						htmlFor="single"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-8 h-8 stroke-gray-800 group-hover:rotate-90 transition-all"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span className="mt-2">{loading ? "Uploading ..." : "Upload an image"}</span>
					</label>
					<input
						style={{
							position: "absolute",
							visibility: "hidden",
						}}
						type="file"
						id="single"
						accept="image/*"
						onChange={uploadImage}
						disabled={loading}
					/>
					{file && (
						<img src={file} className="object-cover rounded-lg h-full relative z-0 w-full" />
					)}
				</div>
				<div className="flex flex-col w-full justify-center">
					<input
						className={`${
							showError.show && showError.fields.name ? "border-red-500" : "border-gray-200"
						} border  rounded-md px-4 py-2 transition-colors`}
						value={name || ""}
						onChange={(e) => setName(e.target.value)}
						placeholder="What are you reviewing?"
					/>
					<textarea
						rows="3"
						className={`${
							showError.show && showError.fields.review ? "border-red-500" : "border-gray-200"
						} border  rounded-md px-4 py-2 mt-3 transition-colors`}
						value={review || ""}
						onChange={(e) => setReview(e.target.value)}
						placeholder="What'd you think of it?"
					/>
					<div className="flex flex-row gap-2 mt-4 justify-end md:justify-start">
						<button
							onClick={() => setCategory("item")}
							className="flex flex-row items-center text-sm bg-amber-300 shadow-sm  rounded-md font-semibold border border-amber-400 px-2 text-gray-600 py-1"
						>
							{category === "item" && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-4 h-4 mr-1"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							)}
							<span>Item</span>
						</button>
						<button
							onClick={() => setCategory("food")}
							className="flex flex-row items-center text-sm bg-sky-300 shadow-sm  rounded-md font-semibold px-2 border border-sky-400 text-gray-600 py-1"
						>
							{category === "food" && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-4 h-4 mr-1"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							)}
							<span>Food</span>
						</button>
						<button
							onClick={() => setCategory("experience")}
							className="flex flex-row items-center text-sm bg-purple-300 shadow-sm  rounded-md font-semibold px-2 border border-purple-400 text-gray-600 py-1"
						>
							{category === "experience" && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-4 h-4 mr-1"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							)}
							<span>Experience</span>
						</button>
						<button
							onClick={() => setCategory("media")}
							className="flex flex-row items-center text-sm bg-green-300 shadow-sm  rounded-md font-semibold px-2 border border-green-400 text-gray-600 py-1"
						>
							{category === "media" && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-4 h-4 mr-1"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							)}
							<span>Media</span>
						</button>
					</div>
					<ScoreRow score={score} setScore={setScore} />
					<button
						className="bg-gray-100 py-2 rounded-md hover:bg-gray-200 md:self-start px-8"
						onClick={() => addReview()}
					>
						Save
					</button>
				</div>
			</div>
			{showError.show && showError.message && (
				<div className="rounded-lg px-5 py-2 bg-red-500 text-white w-full mt-3">
					{showError.message}
				</div>
			)}
		</>
	);
}
