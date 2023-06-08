import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Primary from "../layouts/Primary";
import { useRouter } from "next/router";
import Card from "../components/Card";
import Link from "next/link";

export default function Main({ session }) {
	const supabase = useSupabaseClient();
	const user = useUser();
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState(null);
	const [success, showSuccess] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push("/");
		} else {
			getProfile();
		}
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
			showSuccess("Profile updated");
		} catch (error) {
			alert("Error updating the data!");
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	function renderButtonText() {
		if (loading) {
			return (
				<div
					class="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
					role="status"
				>
					<span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
						Loading...
					</span>
				</div>
			);
		} else if (loading == false && showSuccess == true) {
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			);
		} else if (loading === false && showSuccess === false) {
			return `Update`;
		}
	}

	if (!user) {
		return (
			<Primary>
				<div className="px-4 mx-auto lg:w-[800px] flex flex-col h-full">
					<div>loading!...</div>
				</div>
			</Primary>
		);
	} else
		return (
			<Primary nav={true}>
				<div className="mb-12 text-left">
					<p className="text-2xl text-gray1 mb-6">{session.user.email}</p>
					<div className="flex flex-row gap-4 w-full justify-start">
						<p className="text-sm text-gray1 mb-2">Member Since: 2023</p>
						<p className="text-sm text-gray1">Total Reviews: 10</p>
					</div>
				</div>
				<Card>
					<div className="flex flex-col mb-6">
						<label className="mb-2 text-md text-gray1" htmlFor="username">
							Username
						</label>
						<input
							id="username"
							type="text"
							value={username || ""}
							className="border border-gray-200 rounded-md px-4 py-2"
							onChange={(e) => setUsername(e.target.value.trim())}
						/>
						<p className="mt-4 text-sm text-gray-500 leading-[26px]">
							If you don&lsquo;t set a username, we&lsquo;ll assume you want all your reviews to be
							private and they will not appear in the feed for others. If you do set a username,
							we&lsquo;ll assume you&lsquo;re ok with sharing, and all your reviews will be visible
							to others.
						</p>
					</div>
					<div className="flex flex-row gap-6 mt-12 lg:mt-8 flex-wrap md:flex-nowrap">
						<button
							className="bg-white1 py-2 rounded-md hover:bg-gray-200 md:self-start px-8 w-full "
							onClick={() => updateProfile({ username })}
							disabled={loading}
						>
							Update
						</button>
						<button
							className="bg-red-400 hover:bg-red-500 text-white py-2 rounded-md  px-8 w-full"
							onClick={() => supabase.auth.signOut()}
						>
							Sign Out
						</button>
					</div>
				</Card>
				<div className="mt-8 w-full lg:mt-12 text-center flex flex-col">
					<Link className="mt-8 w-full lg:mt-16 text-center hover:underline" href="/changelog">
						See what&apos;s new
					</Link>
					<Link
						className="flex flex-row items-center justify-center gap-1 mt-4 w-full text-center hover:underline"
						target="_blank"
						href="https://reviewbrah.canny.io/feature-requests"
					>
						<span>Submit a feature request</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-4 h-4"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
							/>
						</svg>
					</Link>
					<Link
						className="flex flex-row items-center justify-center gap-1 mt-4 w-full text-center hover:underline"
						href="mailto:jlunardini@hey.com"
					>
						<span>
							Submit a bug report.<br></br>
							<small>Please be gentle, the programmer scares easily.</small>
						</span>
					</Link>
				</div>
			</Primary>
		);
}
