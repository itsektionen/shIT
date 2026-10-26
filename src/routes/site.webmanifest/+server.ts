export const prerender = true;

const webManifest = {
    name: "shIT",
    short_name: "shIT",
    start_url: "/",
    icons: [
        {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
        },
        {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
        },
    ],
    theme_color: "#1a1a2f",
    background_color: "#0e0e18",
    display: "standalone",
} as const;

export async function GET() {
    return new Response(JSON.stringify(webManifest), {
        headers: { "Content-Type": "application/manifest+json" },
    });
}
