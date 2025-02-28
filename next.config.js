/** @type {import('next').NextConfig} */
const BASE_PREFIX_FOR_APP = '/DigitalUnity'
const API_URL = 'https://localhost:8080' //process.env.API_URL
//const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  basePath: BASE_PREFIX_FOR_APP,
  //   assetPrefix: `${BASE_PREFIX_FOR_APP}/`,
  async redirects() {
    return [
      // {
      //   source: '/api/:path*',
      //   destination: `${API_URL}/api/:path*`,
      //   permanent: false,
      // },
      {
        source: '/',
        destination: '/DigitalUnity',
        basePath: false,
        permanent: true,
      },
    ]
  },
  //async rewrites() {
  //  console.log('Inside rewrites')
  //  return [
  //    {
  //      source: '/api/:path*',
  //      destination: `${API_URL}/api/:path*`,
  //    },
  //  ]
  //},
  // async rewrites() {
  //   return [
  //     {
  //       /** IMAGE PREFIX */
  //       destination: `${BASE_PREFIX_FOR_APP}/assests/img/:query*`,
  //       source: '/assets/img/:query*',
  //     },
  //     /** API PREFIX */
  //     {
  //       source: `${BASE_PREFIX_FOR_APP}/api/:path*`,
  //       destination: '/api/:path*',
  //     },
  //   ]
  // },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.devtool = 'source-map'
    }
    return config
  },
}

module.exports = nextConfig
