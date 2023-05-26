import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ScoreRow from "./ScoreRow";

export default function AddNewCard({}) {
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState(null);
	const [review, setReview] = useState(null);
	const [score, setScore] = useState(0);
	const [file, setFile] = useState(null);

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
		try {
			setLoading(true);
			const updates = {
				user: session.user.id,
				name,
				review,
				score,
				image: file,
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
					{file && <img fill style={{ objectFit: "cover" }} src={file} />}
				</div>
				<div className="flex flex-col w-full justify-center">
					<input
						className="border border-gray-200 rounded-md px-4 py-2"
						value={name || ""}
						onChange={(e) => setName(e.target.value)}
						placeholder="What are you reviewing?"
					/>
					<textarea
						rows="3"
						className="border border-gray-200 rounded-md px-4 py-2 mt-3"
						value={review || ""}
						onChange={(e) => setReview(e.target.value)}
						placeholder="What'd you think of it?"
					/>
					<ScoreRow score={score} setScore={setScore} />
					<button
						className="bg-gray-100 py-2 rounded-md hover:bg-gray-200 md:self-start px-8"
						onClick={() => addReview()}
					>
						Save
					</button>
				</div>
			</div>
		</>
	);
}
