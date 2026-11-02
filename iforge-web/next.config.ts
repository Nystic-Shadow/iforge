import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloud Services and IT Infrastructure became one service, Cloud & IT Infrastructure.
  async redirects() {
    return [
      { source: "/services/cloud-services", destination: "/services/it-cloud", permanent: true },
      { source: "/services/it-infrastructure", destination: "/services/it-cloud", permanent: true },
      { source: "/cloud-services", destination: "/it-cloud", permanent: true },
      { source: "/it-infrastructure", destination: "/it-cloud", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/it-cloud", destination: "/services/it-cloud" },
      { source: "/data-ai", destination: "/services/data-ai" },
      { source: "/cybersecurity-services", destination: "/services/cybersecurity-services" },
      { source: "/web-development", destination: "/services/web-development" },
      { source: "/digital-marketing", destination: "/services/digital-marketing" },
      { source: "/staffing-solutions", destination: "/services/staffing-solutions" },
    ];
  },
};

export default nextConfig;
