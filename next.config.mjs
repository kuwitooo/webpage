const nextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS === 'true' ? '/webpage' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
