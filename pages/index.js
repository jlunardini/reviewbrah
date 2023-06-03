import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Main from "../components/Main";
import Primary from "../layouts/Primary";
import Card from "../components/Card";

const Home = () => {
	const session = useSession();
	const supabase = useSupabaseClient();

	return (
		<div>
			{!session ? (
				<div className="flex flex-col w-full bg-gray-100 min-h-[calc(100dvh)]">
					<div className="bg-white shadow-sm h-auto">
						<div className="max-w-full lg:max-w-[800px] px-4 lg:mx-auto flex flex-row justify-between  gap-4 lg:gap-8 py-4 ">
							<p className="font-semibold text-lg">Reviewbreh - Review anything.</p>
						</div>
					</div>
					<Primary nav={false}>
						<Card>
							<Auth
								supabaseClient={supabase}
								appearance={{
									theme: ThemeSupa,
									variables: {
										default: {
											colors: {
												brand: "#f3f4f6",
												brandAccent: "#f3f4f6",
												brandButtonText: "black",
											},
										},
									},
								}}
								theme="light"
								providers={[]}
							/>
						</Card>
					</Primary>
				</div>
			) : (
				<Main session={session} />
			)}
		</div>
	);
};

export default Home;
