/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static export — emits plain HTML/CSS/JS to `out/` with no Node/SSR
  // server required at runtime. Deployable to any static host.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
