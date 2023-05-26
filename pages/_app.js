import "../styles/globals.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
	const [supabase] = useState(() => createBrowserSupabaseClient());

	return (
		<>
			<Head>
				<title>Reviewbrah</title>
			</Head>
			<SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
				<Component {...pageProps} />
			</SessionContextProvider>
		</>
	);
}
export default MyApp;
