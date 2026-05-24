import { useState, useEffect, useCallback } from "react";

// ─── CRUCIBLE v1.1.1 ─────────────────────────────────────────────────────────
// Dark theme only. No theme switcher. Stable baseline.
// All contrast values WCAG AA verified.

const APP_NAME = "CRUCIBLE";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  pageBg:         "#080810",
  surfaceBg:      "rgba(255,255,255,0.03)",
  surfaceBorder:  "rgba(255,255,255,0.09)",
  navBorder:      "rgba(255,255,255,0.08)",
  activeBg:       "rgba(167,139,250,0.1)",
  activeBorder:   "rgba(167,139,250,0.5)",

  // Text — all pass WCAG AA on #080810
  textPrimary:    "rgba(232,232,240,0.92)",  // 12.6:1
  textSecondary:  "rgba(232,232,240,0.72)",  // 9.4:1
  textMuted:      "rgba(232,232,240,0.55)",  // 6.8:1
  textGhost:      "rgba(232,232,240,0.50)",  // 4.6:1
  textDisabled:   "rgba(232,232,240,0.22)",  // intentional

  accent:         "rgba(167,139,250,0.9)",
  accentBorder:   "rgba(167,139,250,0.32)",
  green:          "rgba(74,222,128,0.9)",
  greenBg:        "rgba(74,222,128,0.08)",
  greenBorder:    "rgba(74,222,128,0.35)",
  weirdAccent:    "rgba(255,120,120,0.9)",
  weirdBg:        "rgba(255,80,80,0.05)",
  weirdBorder:    "rgba(255,80,80,0.2)",

  revealBg:       "rgba(100,60,255,0.07)",
  revealBorder:   "rgba(167,139,250,0.38)",
  acceptedBg:     "rgba(74,222,128,0.05)",
  acceptedBorder: "rgba(74,222,128,0.38)",

  shimmer: "linear-gradient(90deg,transparent,rgba(167,139,250,0.7),rgba(120,200,255,0.5),transparent)",
  gradient: "linear-gradient(135deg,#78c8ff,#a78bfa,#f472b6)",
  genBtnBg: "linear-gradient(135deg,rgba(167,139,250,0.13),rgba(120,200,255,0.1))",

  fontDisplay: "'Syne', sans-serif",
  fontBody:    "'Crimson Pro', serif",

  sheetBg:     "#0a0a14",
  sheetBorder: "rgba(255,255,255,0.1)",

  radius: 14,
  tierRadius: 12,
};

// ─── PROMPT DATA ──────────────────────────────────────────────────────────────

const GRAPHIC_STYLES = ["Bauhaus and geometric","Swiss and typographic","Art Nouveau and organic","Constructivist and bold","Memphis and chaotic","Brutalist and raw","Y2K and chrome","1970s and psychedelic","1990s and grunge","Mid-century and clean","Minimal with color","Maximalist and loud","Editorial and cold","Soft and painterly","Dark and cinematic","Grainy and analog","Flat and graphic","Typographic and loud","Grungy and layered","Warm and folk","Playful and bold"];
const ILLUSTRATION_STYLES = ["Editorial and cold","Soft and painterly","Dark and cinematic","Grainy and analog","Flat and graphic","Grungy and layered","Warm and folk","Playful and bold","Moody and illustrative","Earthy and tactile","Sharp and architectural","Quiet and editorial"];

const DISCIPLINES = [
  {id:"graphic",      label:"Graphic Design",  icon:"◈"},
  {id:"apparel",      label:"Apparel",          icon:"◎"},
  {id:"ui",           label:"UI / UX",          icon:"⬡"},
  {id:"brand",        label:"Brand Identity",   icon:"◇"},
  {id:"illustration", label:"Illustration",     icon:"✦"},
  {id:"packaging",    label:"Packaging",        icon:"⬠"},
];

const TIERS = [
  {id:"free",    label:"Free",    sub:"Full creative direction"},
  {id:"framed",  label:"Framed",  sub:"A little guidance"},
  {id:"defined", label:"Defined", sub:"Almost everything given"},
];

