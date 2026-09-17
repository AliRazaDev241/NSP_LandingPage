# National Skills Passport

Standalone, responsive project-expo showcase for National Skills Passport (NSP), affiliated with NED University of Engineering & Technology, Software Engineering.

## Files

- `index.html`: all page content, metadata and embedded SVG favicon.
- `style.css`: responsive layout, green/gold theme, CSS 3D credential and animations.
- `app.js`: three-stage walkthrough, pointer interaction and browser-based SHA-256 tamper demonstration.
- `.nojekyll`: tells GitHub Pages to serve the static files without Jekyll processing.

The three application files are the exact source of the published showcase. No generated bundle, package manager, build command, environment variables, API keys or server is required. Sites-specific configuration and Git history are excluded.

## Run locally

Extract this ZIP. From the extracted folder, run:

```sh
python -m http.server 8000
```

Open http://localhost:8000 in your browser. On Windows, `py -m http.server 8000` also works if Python is installed through the Windows launcher. Stop with Ctrl+C.

Use localhost for local testing and HTTPS in production: the hash demonstration uses the browser Web Crypto API, which needs a secure context.

## Publish to your GitHub repository

1. Create a repository on GitHub or use an existing repository of your choice.
2. Extract the ZIP and put its contents directly in the repository root. `index.html`, `style.css` and `app.js` must stay together. Upload the extracted files, not the ZIP itself.
3. Commit and push the files to your chosen branch (usually `main`).
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select your branch, choose **/(root)**, and click **Save**.
7. Wait for deployment, then use the published URL displayed in Pages settings.

GitHub Pages is available for public repositories on GitHub Free; private repository availability depends on your plan. Relative asset paths support both user sites and repository subpath sites.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Deploy elsewhere

Serve this folder as a static website with `index.html` as the entrypoint and HTTPS enabled. There is no install or build step. Choose the directory containing `index.html` as the publish directory.

## What the demonstration does

Visitors can move through Issuer Portal, Worker Wallet and Verifier DApp. The tamper interaction changes a fictional sample credential from Level 3 to Level 4 and computes a real SHA-256 digest in the browser. Restoring the credential restores the matching digest.

This is an educational simulation: it does not connect to Polygon, sign or issue real credentials, verify actual issuer signatures, provide authentication, store credentials, or implement offline wallet synchronization. Architecture and scale text describe the project; the sample is not a live platform.

The floating credential uses CSS perspective and transforms, rather than a heavyweight 3D library. Reduced-motion preferences disable animated motion.

## Customize

Edit text and sample details in `index.html` and `app.js`. Theme variables appear at the start of `style.css`; responsive rules appear later. If changing the sample credential, keep its display text and the object inside `digest()` consistent.

The CSS imports DM Sans and Manrope from Google Fonts. System-font fallbacks work if fonts cannot load. To eliminate that external request, remove the font import and use the fallback fonts or self-host licensed font files.

## Scroll and interaction motion

- The four-stage Tester → Superintendent → Worker → Verifier path draws its connections based on scroll position and switches to a vertical layout on phones.
- Trust badges tilt/lift on precise pointers and briefly react to touch.
- A fixed canvas network mesh gently follows the cursor across the whole page. It uses 18 particles at 20 fps on narrow screens, 32 particles at up to 30 fps on larger screens, and a maximum device pixel ratio of 1.5.
- A gold side line shows page reading progress.
- Scroll work is coalesced into animation frames. The mesh stops rendering in hidden tabs. Reduced-motion preferences display the complete workflow, disable tilt, and keep the mesh static.

All effects use browser APIs and CSS; no new dependencies are needed.
