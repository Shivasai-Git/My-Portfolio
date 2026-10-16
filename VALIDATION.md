# Validation

Checked on 16 October 2026 in the Codex browser.

- JavaScript syntax checks passed for the site and local preview server.
- Local preview returned HTTP 200.
- Desktop and mobile layouts inspected, including 320 px, 390 px, 1440 px, and 1920 px widths.
- No horizontal document overflow at the checked narrow and wide widths.
- Mobile menu opened, navigated to a section, and closed.
- Native skill disclosures expanded correctly.
- Certificate viewer opened the correct image; Escape closed it and restored focus.
- Gallery next/previous controls and return to the first certificate worked; all certificate images loaded.
- No warning or error messages appeared in the browser console during the checks.
- Reduced-motion and forced-color support are implemented; operating-system preference emulation was not available for a live test.

## Hosting

The local website is complete. Publication did not complete: Sites returned `Sites project not found` when refreshing the source credential and reading the already registered project. The existing identity in `.openai/hosting.json` was preserved. No replacement project was created and no source was pushed or deployed.

Open `dist/index.html` directly, or use `npm run dev` for a local preview at http://127.0.0.1:4178.
