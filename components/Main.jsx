import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Primary from "../layouts/Primary";

export default function Main({ session }) {
	const supabase = useSupabaseClient();
	const user = useUser();
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState(null);

	useEffect(() => {
		getProfile();
	}, [session]);

	async function getProfile() {
		try {
			setLoading(true);
			let { data, error, status } = await supabase
				.from("profiles")
				.select(`username`)
				.eq("id", user.id)
				.single();
			if (error && status !== 406) {
				throw error;
			}
			if (data) {
				setUsername(data.username);
			}
		} catch (error) {
			alert("Error loading user data!");
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	async function updateProfile({ username, website, avatar_url }) {
		try {
			setLoading(true);
			const updates = {
				id: user.id,
				username,
				avatar_url,
				updated_at: new Date().toISOString(),
			};

			let { error } = await supabase.from("profiles").upsert(updates);
			if (error) throw error;
			alert("Profile updated!");
		} catch (error) {
			alert("Error updating the data!");
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Primary>
			<div className="px-4 mx-auto lg:w-[800px] flex flex-col h-full">
				<h1 className="text-2xl lg:text-3xl mb-6">Profile details</h1>
				<div className="form-widget p-5 rounded-lg shadow-sm bg-white">
					<div className="mb-6">
						<p className="mb-1 text-lg">Email:</p>
						<p className="text-md">{session.user.email}</p>
					</div>
					<div className="flex flex-col mb-6">
						<label className="mb-1 text-lg" htmlFor="username">
							Username
						</label>
						<input
							id="username"
							type="text"
							value={username || ""}
							className="border border-gray-200 rounded-md px-4 py-2"
							onChange={(e) => setUsername(e.target.value.trim())}
						/>
						<p className="mt-4 text-sm text-gray-500">
							If you don&lsquo;t set a username, we&lsquo;ll assume you want all your reviews to be
							private and they will not appear in the feed for others. If you do set a username,
							we&lsquo;ll assume you&lsquo;re ok with sharing, and all your reviews will be visible
							to others.
						</p>
					</div>
					<div className="flex flex-row gap-2">
						<button
							className="bg-gray-100 py-2 rounded-md hover:bg-gray-200 md:self-start px-8"
							onClick={() => updateProfile({ username })}
							disabled={loading}
						>
							{loading ? "Loading ..." : "Update"}
						</button>
						<button
							className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-md  px-8 "
							onClick={() => supabase.auth.signOut()}
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</Primary>
	);
}
