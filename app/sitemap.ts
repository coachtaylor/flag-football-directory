export default function sitemap() {
    const base = process.env.SITE_URL || 'http://localhost:3000'
    return [
      { url: `${base}/`, lastModified: new Date() },
      { url: `${base}/explore`, lastModified: new Date() },
      // You can add static city/state routes here as you create them
    ]
  }
  