const GRAPHIC_BROAD=[["a concert poster","a rock band"],["a book cover","a crime thriller novel"],["a book cover","a sci-fi novel"],["a book cover","a fantasy novel"],["a book cover","a literary fiction novel"],["a book cover","a horror novel"],["a book cover","a self-help book"],["a book cover","a true crime book"],["a book cover","a graphic novel"],["a zine cover","an independent music publication"],["a zine cover","a skateboarding publication"],["a zine cover","a political commentary publication"],["a zine cover","an art collective"],["a magazine cover","a fashion magazine"],["a magazine cover","a sports magazine"],["a magazine cover","a music magazine"],["a magazine cover","a culture magazine"],["a vinyl record sleeve","a hip-hop artist"],["a vinyl record sleeve","a jazz musician"],["a vinyl record sleeve","an indie band"],["a vinyl record sleeve","an electronic artist"],["a vinyl record sleeve","a metal band"],["a vinyl record sleeve","a classical ensemble"],["an event poster","a film festival"],["an event poster","a food festival"],["an event poster","a music festival"],["an event poster","a comedy show"],["an event poster","a boxing match"],["an event poster","a wrestling event"],["an event poster","a gallery opening"],["a flyer","a nightclub event"],["a flyer","a community fundraiser"],["a menu system","a restaurant"],["a menu system","a cocktail bar"],["a menu system","a food truck"],["a stamp design","a postal service"],["a game day graphic","a professional sports team"],["a game day graphic","a college sports program"],["a player stats graphic","a sports media company"],["a matchday program cover","a soccer club"],["a billboard","a beverage brand"],["a billboard","a movie release"],["an infographic","a health organization"],["a transit map","a city transit authority"],["a wayfinding sign system","a university campus"]];
const GRAPHIC_SEMI=[["a concert poster","an indie rock band"],["a concert poster","a hip-hop artist"],["a concert poster","a jazz venue"],["a book cover","a noir detective novel"],["a book cover","a dystopian YA novel"],["a book cover","a literary short story collection"],["a vinyl record sleeve","a lo-fi hip-hop producer"],["a vinyl record sleeve","a post-punk band"],["a vinyl record sleeve","a synth-pop duo"],["a zine cover","a queer art collective"],["a zine cover","an underground skate crew"],["a zine cover","a DIY punk label"],["a magazine cover","a sneaker culture magazine"],["a magazine cover","an architecture magazine"],["a game day graphic","an NFL team"],["a game day graphic","an NBA team"],["a game day graphic","an NHL team"],["a game day graphic","a soccer club"],["a player stats graphic","a basketball player"],["a player stats graphic","a hockey player"],["a player stats graphic","a baseball player"],["a matchday program cover","a Premier League club"],["a menu system","a Japanese restaurant"],["a menu system","a Mexican street food spot"],["a menu system","a craft cocktail bar"],["an event poster","a tattoo convention"],["an event poster","a sneaker convention"],["an event poster","a horror film festival"],["an event poster","a pro wrestling event"],["an event poster","a jazz festival"],["an editorial spread","a political news magazine"],["an editorial spread","a travel publication"],["an infographic","a sports analytics platform"],["an infographic","a climate nonprofit"],["a transit map redesign","a metro system"],["a billboard campaign","an energy drink brand"],["a billboard campaign","a streaming platform"]];
const GRAPHIC_ULTRA=["Design a Monday Night Football matchup graphic for the Steelers vs. Bears. Brutalist and grungy. Black and gold.","Design a concert poster for Kendrick Lamar. Typographic and minimal. Black and white with one hit of red.","Design a vinyl record sleeve for a Radiohead album. Cold and architectural. Concrete grey with no warmth.","Design a cover for The New Yorker. One illustration, no photos. Muted and editorial.","Design a book cover for Cormac McCarthy's next novel. No figures, no color. Let the type do everything.","Design a matchday program cover for Liverpool FC. Brutalist and typographic. Red and black.","Design a player stats graphic for LeBron James' scoring record. Cinematic and dark. Gold on black.","Design an event poster for Coachella. Flat and geometric. Desert colors — sand, terracotta, dusty purple.","Design a game day graphic for the Cowboys vs. the 49ers. Editorial and sharp. Navy and gold.","Design a vinyl record sleeve for a Frank Ocean album. Quiet and cinematic. One soft color, extreme crop.","Design a zine cover for an independent skateboarding publication. DIY and photocopied. Black and white.","Design a menu system for a Japanese omakase restaurant. Minimal and typographic. Black ink on cream.","Design a movie poster for a psychological horror film. No faces. Atmosphere only. Deep green and black.","Design a game day graphic for the Chiefs vs. Bills in the playoffs. Maximalist and punchy. Red and white.","Design a book cover for a debut poetry collection by a young woman from Lagos. Vivid and textured. Warm yellows and orange.","Design a concert poster for Nine Inch Nails. Industrial and raw. Black with a single harsh white or red.","Design a magazine cover for WIRED's annual Future issue. One strong idea. No clutter. Electric blue and white.","Design a transit map for the Tokyo Metro. Clarity is the entire aesthetic. Clean and systematic.","Design a game day graphic for an NHL Winter Classic. Cold and cinematic. Ice blue and white.","Design a book cover for a horror novel set in the Louisiana bayou. Dark, humid, and Southern Gothic. Deep green and brown."];
const APPAREL_GARMENTS=["t-shirt","hoodie","quarter-zip","crewneck sweatshirt","work jacket","varsity jacket","coaches jacket","snapback hat","fitted cap","trucker hat","beanie","joggers","jersey","windbreaker","flannel shirt","socks","tote bag","bomber jacket","shorts","uniform"];
const APPAREL_BROAD=["a skateboarding brand","a surf brand","a streetwear brand","a workwear brand","a hunting brand","a fishing brand","a motorcycle brand","a boxing gym","a CrossFit gym","a yoga studio","a soccer club","a basketball team","a football team","a baseball team","a hockey team","a lacrosse team","a wrestling program","a track and field team","a music festival","a metal band","a hip-hop artist","a country artist","a punk band","a craft brewery","a coffee roaster","a barbershop","a tattoo shop","a record label","an outdoor gear brand","a trail running brand","a construction company","a fire department","a landscaping company","a youth sports league","a college esports team"];
const APPAREL_SEMI=["a skate shoe brand","a surfboard company","an independent streetwear label","a workwear brand for tradespeople","a duck hunting brand","a fly-fishing brand","a custom motorcycle shop","a boxing gym in a major city","an outdoor climbing brand","a collegiate wrestling program","a community soccer club","a minor league baseball team","an AHL hockey team","a college football program","an NBA G League team","an independent record label","a metal festival","a hip-hop collective","a vintage-inspired running brand","a trail running brand","a tattoo convention brand","a craft distillery","a specialty coffee company","a local barbershop chain","a college esports organization","a fire station crew","a construction crew","a campus organization","a competitive shooting brand","a dirt bike brand"];
const APPAREL_ULTRA=[["t-shirt","streetwear","CORRIDOR"],["hoodie","streetwear","DEAD WEIGHT"],["work jacket","workwear","IRON SHIFT"],["uniform","athletic","VELO"],["coaches jacket","sports","NORTHSIDE FC"],["varsity jacket","collegiate","GRANT ATHLETICS"],["snapback hat","streetwear","PHANTOM CITY"],["bomber jacket","streetwear","COLDFRONT"],["t-shirt","outdoor","RIDGE LINE"],["hoodie","athletic","GRAVEL"],["crewneck sweatshirt","skate","BLACKTOP"],["jersey","soccer","WOLVES FC"],["windbreaker","trail running","SUMMIT CREW"],["socks","streetwear","LOWERCASE"],["flannel shirt","workwear","MILLTOWN"],["tote bag","lifestyle","STILL WATER"],["quarter-zip","athletic","PACE"],["fitted cap","streetwear","NOCTURN"],["beanie","outdoor","TREELINE"],["t-shirt","punk band merch","STATIC BLOOM"],["hoodie","hip-hop artist merch","GREY MARKET"],["work jacket","fire department","ENGINE CO. 9"],["shorts","boxing","BLOODLINE GYM"],["t-shirt","tattoo shop merch","INK & BONE"],["crewneck sweatshirt","coffee brand","GROUNDS"]];
const UIUX_BROAD=[["an onboarding flow","a meditation app"],["an onboarding flow","a fitness tracker"],["an onboarding flow","a personal finance app"],["an onboarding flow","a language learning app"],["an onboarding flow","a food delivery app"],["a home screen","a music streaming app"],["a home screen","a news aggregator app"],["a home screen","a recipe platform"],["a home screen","a journaling app"],["a dashboard","a freelance project management tool"],["a dashboard","a small business analytics platform"],["a dashboard","a sports performance tracker"],["a dashboard","a crypto portfolio app"],["a dashboard","a personal health tracker"],["a profile page","a social network"],["a profile page","a creative portfolio platform"],["a profile page","a dating app"],["a settings screen","a privacy app"],["a checkout flow","an e-commerce platform"],["a checkout flow","a ticketing platform"],["a search and filter screen","a job board"],["a search and filter screen","a secondhand clothing app"],["a paywall screen","a premium news platform"],["a paywall screen","a creative tools subscription"],["an empty state","a task management app"],["an empty state","a messaging platform"],["a 404 page","a design studio"],["a 404 page","a gaming platform"],["a loading state","a photo editing app"],["a push notification design","a habit tracker"],["a watch face","a fitness watch"],["a kiosk interface","a museum"],["a TV streaming interface","a documentary platform"],["a nav bar","a dark-mode music app"],["a nav bar","a minimalist productivity tool"],["a sign-up screen","a community platform"],["a sign-up screen","a fintech app"],["a map interface","a local events platform"],["a camera interface","a food photography app"],["an in-app rating prompt","a travel app"]];
const UIUX_SEMI=["Design a warm, step-by-step onboarding flow with soft colors and encouraging microcopy for a sobriety support app.","Design a minimal onboarding flow with large type and a single focus per screen for an AI writing assistant.","Design a playful onboarding flow with illustrated plant characters and gentle progress indicators for a plant care reminder app.","Design a moodlit home screen with album art dominating the layout and a persistent mini-player for a lo-fi music streaming app.","Design a data-forward home screen with weekly mileage rings, upcoming runs, and a dark training log feel for a marathon training app.","Design a browsable home screen with live scores, player cards, and a bold league color system for a fantasy sports platform.","Design a clean invoice dashboard with color-coded payment status, quick-send actions, and a monthly earnings summary for a freelance invoice tracker.","Design a tax dashboard with a running yearly estimate, deduction categories, and calm neutral tones for a self-employed tax tool.","Design a sleep dashboard with a nightly score graph, sleep stage breakdown, and a dark blue night-mode feel for a sleep tracking app.","Design a performance dashboard with speed, strength, and recovery metrics laid out in a bold athletic grid for a college athlete app.","Design a profile page with a prominent work portfolio grid, client reviews, and availability status for a freelance design marketplace.","Design a profile page with service categories, photos, ratings, and a one-tap booking button for a local services app.","Design a high-tension checkout flow with a countdown timer, size confirmation, and minimal steps for a limited-drop streetwear platform.","Design a checkout flow with vinyl cover art preview, condition grading, and seller rating visible throughout for a vinyl record marketplace.","Design a search screen with photo-forward artist cards, filterable tattoo styles, and location-based results for a tattoo artist discovery app.","Design a search screen with a map view toggle, gym photos, and filter chips for difficulty and amenities for a climbing gym finder.","Design a paywall screen with episode previews, listener counts, and a soft conversion tone for a podcast platform.","Design a paywall screen with featured game screenshots, early access framing, and an indie-friendly low-pressure tone for a game launcher.","Design an empty state with an illustrated athlete and a streak-starting CTA for a goal-setting app.","Design a 404 page with a bold typographic treatment, dark background, and a dry, self-aware message for a creative portfolio site.","Design a settings screen organized by privacy risk level with clear toggle labels and no dark patterns for a messaging app.","Design a watch face with pace, heart rate, and elapsed time in a high-contrast arc layout for a trail running watch.","Design an order kiosk with large tap targets, a visual menu grid, and a smooth upsell moment before checkout for a coffee shop.","Design a browsable home screen with curated collections, minimalist film cards, and a dark cinematic feel for an indie film platform.","Design a push notification with a single hydration action, a water drop visual, and a friendly conversational tone for a water intake app.","Design a sign-up screen with neighborhood selector, a community photo, and low-friction fields for a mutual aid network.","Design a loading screen with a subtle generative animation and a progress hint that feels like anticipation, not waiting.","Design an in-app rating prompt with two large emoji reactions and a single optional text field for a food delivery app.","Design a camera interface with a film stock selector, grain preview overlay, and analog-style exposure controls.","Design a map interface with route difficulty color coding, elevation thumbnails, and a save-for-later action for a cycling route planner."];
const UIUX_ULTRA=["Design the onboarding flow for Duolingo's new sign language course. Playful but not childish. Bright and friendly.","Design the empty state for a brand-new Notion workspace. Minimal and inviting. Light and open.","Design a financial dashboard for a freelance designer's invoicing tool. Dark mode and data-dense. Monochrome with green accents.","Design the checkout flow for a limited-edition Supreme drop. Minimal and high-tension. Red and white.","Design a watch face for the Whoop fitness tracker. Functional and stripped back. Dark with white data.","Design the onboarding flow for a sobriety app targeting people under 30. Warm and human. Soft earth tones.","Design the search and filter screen for StockX. Dense and transactional. Clean with orange accents.","Design a TV streaming interface for A24's exclusive platform. Dark and cinematic. Let the film stills lead.","Design the 404 page for Figma. On-brand and unexpected. Purple and white.","Design the home screen for Spotify's DJ feature. Immersive and music-forward. Dark with green.","Design a paywall screen for a premium investigative journalism platform. Serious and editorial. Black and white.","Design the settings screen for a privacy-first messaging app. Clear and trustworthy. Minimal with blue accents.","Design the player stats dashboard for the NBA app. Bold and data-rich. Dark with team colors.","Design a kiosk interface for a climate change museum exhibit. Clear and accessible. Cool blues and white.","Design an in-app rating prompt for DoorDash. Fast and frictionless. Red and white.","Design a camera interface for a film grain simulation app. Analog and tactile. Warm and muted.","Design the loading state for a generative AI design tool. Anticipatory and calm. Dark with a single animated accent.","Design the profile page for a freelance design marketplace. Portfolio-forward and scannable. Clean and light.","Design a sign-up screen for a neighborhood mutual aid network. Local and human. Warm colors, no corporate energy.","Design the home screen for a mental health journaling app. Soft, private, and calm. Muted greens and cream."];
const BRAND_BROAD=[["a logo","a retro tournament organization"],["a logo","a women's boxing gym"],["a logo","a community radio station"],["a logo","a neighborhood corner store that's been open since the 1950s"],["a logo","a prison reform nonprofit"],["a logo","a collective of Black-owned barbershops"],["a logo","an independent wrestling promotion"],["a logo","a vintage motorcycle club"],["a logo","a mutual aid food pantry"],["a logo","a youth skateboarding program"],["a logo","a queer sports league"],["a logo","a one-person tattoo studio"],["a logo","a hand-rolled cigar brand"],["a logo","a wilderness survival school"],["a logo","a ferry service in a coastal town"],["a logo","an independent boxing promoter"],["a logo","a fly-fishing guide company"],["a logo","a dog rescue organization"],["a logo","a community garden collective"],["a logo","a neighborhood basketball league"],["a logo","a worker-owned moving company"],["a logo","a custom knife maker"],["a logo","a small-town diner that hasn't changed since 1962"],["a logo","a competitive chili cooking team"],["an icon set","a construction company"],["an icon set","a hospital wayfinding system"],["a brand pattern","a luxury hotel"],["a brand pattern","a children's clothing label"],["a badge mark","a firefighters' union"],["a badge mark","a craft beer competition"]];
const BRAND_SEMI=[["a wordmark","a sandwich shop","Stacked"],["a wordmark","a coffee shop","Grounds"],["a wordmark","a barbershop","Taper & Thread"],["a wordmark","a record shop","Pressed"],["a wordmark","a bookstore","Dog-Ear"],["a wordmark","a climbing gym","Grit"],["a wordmark","a boxing gym","The Shed"],["a wordmark","a tattoo studio","Iron & Salt"],["a wordmark","a hot sauce company","Blister"],["a wordmark","a vintage clothing shop","Sunday's Best"],["a wordmark","a brewery","Overgrown"],["a wordmark","a pizza shop","The Oven"],["a lettermark","a law firm","Mercer & Cole"],["a lettermark","an architecture firm","Brunt Studio"],["a lettermark","a photography studio","Frame"],["a monogram","a bespoke tailoring shop","Finch"],["a monogram","a whiskey distillery","Gravel Road"],["a pictorial mark","a surf brand","Drift"],["a pictorial mark","a hiking brand","Ridgeline"],["a pictorial mark","a bird watching society","Wingspan"],["a badge mark","a BBQ competition team","Low and Slow"],["a badge mark","a hunting club","Birchwood Field"],["a mascot logo","a community soccer club","The Foxes"],["a mascot logo","a high school sports program","The Titans"],["an emblem","a private members club","The Cellar"],["an emblem","a cycling club","Fixed"],["a brand stamp","an independent butcher","The Block"],["a sticker pack","a skate crew","Faceplant"],["an icon set","a meditation app","Still"],["a sub-brand mark","the youth arm of a credit union","Harvest"]];
const BRAND_ULTRA=["Design a mascot logo for an electrical company named Zapped. Bold and playful. Yellow and black.","Design a wordmark for a sandwich shop called Stacked. Loud and confident. Black and red.","Design an emblem for a boxing gym called Ironwork. Tough and hand-crafted. Black with a hit of red.","Design a brand mark for a coffee shop called Grounds. It operates in a converted gas station. Warm and industrial. Brown and cream.","Design a pictorial mark for a kayaking tour company called Still Water. Clean and minimal. Deep teal.","Design a mascot logo for a minor league baseball team called the River Dogs. Gritty and regional. Navy and gold.","Design a sticker pack for a skate crew called Faceplant. DIY and irreverent. Black and white with one pop of color.","Design a wordmark for a tattoo studio called Iron & Salt. Dark and typographic. Black on white.","Design a brand mark for a nonprofit dog rescue called Second Chance. Warm and trustworthy. Warm orange and cream.","Design a mascot logo for a competitive BBQ team called Low and Slow. Proud and regional. Red and black.","Design an icon set for a wilderness survival school. Rugged and clear. Black on a natural background.","Design a lettermark for a law firm called Mercer & Cole focused on wrongful conviction cases. Serious and human. Deep navy.","Design a brand pattern for a boutique hotel that used to be a textile mill. Geometric and historic. Warm neutrals.","Design a badge mark for a homebrew beer competition called Fermenter's Cup. Hand-crafted and celebratory. Amber and brown.","Design a wordmark for a brewery called Overgrown. Wild and organic. Deep green and black.","Design a mascot logo for a high school wrestling team called the Bulldogs. Classic and tough. Maroon and gold.","Design a pictorial mark for a birdwatching society called Wingspan. Delicate and precise. Single color.","Design an emblem for a private motorcycle club called Iron & Road. Earned and bold. Black and chrome.","Design a wordmark for a handmade knife maker called Edge. Sharp and minimal. Black on white.","Design a sub-brand mark for the youth arm of a credit union called Harvest. Fresh and approachable. Green with warm accents."];
const ILLUS_BROAD=[["an editorial illustration","an article about loneliness in cities"],["an editorial illustration","an article about climate change and the ocean"],["an editorial illustration","an article about the gig economy"],["an editorial illustration","an article about insomnia"],["an editorial illustration","an article about social media and identity"],["an editorial illustration","an article about immigration"],["an editorial illustration","an article about grief"],["a book cover","a novel about a road trip taken by estranged siblings"],["a book cover","a poetry collection about urban grief"],["a book cover","a sci-fi novel about first contact"],["a book cover","a horror novel set in a swamp"],["a children's book cover","a story about a kid who can't sleep"],["a children's book cover","a story about a dog who gets lost"],["a children's book spread","a scene in a magical forest"],["a children's book spread","a scene in a busy city market"],["a skateboard deck graphic","a skateboarding brand"],["a skateboard deck graphic","an artist collaboration"],["a snowboard base graphic","an outdoor sports brand"],["a skateboard deck series","a horror-themed brand drop"],["a tattoo flash sheet","a traditional style studio"],["a tattoo flash sheet","a neo-traditional studio"],["a mural concept","a community center"],["a mural concept","a school cafeteria"],["a mural concept","a transit station"],["a poster illustration","a music venue"],["a poster illustration","a film series"],["a poster illustration","a city tourism campaign"],["a surface pattern","a textile company"],["a surface pattern","a children's clothing brand"],["a surface pattern","a home goods brand"],["a character design","an indie video game"],["a character design","an animated short film"],["a character design","a graphic novel"],["a map illustration","a tourism guide for a city"],["a map illustration","a fantasy novel's world"],["a creature design","a fantasy game"],["a wrapping paper design","a holiday gift brand"],["a greeting card illustration","an independent stationery company"],["a playing card back design","an independent card game"]];
const ILLUS_SEMI=["an editorial illustration about burnout and overwork","an editorial illustration about the housing crisis","an editorial illustration about addiction and recovery","an editorial illustration about the experience of being an immigrant","an editorial illustration about the loneliness of being a first-generation student","a book cover for a memoir about growing up in a small town","a book cover for a thriller set in Tokyo","a book cover for a debut novel about two women falling in love","a children's book cover about a kid who starts a neighborhood band","a skateboard deck graphic for a horror-themed brand drop","a skateboard deck graphic inspired by street maps of New York City","a skateboard deck series about the four seasons","a tattoo flash sheet of ocean creatures","a tattoo flash sheet of classic American traditional imagery","a tattoo flash sheet of botanical and floral imagery","a mural concept about the history of a neighborhood","a mural concept celebrating local athletes","a surface pattern for a luxury bed linen brand","a surface pattern for a children's backpack brand","a surface pattern for a ceramics company inspired by folk art","a character design for the villain of an indie platformer game","a character design for the protagonist of a graphic novel about a retired boxer","a map illustration for a walking tour of a historic neighborhood","a poster illustration for an annual jazz festival","a poster illustration for a film noir marathon event","a greeting card series for a queer-owned stationery brand","a wrapping paper design for a sustainable gift wrap company","a creature design for a monster that embodies urban anxiety","a children's book spread showing a busy night market","a playing card back design for an independent publisher"];
const ILLUS_ULTRA=["Create an editorial illustration for The New Yorker about urban loneliness. Quiet and symbolic. Muted blues and grey.","Create a book cover for a debut thriller set in Seoul. Modern and tense. Deep red and black.","Create a skateboard deck graphic for Santa Cruz's Halloween drop. Dark and illustrative. Black, orange, and bone white.","Create a tattoo flash sheet for a traditional nautical studio. Bold and classic. Black with limited color fill.","Create an editorial illustration for TIME about the mental health crisis among teenagers. Honest and unexpected. Soft and desaturated.","Create a mural concept for the entryway of a public high school in Chicago. Aspirational and community-driven. Warm and vivid.","Create a surface pattern for Poketo's new stationery line. Geometric and joyful. Bright with a modern palette.","Create a character design for the lead of an indie game called Hollow Roads — a long-haul trucker who can see ghosts. Weathered and strange.","Create a children's book cover for a story called The Last Firefly. Tender and slightly melancholy. Soft greens and warm yellow.","Create a poster illustration for a Rolling Stones residency at Madison Square Garden. Bold and rock and roll. Red and black.","Create a book cover for a poetry collection called Flood Season set in New Orleans. Heavy and atmospheric. Deep blue and brown.","Create a creature design for the final boss of a horror mobile game. Unsettling at any size. Dark with one unnatural accent color.","Create a skateboard deck series for Powell Peralta's anniversary. Three decks, three decades. Let each era have its own visual language.","Create a surface pattern for a textile brand inspired by West African weaving traditions. Rich and geometric. Deep terracotta and gold.","Create an editorial illustration for WIRED about what happens to your data when you die. Conceptual and unexpected. Cold and blue.","Create a tattoo flash sheet for a neo-traditional studio with Japanese influence. Refined and detailed. Black with selective color.","Create a children's book spread set in a Brooklyn laundromat at night. Warm and busy. Rich saturated colors.","Create a map illustration for a large music festival's artist handbook. Illustrated and detailed. Warm and friendly.","Create a greeting card series for a queer-owned stationery brand. Six cards. Joyful and inclusive across a range of occasions.","Create a mural concept for a community boxing gym that's been open 40 years. Bold and celebratory. Red, black, and gold."];
const PACK_BROAD=[["a beverage can label","a craft soda brand"],["a beverage can label","a sparkling water brand"],["a beverage can label","a hard seltzer brand"],["a beverage can label","an energy drink brand"],["a beer bottle label","a craft brewery"],["a wine label","a natural wine producer"],["a wine label","a rosé wine brand"],["a spirits bottle label","a craft gin brand"],["a spirits bottle label","a bourbon distillery"],["a hot sauce bottle label","a small-batch condiment company"],["a coffee bag","an independent coffee roaster"],["a tea sachet and box","a specialty tea brand"],["a spice jar label system","a spice company"],["a honey jar label","a local honey producer"],["a jam jar label","a small-batch preserve maker"],["a candle jar label","an independent candle brand"],["a soap bar packaging","a handmade soap brand"],["a skincare tube label","a clean beauty brand"],["a supplement bottle label","a wellness brand"],["a protein powder bag","a sports nutrition brand"],["a snack bag","a chips brand"],["a snack bag","a popcorn brand"],["a chocolate bar wrapper","an artisan chocolate brand"],["a cereal box","an independent cereal brand"],["a pasta box","an artisan pasta brand"],["a seed packet","a heritage seed company"],["a mailer box","a subscription box brand"],["a paper retail bag","a bakery"],["a hang tag","an independent clothing brand"],["an unboxing experience","a luxury e-commerce brand"]];
const PACK_SEMI=[["a beverage can label","a small-batch mushroom coffee brand"],["a beverage can label","a CBD sparkling water brand"],["a beer bottle label","a sour beer brand"],["a beer bottle label","a stout series for a regional brewery"],["a wine label","a women-owned natural wine brand"],["a spirits bottle label","a mezcal brand with indigenous roots"],["a spirits bottle label","a canned cocktail brand for outdoor use"],["a hot sauce bottle label","a Caribbean-style hot sauce brand"],["a coffee bag","a single-origin coffee brand that sources from Ethiopia"],["a tea box and sachet","a functional mushroom tea brand"],["a spice jar label system","a chef-founded spice brand"],["a honey jar label","a raw wildflower honey brand"],["a candle jar label","a candle brand inspired by film locations"],["a soap bar packaging","a soap brand for athletes"],["a skincare bottle label","a gender-neutral skincare brand"],["a supplement bottle label","a nootropic brand targeting creatives"],["a protein powder bag","a plant-based protein brand for endurance athletes"],["a snack bag","a spicy Korean-style chips brand"],["a chocolate bar wrapper","a single-origin dark chocolate brand"],["a seed packet series","a garden company that sells rare heirloom varieties"],["a mailer box","a curated vintage book subscription service"],["a paper retail bag","a Japanese-style bakery in the US"],["an unboxing experience","a direct-to-consumer skincare brand targeting Gen Z"],["a hang tag series","an independent workwear brand"],["a cereal box","a functional breakfast brand for kids with no artificial ingredients"]];
const PACK_ULTRA=["Design a limited edition can for Liquid Death collaborating with a metal band. Dark and aggressive. Black with a hit of blood red.","Design a coffee bag for a roaster that sources exclusively from female-led farms in Colombia. Warm and story-forward. Earthy greens and brown.","Design a wine label for a natural wine brand called Skin Contact. Lo-fi and irreverent. Black and cream.","Design a hot sauce bottle label for a brand called Caldera. Bold and intense. Deep red and black.","Design the unboxing experience for Glossier's holiday gift set. Soft and considered. Millennial pink and white.","Design a beer label series for a brewery's four seasonal releases. One cohesive system, four distinct feels. Earthy and illustrated.","Design a supplement bottle label for a nootropic brand called Altitude. Clean and confident. White with deep blue.","Design a snack bag for a Korean-owned chips brand called Gochugaru Gang. Bold and culturally specific. Red and black.","Design a chocolate bar wrapper series for a single-origin brand called Latitude. Five bars, five countries. Rich and editorial.","Design a seed packet series for a heritage seed company called Open Pollinated. Botanical and systematic. Kraft and green.","Design a spirits bottle label for a Japanese whisky brand called Fog. Minimal and typographic. White and grey.","Design a candle label series for a brand called Locations — each scent is a real place. Evocative and distinct. Muted and editorial.","Design a mailer box for a vinyl subscription service called B-Side. The unboxing should feel like flipping through a record bin. Black and cream.","Design a CBD sparkling water can for a brand called Still. Calm and minimal. Soft blue and white.","Design a hang tag system for an independent workwear brand called Iron Shift. Tough and honest. Black and kraft.","Design a soap packaging for a brand called Residue that makes soap from restaurant cooking oils. The concept is the design. Raw and honest.","Design a cereal box for a clean kids' brand called Patch. Modern and friendly. No mascot. Bright and fresh.","Design a protein powder bag for a plant-based endurance brand called Gravel. Rugged and purposeful. Charcoal and orange.","Design a mezcal bottle label for a brand called Humo from a small village in Oaxaca. Cultural and artisanal. Earthy and smoky.","Design a coffee bag for a roaster called Grounds operating out of a converted gas station. Industrial and warm. Black and amber."];
const WEIRD_STYLES=[{label:"Soviet Propaganda",search:"soviet propaganda poster art"},{label:"Bauhaus",search:"bauhaus design geometric typography"},{label:"Y2K",search:"Y2K design aesthetic chrome 2000s"},{label:"Wes Anderson",search:"wes anderson symmetrical pastel aesthetic"},{label:"Memphis Group",search:"memphis group design 1980s colorful"},{label:"Swiss International Style",search:"swiss international typographic style helvetica"},{label:"Lo-fi Zine",search:"lo-fi zine risograph print independent"},{label:"Luxury Parisian Fashion",search:"luxury parisian fashion house editorial"},{label:"Vintage NASA",search:"vintage NASA space poster retro 1970s"},{label:"Art Nouveau",search:"art nouveau ornamental illustration botanical"},{label:"Brutalist Web",search:"brutalist web design raw anti-design"},{label:"1970s Psychedelic",search:"1970s psychedelic poster art groovy"},{label:"Ukiyo-e",search:"ukiyo-e japanese woodblock print"},{label:"De Stijl",search:"de stijl mondrian primary colors grid"},{label:"Vaporwave",search:"vaporwave aesthetic purple grid"},{label:"1940s Travel Poster",search:"vintage 1940s travel poster illustration"}];
const WEIRD_BRANDS=["Nike","Adidas","Jordan Brand","New Balance","Spotify","Apple","Netflix","Discord","Notion","Duolingo","Airbnb","Supreme","Palace","Stüssy","Carhartt","Stone Island","A24","Red Bull","Liquid Death","Oatly","Chipotle","McDonald's","NASA","MoMA","Rolling Stone","Coachella","Sundance","The New York Times","WIRED","Vogue","National Geographic","IKEA","Patagonia","Levi's","Vans","New Era","Champion","Poketo","Powell Peralta","Santa Cruz"];

