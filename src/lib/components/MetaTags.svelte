<script lang="ts">
    import { resolve } from "$app/paths";
    export const prerender = true;
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

<link rel="icon" type="image/png" href="/favicon-96x96.png" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="shortcut icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-title" content="shIT" />

<!-- Resolved becasue it is a real api endpoint -->
<link rel="manifest" href={resolve("/site.webmanifest")} />
