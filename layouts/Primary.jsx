export default function Primary({ children }) {
	return (
		<div className="flex flex-col w-full bg-gray-100 lg:min-h-[calc(100dvh)]">
			<div className="flex flex-row justify-center gap-4 lg:gap-8 py-4 lg:py-8 bg-white shadow-sm h-auto">
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
			<div className="py-12 lg:py-16">{children}</div>
		</div>
	);
}
