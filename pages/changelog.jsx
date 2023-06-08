import Primary from "../layouts/Primary";
export default function Changelog({}) {
	return (
		<Primary nav={true}>
			<div className="flex flex-col w-full">
				<h1 className="text-gray1 text-2xl text-left">Changelog:</h1>
				<div className="mt-8 flex flex-col gap-6">
					<p className="text-gray1 text-xl">
						06.08.23 - 1.01 - Comments can now be deleted. Re-configured post interaction bar on
						mobile. The feed is now a little more spaced out on mobile. Added link to changelog.
						Added link to file a bug report.
					</p>
				</div>
			</div>
		</Primary>
	);
}
