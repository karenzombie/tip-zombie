# Tip Zombie

## Overview
A worldwide tipping recommendation iOS app that provides customized tip calculations based on location, service type, bill amount, and number of people splitting the tip. Displays three tipping levels (Dissatisfied, Average, Exceptional).

**Developer:** Karen / Zombie Platforms, LLC
**Platform:** iOS (React Native with Expo)
**Business Model:** Free with ads (future)

## Recent Changes
- 2026-03-01: Addendum TZ-006 - Optional Tip Mode: 4th mode for countries where tipping is uncommon but optionally practiced (AU, NZ, SG, TW, IS, HK, PNG, BN). Cards show OPTIONAL badge, Skip/Good/Exceptional labels, muted grey-blue colors. Banner text updated for consistency. Taiwan/Singapore removed from hide-cards.
- 2026-03-01: Addendum TZ-005 - Global Tip Modes data expansion: Japan/S.Korea/China/Singapore/Taiwan updated with noneMessage+flatServices; Australia/NZ converted to none-mode; Scandinavia converted to flat+percentage hybrid; flatServices added to 15+ SE Asian/Latin American/South Asian countries; 25+ new countries added (Ghana, Nigeria, Ethiopia, etc.); currency-data.ts and cityToCountry mappings expanded
- 2026-03-01: Addendum TZ-004 - Flat-amount tip mode for countries where tipping is fixed amounts (not percentages). FR/DE/IT/ES configured with flat suggestions. Cards hide percentage row and show note text in flat mode. No changes to existing percentage calculation path.
- 2026-03-01: Addendum 6 - Location × Service Type contextual banner system with 4 banner types (INFO/CAUTION/NO_TIP/OPTIONAL), 30+ country rules, city-level overrides, cruise global override, hide-cards logic for no-tip countries
- 2026-03-01: Addendum 5 - Removed tip rounding (2 decimal precision), added Tax Amount + Post-Tax Amount fields with enable/disable logic, implemented 7 calculation scenarios including dual display (Scenario 7), tip cards now show both Tip and Total amounts
- 2026-02-14: Added Tip Guide tab with expandable accordion sections for Dissatisfied/Average/Exceptional service categories, renamed Home tab to Calculate, 3-tab navigation (Calculate, Tip Guide, Information)
- 2026-02-07: Added % / $ toggle for service charge and auto-gratuity inputs, updated calculation logic to handle dollar deductions, added Google Places location autocomplete with manual fallback
- 2026-02-07: Initial build - splash screen, home screen with form, results display, information screen, legal documents

## Architecture
- **Frontend:** Expo Router with file-based routing, React Native, TypeScript
- **Backend:** Express.js on port 5000 (API + landing page)
- **State:** Local state management with useState (no database needed)
- **Fonts:** Inter (Google Fonts)
- **Styling:** StyleSheet with custom color theme

### File Structure
```
app/
  _layout.tsx          - Root layout with splash screen, fonts, providers
  (tabs)/
    _layout.tsx        - Tab layout (Calculate + Tip Guide + Information)
    index.tsx          - Calculate screen (input form + tip results)
    tip-guide.tsx      - Tip Guide screen (service quality categories with accordion)
    information.tsx    - Tipping tips + legal document links
  privacy-policy.tsx   - Privacy Policy viewer
  terms.tsx            - Terms & Conditions viewer
constants/
  colors.ts            - App color theme
lib/
  tipping-data.ts      - Regional tipping data engine + service types
  tip-calculator.ts    - Tip calculation logic (7 scenarios, dual display, no rounding)
  currency-data.ts     - Currency symbols, formatting, and country mapping
assets/images/
  tip-zombie-logo.png  - App logo
```

### Key Design Decisions
- Custom animated splash screen (3-second dissolve)
- Dark green-to-black gradient header
- Dark navy tab bar
- Three colored tip cards: Red (Dissatisfied), Yellow (Average), Green (Exceptional)
- Regional tipping data with city-level overrides for major US cities
- No-tipping detection for East Asian countries

## User Preferences
- Bundle identifier: com.zombieplatforms.tipzombie
- App is completely free
- No user accounts needed
- Legal docs (Privacy Policy + Terms) must be accessible from Information tab
