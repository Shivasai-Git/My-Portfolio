# MyPortfolio design

## Intent

A personal developer portfolio for Shivasai Aillaboina, closely following the cinematic black, oversized metallic typography, portrait mosaic, and understated navigation of the supplied Code & Chill reference. The reference guides visual composition; all personal information comes from the supplied profile.

## Visual system

- Fixed dark theme: background `#070707`, primary text `#eeece8`, body text `#a29f99`, rules `#292827`.
- Arial-based sans for navigation, body, and large display; Georgia for selected editorial emphasis and the name. System font availability keeps the site independent of remote font requests.
- Restrained chrome gradient on the hero title only. Actual portrait tiles with monochrome treatment; genuine certificate images keep their identity.
- Maximum width 1420px. Desktop gutters scale from 5.2vw; mobile gutters 24px, then 20px at very narrow widths.
- Buttons are pill or circle; content is editorial, without generic rounded card containers.
- Dial choices: variance 6, motion 5, density 4. The user’s requested reference takes priority over generic aesthetic rules.

## Responsive behavior

At 767px and below, section splits stack, navigation becomes a native dialog, the portrait shrinks, and certificate panels become a swipeable single-column gallery. At 380px and below, gutters and type reduce again. No page-wide horizontal scroll is intended.

## Interaction and access

Native dialogs support Escape and focus containment. The certificate gallery works with buttons, touch, and arrow keys when focused. Skills use native `details` disclosures. There is a skip link, visible keyboard focus, descriptive external links, and useful image alternatives. Reduced motion disables reveals and animated navigation. Stars are painted once per resize, with no perpetual animation loop.

## Content boundaries

Use the verified aspiring developer headline, skills, Warangal location, two education entries, and four certificate posts. Selected learning replaces unverified project claims. Contact uses the supplied public LinkedIn profile and its verified email address. No invented employment, testimonials, availability, metrics, projects, or private contact information.
