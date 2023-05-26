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
				<div className="flex flex-col w-full bg-gray-100 min-h-[calc(100dvh)]">
					<div className="bg-white shadow-sm h-auto">
						<div className="max-w-full lg:max-w-[800px] px-4 lg:mx-auto flex flex-row justify-between  gap-4 lg:gap-8 py-4 ">
							<p className="font-semibold text-lg">Reviewbreh - Review anything.</p>
						</div>
					</div>
					<div className="py-12 lg:py-16 flex-grow">
						<div className="px-4 mx-auto lg:w-[800px] flex flex-col">
							<div className="p-5 rounded-lg shadow-sm bg-white">
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
							</div>
						</div>
					</div>
				</div>
			) : (
				<Main session={session} />
			)}
		</div>
	);
};

export default Home;
