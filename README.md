# Wong Xiao Han Portfolio

Personal portfolio for Wong Xiao Han, studying Data Science and Analytics with a second major in Economics at the National University of Singapore.

[View the portfolio](https://xhmallo.github.io/Wong-Xiao-Han-Portfolio/)

## Website

A responsive pastel pink portfolio with scroll-driven name transitions, animated section navigation, and space for education, technical skills, work experience, projects, awards and certificates, and leadership experience.

The site uses HTML, CSS, JavaScript, GSAP, ScrollTrigger, and Lenis. Fonts and animation libraries are bundled locally.

A floating AI assistant answers questions about the public portfolio using Cloudflare Workers AI. Conversations stay in the current browser session and are sent to Cloudflare for answers; the application does not store chat transcripts.

## Run locally

Open `index.html` in a browser, or serve this folder with any static web server. No build step or dependency installation is required.

## Edit

- `index.html`: page content and metadata.
- `style.css` and `pink.css`: layout, typography, colors, and responsive styles.
- `app.js`: navigation, section panels, and scroll animations.
- `chat.js` and `chat.css`: portfolio assistant interface and interactions.
- `worker/`: the separate Cloudflare Worker and its deployment configuration.
- `assets/`: fonts, favicon, and animation libraries.

## Hosting

GitHub Pages serves this repository's root directory from the `main` branch.

The chatbot is served by `wong-xiao-han-assistant.e1355249-915.workers.dev`. Its URL is set in the `data-endpoint` attribute on the chat script in `index.html`. Cloudflare credentials are never included in the website.

See `worker/README.md` for the required bindings and backend deployment instructions. Update the assistant's public portfolio context when adding or changing résumé details. Local visual previews work without credentials; live chat requests are restricted to the portfolio's production origin.
