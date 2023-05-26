/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
};

module.exports = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "ixbsnoddnaqcqerlawyk.supabase.co",
				port: "",
				pathname: "/storage/v1/object/*",
			},
		],
	},
};
