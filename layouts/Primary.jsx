export default function Primary({ children }) {
	return (
		<div className="flex flex-col h-full w-full bg-slate-200">
			<div className="flex flex-row justify-center gap-4 lg:gap-8 py-4 lg:py-8 bg-white shadow-sm">
				<a href="/my-reviews" className="px-4 py-2 hover:bg-gray-100 rounded-md">
					My Reviews
				</a>
				<a href="/the-feed" className="px-4 py-2 hover:bg-gray-100 rounded-md">
					The Feed
				</a>
				<a href="/" className="px-4 py-2 hover:bg-gray-100 rounded-md">
					Profile
				</a>
			</div>
			<div className="my-12 lg:my-16">{children}</div>
		</div>
	);
}
