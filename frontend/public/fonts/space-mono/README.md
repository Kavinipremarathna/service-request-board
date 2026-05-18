Place Space Mono font files here so the site can self-host them.

Recommended files (at minimum):

- space-mono-v11-latin-regular.woff2

How to obtain the files:

1. Visit Space Mono on Google Fonts: https://fonts.google.com/specimen/Space+Mono
2. Download the family and extract the `.woff2` files, or use the Google Fonts CSS to locate the direct `fonts.gstatic.com` URLs.

Quick curl example (replace <URL> with the exact .woff2 URL you obtain):

```bash
curl -L -o frontend/public/fonts/space-mono/space-mono-v11-latin-regular.woff2 "<URL>"
```

After placing the files, redeploy the frontend. The project already includes a `@font-face` rule in `src/app/globals.css` which references `/fonts/space-mono/space-mono-v11-latin-regular.woff2`.

If you prefer the CDN approach instead, update your Content-Security-Policy to allow the font host shown in your browser console.
