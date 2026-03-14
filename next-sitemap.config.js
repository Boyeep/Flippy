/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://boyeep.github.io/Flippy",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: "public",
};
