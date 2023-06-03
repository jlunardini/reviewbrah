import "../styles/globals.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

function MyApp({ Component, pageProps }) {
	const [supabase] = useState(() => createBrowserSupabaseClient());

	return (
		<>
			<Head>
				<title>Reviewbrah</title>
			</Head>
			<SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
				<main className={`${inter.variable} font-sans`}>
					<Component {...pageProps} />
				</main>
			</SessionContextProvider>
		</>
	);
}
export default MyApp;