// ─── SHUFFLE DECK ─────────────────────────────────────────────────────────────
const _decks = {};
function deal(arr, key) {
  if (!_decks[key] || _decks[key].length === 0) {
    const deck = [...arr];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    _decks[key] = deck;
  }
  return _decks[key].pop();
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ─── BUILD PROMPT ─────────────────────────────────────────────────────────────
function buildPrompt(discipline, tier) {
  if (tier === "weird") {
    const pools = {graphic:GRAPHIC_BROAD,ui:UIUX_BROAD,brand:BRAND_BROAD,illustration:ILLUS_BROAD,packaging:PACK_BROAD};
    const del = discipline==="apparel" ? pick(APPAREL_GARMENTS) : (()=>{const e=pick(pools[discipline]);return Array.isArray(e)?e[0]:e;})();
    const wStyle=pick(WEIRD_STYLES), wBrand=pick(WEIRD_BRANDS);
    return {prompt:`Design ${del} for ${wBrand}, executed entirely in the visual language of ${wStyle.label}.`, deliverable:del, style:wStyle.label, weirdBrand:wBrand, weirdStyle:wStyle};
  }
  if (discipline==="graphic") {
    if (tier==="defined") return {prompt:deal(GRAPHIC_ULTRA,"gu"), deliverable:"graphic design", style:null, weirdBrand:null, weirdStyle:null};
    const [d,c]=deal(tier==="free"?GRAPHIC_BROAD:GRAPHIC_SEMI, tier==="free"?"gf":"gm");
    const style = tier==="framed" ? pick(GRAPHIC_STYLES) : null;
    return {prompt:`Design ${d} for ${c}.${style?` ${style}`.replace(/\.$/,"").trim()+".":""}`, deliverable:d, style, weirdBrand:null, weirdStyle:null};
  }
  if (discipline==="apparel") {
    if (tier==="defined") {const [g,w,b]=deal(APPAREL_ULTRA,"au");return {prompt:`Design a ${g} for ${w} brand called ${b}.`,deliverable:g,style:null,weirdBrand:null,weirdStyle:null};}
    const g=pick(APPAREL_GARMENTS), c=deal(tier==="free"?APPAREL_BROAD:APPAREL_SEMI,tier==="free"?"af":"am");
    return {prompt:`Design a ${g} for ${c}.`, deliverable:g, style:null, weirdBrand:null, weirdStyle:null};
  }
  if (discipline==="ui") {
    if (tier==="defined") return {prompt:deal(UIUX_ULTRA,"uu"),deliverable:"UI design",style:null,weirdBrand:null,weirdStyle:null};
    if (tier==="framed") return {prompt:deal(UIUX_SEMI,"um"),deliverable:"UI design",style:null,weirdBrand:null,weirdStyle:null};
    const [d,c]=deal(UIUX_BROAD,"uf");
    return {prompt:`Design ${d} for ${c}.`,deliverable:d,style:null,weirdBrand:null,weirdStyle:null};
  }
  if (discipline==="brand") {
    if (tier==="defined") return {prompt:deal(BRAND_ULTRA,"bu"),deliverable:"brand identity",style:null,weirdBrand:null,weirdStyle:null};
    if (tier==="free") {const [d,c]=deal(BRAND_BROAD,"bf");return {prompt:`Design ${d} for ${c}.`,deliverable:d,style:null,weirdBrand:null,weirdStyle:null};}
    const [m,b,n]=deal(BRAND_SEMI,"bm");
    return {prompt:`Design a ${m} for ${b} called ${n}.`,deliverable:m,style:null,weirdBrand:null,weirdStyle:null};
  }
  if (discipline==="illustration") {
    if (tier==="defined") return {prompt:deal(ILLUS_ULTRA,"iu"),deliverable:"illustration",style:null,weirdBrand:null,weirdStyle:null};
    if (tier==="free") {const [d,c]=deal(ILLUS_BROAD,"if");return {prompt:`Create ${d} for ${c}.`,deliverable:d,style:null,weirdBrand:null,weirdStyle:null};}
    const style=pick(ILLUSTRATION_STYLES);
    return {prompt:`Create ${deal(ILLUS_SEMI,"im")}. ${style}.`,deliverable:"illustration",style,weirdBrand:null,weirdStyle:null};
  }
  if (discipline==="packaging") {
    if (tier==="defined") return {prompt:deal(PACK_ULTRA,"pu"),deliverable:"packaging",style:null,weirdBrand:null,weirdStyle:null};
    const [c,p]=deal(tier==="free"?PACK_BROAD:PACK_SEMI,tier==="free"?"pf":"pm");
    return {prompt:`Design ${c} for ${p}.`,deliverable:c,style:null,weirdBrand:null,weirdStyle:null};
  }
  return {prompt:"Design a poster for a music venue.",deliverable:"event poster",style:null,weirdBrand:null,weirdStyle:null};
}

// ─── CONTEXT LINKS ────────────────────────────────────────────────────────────
function buildContextLinks(deliverable, style) {
  const raw = deliverable || "design reference";
  const cleanDel = raw.replace(/^(design |create |a |an |the )/gi,"").trim();
  const delQuery = encodeURIComponent(cleanDel);
  const styleQuery = style ? encodeURIComponent(style.replace(/\.$/,"").trim() + " graphic design style") : null;
  return {
    deliverableUrl:`https://www.google.com/search?q=${delQuery}&tbm=isch`,
    styleUrl: styleQuery ? `https://www.google.com/search?q=${styleQuery}&tbm=isch` : null,
  };
}
function buildKeywords(deliverable, style) {
  const stop=new Set(["design","create","for","the","and","with","that","this","from","into","their","your","about","called","using","only","should","feel","like","make","brand","graphic"]);
  const raw = deliverable || "";
  const words = raw.toLowerCase().replace(/[^a-z0-9\s]/g,"").split(" ").filter(w=>w.length>3&&!stop.has(w));
  const styleWords = style ? style.toLowerCase().replace(/[^a-z0-9\s]/g,"").split(" ").filter(w=>w.length>3&&!stop.has(w)) : [];
  return [...new Set([...words,...styleWords])].slice(0,6);
}

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:768);
  useEffect(()=>{const fn=()=>setW(window.innerWidth);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
  return w;
}
function getMaxWidth(w) {
  if (w>=1600) return {mw:1060,px:"100px"};
  if (w>=1280) return {mw:920,px:"72px"};
  if (w>=1024) return {mw:800,px:"56px"};
  if (w>=768)  return {mw:700,px:"40px"};
  return              {mw:600,px:"clamp(20px,5vw,28px)"};
}

// ─── BOTTOM SHEET ─────────────────────────────────────────────────────────────
function BottomSheet({onClose,children}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:9000,display:"flex",alignItems:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(8px)"}}/>
      <div style={{position:"relative",width:"100%",maxHeight:"85vh",overflowY:"auto",background:T.sheetBg,border:`1px solid ${T.sheetBorder}`,borderRadius:"18px 18px 0 0",padding:"18px 22px 44px",animation:"slideUp .3s cubic-bezier(.23,1,.32,1) both",boxShadow:"0 -12px 48px rgba(0,0,0,0.3)"}}>
        <div style={{width:32,height:3,borderRadius:2,background:"rgba(255,255,255,0.15)",margin:"0 auto 18px"}}/>
        {children}
      </div>
    </div>
  );
}

