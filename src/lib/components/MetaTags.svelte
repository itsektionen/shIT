<script lang="ts" module>
    import { resolve } from "$app/paths";

    export const prerender = true;

    export const webManifest = {
        name: "shIT",
        short_name: "shIT",
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
        theme_color: "#443355",
        background_color: "#0e0e18",
        display: "standalone",
    };
</script>

<title>shIT</title>
<meta name="description" content="A simple control app for Kistan 2.0" />
<meta name="generator" content="SvelteKit" />
<meta name="author" content="SMN" />

<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary" />

<meta name="color-scheme" content="dark light" />
<meta name="theme-color" content="#443355" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#f4f4fc" media="(prefers-color-scheme: light)" />

<link rel="icon" type="image/png" href={resolve("/favicon-96x96.png")} />
<link rel="icon" type="image/svg+xml" href={resolve("/favicon.svg")} />
<link rel="shortcut icon" href={resolve("/favicon.ico")} />
<link rel="apple-touch-icon" sizes="180x180" href={resolve("/apple-touch-icon.png")} />
<meta name="apple-mobile-web-app-title" content="shIT" />

<link rel="manifest" href={resolve("/site.webmanifest")} />
