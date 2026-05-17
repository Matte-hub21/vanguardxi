const nextConfig = {
  output: 'standalone',
  
  // Image optimization
  images: {
    // Enable next/image optimization for external sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    // Use modern image formats
    formats: ['image/avif', 'image/webp'],
    // Aggressive optimization
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Compression
  compress: true,
  
  // Optimized build
  optimizeFonts: true,
  optimizePackageImports: [
    '@chakra-ui/react',
    '@radix-ui/react-icons',
    'lucide-react',
  ],
  
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },
  
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/dist'],
      };
    }
    return config;
  },
  
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 5,
  },
  
  // Cache headers for static assets
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, must-revalidate" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  
  // Redirect trailing slashes
  trailingSlash: false,
  
  // Disable x-powered-by
  poweredByHeader: false,
};

module.exports = nextConfig;