// ─── HOW IT WORKS POPUP ───────────────────────────────────────────────────────
function HowItWorksPopup({onClose}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(10px)"}}/>
      <div style={{position:"relative",maxWidth:420,width:"100%",background:T.sheetBg,border:`1px solid ${T.sheetBorder}`,borderRadius:16,padding:"32px 28px",boxShadow:"0 24px 80px rgba(0,0,0,0.4)",animation:"fadeUp .3s cubic-bezier(.23,1,.32,1) both"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"none",border:"none",cursor:"pointer",fontFamily:T.fontDisplay,fontSize:12,color:T.textMuted,padding:6}}>✕</button>
        <div style={{fontFamily:T.fontDisplay,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:T.accent,marginBottom:16,opacity:0.85}}>What is this?</div>
        <p style={{fontFamily:T.fontBody,fontSize:18,lineHeight:1.7,color:T.textPrimary,marginBottom:12}}>Crucible is a place to practice your craft. You don't pick what to design — you just design.</p>
        <p style={{fontFamily:T.fontBody,fontStyle:"italic",fontSize:15,lineHeight:1.7,color:T.textSecondary}}>Choose a discipline, set your prompt freedom, hit generate, and get to work.</p>
      </div>
    </div>
  );
}

// ─── HEROICONS (inline SVG) ───────────────────────────────────────────────────
const IconSearch = ()=>(
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={18} height={18}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z"/>
  </svg>
);
const IconSwatch = ()=>(
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={18} height={18}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"/>
  </svg>
);
const IconExternal = ()=>(
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={14} height={14}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
  </svg>
);

