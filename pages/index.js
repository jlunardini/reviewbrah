import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Main from "../components/Main";

const Home = () => {
	const session = useSession();
	const supabase = useSupabaseClient();

	return (
		<div>
			{!session ? (
				<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
			) : (
				<Main session={session} />
			)}
		</div>
	);
};

export default Home;