// ─── CONTEXT POPUP ────────────────────────────────────────────────────────────
function ContextSheet({deliverable,style,onClose}) {
  const {deliverableUrl,styleUrl}=buildContextLinks(deliverable,style);
  const keywords=buildKeywords(deliverable,style);
  return (
    <div style={{position:"fixed",inset:0,zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(10px)"}}/>
      <div style={{position:"relative",maxWidth:420,width:"100%",background:T.sheetBg,border:`1px solid ${T.sheetBorder}`,borderRadius:16,padding:"32px 28px",boxShadow:"0 24px 80px rgba(0,0,0,0.4)",animation:"fadeUp .3s cubic-bezier(.23,1,.32,1) both"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"none",border:"none",cursor:"pointer",fontFamily:T.fontDisplay,fontSize:12,color:T.textMuted,padding:6}}>✕</button>
        <div style={{fontFamily:T.fontDisplay,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:T.accent,marginBottom:20,opacity:0.85}}>More Context</div>

        <div style={{marginBottom:12}}>
          <div style={{fontFamily:T.fontDisplay,fontSize:9,color:T.textMuted,letterSpacing:2.5,textTransform:"uppercase",marginBottom:8}}>Deliverable Reference</div>
          <a href={deliverableUrl} target="_blank" rel="noopener noreferrer"
            style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:T.radius,border:`1px solid ${T.surfaceBorder}`,background:T.surfaceBg,textDecoration:"none",transition:"border .2s",color:"inherit"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.activeBorder}
            onMouseLeave={e=>e.currentTarget.style.borderColor=T.surfaceBorder}>
            <span style={{color:T.accent,flexShrink:0,display:"flex"}}><IconSearch/></span>
            <div>
              <div style={{fontFamily:T.fontDisplay,fontSize:12,fontWeight:700,color:T.accent,marginBottom:2}}>Search Google Images</div>
              <div style={{fontFamily:T.fontDisplay,fontSize:10,color:T.textMuted}}>Reference images for this deliverable</div>
            </div>
            <span style={{marginLeft:"auto",color:T.textMuted,flexShrink:0,display:"flex"}}><IconExternal/></span>
          </a>
        </div>

        {styleUrl&&(
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:T.fontDisplay,fontSize:9,color:T.textMuted,letterSpacing:2.5,textTransform:"uppercase",marginBottom:8}}>Style Reference</div>
            <a href={styleUrl} target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:T.radius,border:`1px solid ${T.surfaceBorder}`,background:T.surfaceBg,textDecoration:"none",transition:"border .2s",color:"inherit"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.activeBorder}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.surfaceBorder}>
              <span style={{color:T.accent,flexShrink:0,display:"flex"}}><IconSwatch/></span>
              <div>
                <div style={{fontFamily:T.fontDisplay,fontSize:12,fontWeight:700,color:T.accent,marginBottom:2}}>Search Google Images</div>
                <div style={{fontFamily:T.fontDisplay,fontSize:10,color:T.textMuted}}>Style and mood references</div>
              </div>
              <span style={{marginLeft:"auto",color:T.textMuted,flexShrink:0,display:"flex"}}><IconExternal/></span>
            </a>
          </div>
        )}

        {keywords.length>0&&(
          <div style={{marginTop:styleUrl?0:8}}>
            <div style={{fontFamily:T.fontDisplay,fontSize:9,color:T.textMuted,letterSpacing:2.5,textTransform:"uppercase",marginBottom:10}}>Or search these terms</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {keywords.map((kw,i)=>(
                <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(kw+" design")}&tbm=isch`} target="_blank" rel="noopener noreferrer"
                  style={{padding:"6px 13px",borderRadius:100,border:`1px solid ${T.surfaceBorder}`,background:T.surfaceBg,fontFamily:T.fontDisplay,fontSize:11,color:T.textPrimary,textDecoration:"none",transition:"all .18s"}}
                  onMouseEnter={e=>{e.currentTarget.style.color=T.accent;e.currentTarget.style.borderColor=T.activeBorder;}}
                  onMouseLeave={e=>{e.currentTarget.style.color=T.textPrimary;e.currentTarget.style.borderColor=T.surfaceBorder;}}>
                  {kw}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── WEIRD PANEL ─────────────────────────────────────────────────────────────
function WeirdPanel({brand,style}) {
  return (
    <div style={{marginTop:10,borderRadius:T.radius,padding:"13px 17px",background:T.weirdBg,border:`1px solid ${T.weirdBorder}`,animation:"fadeUp .4s both"}}>
      <div style={{fontFamily:T.fontDisplay,fontSize:9,letterSpacing:3,textTransform:"uppercase",color:T.weirdAccent,marginBottom:4,opacity:0.85}}>Make it Weird</div>
      <div style={{fontFamily:T.fontDisplay,fontSize:13,fontWeight:700,color:T.textPrimary}}>{brand} <span style={{color:T.weirdAccent,opacity:0.7}}>×</span> {style.label}</div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [discipline,setDiscipline]=useState(null);
  const [tier,setTier]=useState("framed");
  const [boxState,setBoxState]=useState("idle");
  const [prompt,setPrompt]=useState(null);
  const [revealPhase,setRevealPhase]=useState(0);
  const [weirdBrand,setWeirdBrand]=useState(null);
  const [weirdStyle,setWeirdStyle]=useState(null);
  const [deliverable,setDeliverable]=useState(null);
  const [style,setStyle]=useState(null);
  const [showContext,setShowContext]=useState(false);
  const [showHow,setShowHow]=useState(false);
  const [accepted,setAccepted]=useState(false);
  const [mouse,setMouse]=useState({x:0.5,y:0.3});

  const vw=useWindowWidth();
  const {mw,px}=getMaxWidth(vw);

  // Set body background once
  useEffect(()=>{
    document.documentElement.style.background=T.pageBg;
    document.body.style.background=T.pageBg;
    document.body.style.margin="0";
    document.body.style.padding="0";
  },[]);

  const onMouseMove=useCallback(e=>setMouse({x:e.clientX/window.innerWidth,y:e.clientY/window.innerHeight}),[]);
  useEffect(()=>{window.addEventListener("mousemove",onMouseMove);return()=>window.removeEventListener("mousemove",onMouseMove);},[onMouseMove]);

  useEffect(()=>{
    if(boxState!=="revealed"){setRevealPhase(0);return;}
    const t1=setTimeout(()=>setRevealPhase(1),80);
    const t2=setTimeout(()=>setRevealPhase(2),460);
    const t3=setTimeout(()=>setRevealPhase(3),840);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[boxState]);

  const generate=()=>{
    if(!discipline||boxState==="loading") return;
    const r=buildPrompt(discipline,tier);
    setWeirdBrand(r.weirdBrand);
    setWeirdStyle(r.weirdStyle);
    setDeliverable(r.deliverable);
    setStyle(r.style);
    setBoxState("loading");
    setPrompt(null);
    setAccepted(false);
    setShowContext(false);
    setTimeout(()=>{setPrompt(r.prompt);setBoxState("revealed");},500);
  };
  const reset=()=>{setPrompt(null);setBoxState("idle");setWeirdBrand(null);setWeirdStyle(null);setDeliverable(null);setStyle(null);setAccepted(false);setShowContext(false);};

  const isLoading=boxState==="loading";
  const isRevealed=boxState==="revealed";
  const isWeird=tier==="weird";

  const briefBg=isRevealed?(accepted?T.acceptedBg:T.revealBg):T.surfaceBg;
  const briefBorder=isRevealed?(accepted?`1px solid ${T.acceptedBorder}`:`1px solid ${T.revealBorder}`):`1px solid ${T.surfaceBorder}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Crimson+Pro:ital,wght@0,400;1,300;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{overscroll-behavior:none;min-height:100vh;background:${T.pageBg}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes breathe{0%,100%{opacity:.4}50%{opacity:.9}}
        @keyframes orbPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.1);opacity:1}}
        @keyframes shimmerLine{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:scaleX(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .f1{animation:fadeUp .5s .04s both}
        .f2{animation:fadeUp .5s .10s both}
        .f3{animation:fadeUp .5s .16s both}
        .f4{animation:fadeUp .5s .22s both}
        .f5{animation:fadeUp .5s .28s both}
        .f6{animation:fadeUp .5s .34s both}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(167,139,250,0.2);border-radius:3px}
      `}</style>

      {/* Page */}
      <div style={{minHeight:"100vh",width:"100%",background:T.pageBg,position:"relative"}}>

        {/* Dot grid */}
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:"radial-gradient(circle,rgba(167,139,250,0.12) 1px,transparent 1px)",backgroundSize:"32px 32px",opacity:0.6}}/>

        {/* Mouse-tracked orb */}
        <div style={{position:"fixed",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,0.07),transparent 70%)",left:`${mouse.x*100-30}%`,top:`${mouse.y*100-30}%`,transform:"translate(-50%,-50%)",transition:"left 1.2s ease,top 1.2s ease",pointerEvents:"none",zIndex:0,animation:"breathe 6s ease-in-out infinite"}}/>
        <div style={{position:"fixed",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(120,200,255,0.04),transparent 70%)",right:"10%",bottom:"20%",pointerEvents:"none",zIndex:0,animation:"breathe 9s ease-in-out infinite reverse"}}/>

        {/* Content */}
        <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:mw,margin:"0 auto",padding:`clamp(48px,7vw,72px) ${px} 120px`,boxSizing:"border-box"}}>

          {/* NAV */}
          <div className="f1" style={{marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingBottom:14,borderBottom:`1px solid ${T.navBorder}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade80"}}/>
                <span style={{fontFamily:T.fontDisplay,fontSize:12,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:T.textSecondary}}>{APP_NAME}</span>
              </div>
              <button onClick={()=>setShowHow(true)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:T.fontBody,fontStyle:"italic",fontSize:13,color:T.textMuted,padding:0,transition:"color .2s",letterSpacing:0.3}}
                onMouseEnter={e=>e.currentTarget.style.color=T.textPrimary}
                onMouseLeave={e=>e.currentTarget.style.color=T.textMuted}>
                How does this work?
              </button>
            </div>
          </div>

          {/* HEADLINE */}
          <div className="f2" style={{marginBottom:28}}>
            <h1 style={{fontFamily:T.fontDisplay,fontWeight:800,fontSize:"clamp(42px,9vw,72px)",lineHeight:0.95,letterSpacing:-2,marginBottom:12}}>
              <span style={{color:T.textPrimary}}>We Choose.</span><br/>
              <span style={{background:T.gradient,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>You Create.</span>
            </h1>
            <p style={{fontFamily:T.fontBody,fontStyle:"italic",fontSize:15,color:T.textSecondary,lineHeight:1.65}}>Pick your discipline. The rest is fate.</p>
          </div>

          {/* DISCIPLINES */}
          <div className="f3" style={{marginBottom:14}}>
            <div style={{fontFamily:T.fontDisplay,fontSize:9,color:T.textGhost,letterSpacing:3,textTransform:"uppercase",marginBottom:11}}>Select Discipline</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
              {DISCIPLINES.map(d=>{
                const sel=discipline===d.id;
                return(
                  <button key={d.id} onClick={()=>{setDiscipline(d.id);reset();}} style={{padding:"12px 14px",textAlign:"left",cursor:"pointer",transition:"all .18s",display:"flex",alignItems:"center",gap:9,border:sel?`1px solid ${T.activeBorder}`:`1px solid ${T.surfaceBorder}`,background:sel?T.activeBg:T.surfaceBg,borderRadius:T.radius,transform:sel?"translateY(-1px)":"none",boxShadow:sel?`0 4px 20px ${T.activeBg}`:"none"}}>
                    <span style={{fontSize:14,opacity:sel?1:.25}}>{d.icon}</span>
                    <span style={{fontFamily:T.fontDisplay,fontSize:13,fontWeight:sel?700:400,color:sel?T.textPrimary:T.textMuted}}>{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PROMPT FREEDOM */}
          <div className="f4" style={{marginBottom:14}}>
            <div style={{fontFamily:T.fontDisplay,fontSize:9,color:T.textGhost,letterSpacing:3,textTransform:"uppercase",marginBottom:11}}>Prompt Freedom</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:6}}>
              {TIERS.map(t=>{
                const active=tier===t.id;
                return(
                  <button key={t.id} onClick={()=>setTier(t.id)} style={{padding:"10px 9px",textAlign:"left",cursor:"pointer",transition:"all .15s",border:active?`1px solid ${T.activeBorder}`:`1px solid ${T.surfaceBorder}`,background:active?T.activeBg:T.surfaceBg,borderRadius:T.tierRadius}}>
                    <div style={{fontFamily:T.fontDisplay,fontSize:11,fontWeight:700,color:active?T.textPrimary:T.textMuted,marginBottom:3}}>{t.label}</div>
                    <div style={{fontFamily:T.fontDisplay,fontSize:9,color:T.textGhost,lineHeight:1.4}}>{t.sub}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={()=>setTier("weird")} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",width:"100%",cursor:"pointer",transition:"all .18s",border:tier==="weird"?`1px solid ${T.weirdBorder}`:`1px solid ${T.surfaceBorder}`,background:tier==="weird"?T.weirdBg:T.surfaceBg,borderRadius:T.tierRadius}}>
              <div style={{width:15,height:15,border:tier==="weird"?`1.5px solid ${T.weirdAccent}`:`1.5px solid ${T.textMuted}`,borderRadius:3,background:tier==="weird"?`${T.weirdAccent}22`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {tier==="weird"&&<span style={{fontSize:9,color:T.weirdAccent,lineHeight:1}}>✓</span>}
              </div>
              <div style={{textAlign:"left"}}>
                <div style={{fontFamily:T.fontDisplay,fontSize:11,fontWeight:700,color:tier==="weird"?T.weirdAccent:T.textMuted}}>Make it Weird</div>
                <div style={{fontFamily:T.fontDisplay,fontSize:9,color:T.textGhost}}>Named brand + unexpected style clash</div>
              </div>
            </button>
          </div>

          {/* GENERATE */}
          <div className="f5" style={{marginBottom:12}}>
            <button onClick={generate} disabled={!discipline||isLoading} style={{width:"100%",padding:"16px 0",border:!discipline||isLoading?`1px solid ${T.surfaceBorder}`:`1px solid ${T.accentBorder}`,borderRadius:T.radius,background:!discipline||isLoading?"transparent":T.genBtnBg,color:!discipline?T.textDisabled:isLoading?T.textMuted:T.textPrimary,fontFamily:T.fontDisplay,fontSize:13,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",cursor:!discipline||isLoading?"not-allowed":"pointer",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              {isLoading?<><span style={{width:12,height:12,border:`2px solid ${T.surfaceBorder}`,borderTopColor:T.accent,borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>Creating side quest...</>:"Generate →"}
            </button>
          </div>

          {/* BRIEF BOX */}
          <div className="f6">
            <div style={{borderRadius:T.radius,padding:"clamp(22px,5vw,34px) clamp(16px,5vw,26px)",minHeight:190,display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",overflow:"hidden",border:briefBorder,background:briefBg,backdropFilter:"blur(20px)",transition:"border .8s,background .8s"}}>
              {isRevealed&&<div style={{position:"absolute",top:0,left:0,right:0,height:1,background:T.shimmer,animation:"shimmerLine 1.2s ease both",transformOrigin:"left"}}/>}

              {boxState==="idle"&&<div style={{textAlign:"center",fontFamily:T.fontBody,fontStyle:"italic",fontSize:17,color:"rgba(167,139,250,0.45)",letterSpacing:1,animation:"breathe 5s ease-in-out infinite"}}>Your Fate Awaits</div>}

              {isLoading&&<div style={{textAlign:"center"}}>
                <div style={{width:46,height:46,borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,0.1),transparent 70%)",margin:"0 auto 14px",animation:"orbPulse 1.4s ease-in-out infinite"}}/>
                <div style={{fontFamily:T.fontDisplay,fontSize:10,color:T.textGhost,letterSpacing:3,textTransform:"uppercase",animation:"breathe 1.4s ease-in-out infinite"}}>Creating side quest...</div>
              </div>}

              {isRevealed&&prompt&&<div>
                <div style={{fontFamily:T.fontDisplay,fontSize:10,color:accepted?T.green:isWeird?T.weirdAccent:T.accent,letterSpacing:3,textTransform:"uppercase",marginBottom:13,opacity:revealPhase>=2?1:0,transform:revealPhase>=2?"translateY(0)":"translateY(5px)",transition:"opacity .6s,transform .6s"}}>
                  {accepted?"Project Accepted ✓":"Your side quest is..."}
                </div>
                <p style={{fontFamily:T.fontBody,fontSize:20,lineHeight:1.65,color:T.textPrimary,fontWeight:400,letterSpacing:.2,opacity:revealPhase>=3?1:0,filter:revealPhase>=3?"blur(0)":"blur(8px)",transform:revealPhase>=3?"translateY(0) scale(1)":"translateY(5px) scale(.99)",transition:"opacity 1.1s cubic-bezier(.23,1,.32,1),filter 1.1s cubic-bezier(.23,1,.32,1),transform 1.1s cubic-bezier(.23,1,.32,1)"}}>
                  {prompt}
                </p>
              </div>}
            </div>

            {isRevealed&&isWeird&&weirdBrand&&weirdStyle&&<WeirdPanel brand={weirdBrand} style={weirdStyle}/>}

            {isRevealed&&!accepted&&<>
              <div style={{display:"flex",gap:9,marginTop:10}}>
                <button onClick={()=>setAccepted(true)} style={{flex:1,padding:"13px 0",border:`1px solid ${T.greenBorder}`,background:T.greenBg,color:T.green,fontFamily:T.fontDisplay,fontSize:12,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",cursor:"pointer",transition:"all .2s",borderRadius:T.radius}}>Accept Project</button>
                <button onClick={generate} style={{padding:"13px 18px",border:`1px solid ${T.surfaceBorder}`,background:T.surfaceBg,color:T.textMuted,fontFamily:T.fontDisplay,fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",transition:"all .2s",borderRadius:T.radius}}>↺ Reroll</button>
              </div>
              <div style={{textAlign:"center",marginTop:12}}>
                <button onClick={()=>setShowContext(true)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:T.fontBody,fontStyle:"italic",fontSize:13,color:T.textGhost,letterSpacing:.3,padding:"3px 7px",transition:"color .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.color=T.textMuted}
                  onMouseLeave={e=>e.currentTarget.style.color=T.textGhost}>
                  Need more context?
                </button>
              </div>
            </>}

            {isRevealed&&accepted&&<div style={{marginTop:10}}>
              <button onClick={generate} style={{width:"100%",padding:"13px 0",border:`1px solid ${T.surfaceBorder}`,background:T.surfaceBg,color:T.textMuted,fontFamily:T.fontDisplay,fontSize:12,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",cursor:"pointer",transition:"all .2s",borderRadius:T.radius}}>New Quest →</button>
            </div>}

            {discipline&&<div style={{textAlign:"center",marginTop:16}}>
              <button onClick={()=>{setDiscipline(null);reset();}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:T.fontBody,fontStyle:"normal",fontSize:12,color:T.textGhost,letterSpacing:2,padding:"7px 14px",transition:"color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.color=T.textMuted}
                onMouseLeave={e=>e.currentTarget.style.color=T.textGhost}>
                ↩ Start Over
              </button>
            </div>}
          </div>

        </div>

        {/* Bottom fade */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,height:60,background:`linear-gradient(transparent,${T.pageBg})`,pointerEvents:"none",zIndex:2}}/>

      </div>

      {showHow&&<HowItWorksPopup onClose={()=>setShowHow(false)}/>}
      {showContext&&prompt&&<ContextSheet deliverable={deliverable} style={style} onClose={()=>setShowContext(false)}/>}
    </>
  );
}
