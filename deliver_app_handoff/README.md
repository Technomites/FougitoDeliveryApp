# Handoff: FougitoDeliver — Fougito restyle, phone + tablet (portrait & landscape)

## Overview
FougitoDeliver is the rider app (React Native 0.77). Flow: Splash (video) → MiddleWare → Login → Home (drawer) → New Orders / Order Detail → Pickup → Payment Screen → Delivered. Plus My Deliveries, Notifications, Settings, Account Info, Change Password, Contact Us, Scan QR and Offline.
This redesign moves it onto the same Fougito theme as Reel Meal: red field + white line-art for brand moments, ink rules, zero radius.

## Design file
`design/Deliver Redesign - All Devices.dc.html` — HTML reference, not production code. Rows 01–16 = screens; columns = tablet landscape 1280×800, tablet portrait 800×1280, phone 360×800 (dp). Rebuild inside the existing codebase with its components, Redux and navigation.

## Fidelity
High-fidelity. Hatched blocks are placeholders (camera preview, profile photo). Sample names/orders are illustrative — real data comes from the API.

## Hard rules
1. Visual and layout only. Don't touch navigation, routes, params, API calls, Redux, Firebase messaging, notifee, Geolocation/rider-coordinate interval, RefreshToken, biometrics or the hidden 10-tap LIVE/DEMO toggle.
2. Keep every `HardCode` string exactly (casing included).
3. Keep every element and its conditions (status colours, HotelRoom row, See More, Get Direction vs View Info by status, Pickpop/Reasonpopup/SelfAssignpopup, NotificationAlert sound).
4. Accent #F05152 replaces #E14E4E everywhere (`Color.btnBgColor`, `iconColor`, `headingColor`, `loaderColor`, `modalColor`, `paraColor`).
5. Radius 0. No shadows/elevation. Rules instead.

## Tokens (`ui-kit/tokens.js`)
ink #181717 · accent #F05152 · accentDeep #DF3A3B (red text on light) · ground #F4F4F4 · surface #FFFFFF · rule #D9D7D7 · body #474449 · muted #6E6B70 · placeholder #9A979C · disabled #EDECEC · pink #FDECEC (icon tiles, count chips) · green #3F7A22 (Ready for Pickup, Delivered) · amberDeep #B85F14 (Preparing, Pending payment) · scrim rgba(24,23,23,.6).

**Type:** Satoshi (already in `Constants/fonts.js`). Black 900: titles, order numbers, totals, wordmark. Bold 700: labels, buttons. Medium 500: body. `fontVariant:['tabular-nums']` on amounts. Caps labels 11–13, letterSpacing 1.5.
**Spacing:** gutter 32 (L), 40 (P), 16 (M). Header 64 (72 with subtitle, and Home on tablets). Card gap 12, list gap 8.
**Controls:** primary button 56 (72 on Delivered). Label flush left, icon right. Icon buttons 44 squares, 1px rule. Inputs 56, white, 1px rule.
**Rules:** 2px ink under headers/section titles and above bottom bars; 1px rule around cards and between rows.

## Device detection
Tablet = shortest side ≥ 600dp. Add `useLayout()` → `'phone' | 'tabletPortrait' | 'tabletLandscape'`. `resposnevaraiable.js` scales by height and breaks in landscape — use fixed dp from this README on tablets. Unlock iPad rotation (`UISupportedInterfaceOrientations~ipad`) and any Android `screenOrientation` lock.

## Screens
**01 Splash** — keep it simple, like Reel Meal: a static screen, no video. Accent field, `lineart-tile-white.png` at 360 (240 phone), 16% opacity; white logo top-left, "DELIVER" caps top-right; headline "Picked up hot. Dropped off on time." Black 96/84/52, lineHeight .92, bottom-left. Remove the `<Video>` (`splashvideo2.mp4`) and call the existing `navigatetogettingstarted()` from a `setTimeout` of 2500 ms in a `useEffect` (clear it on unmount). Keep the NetInfo listener, `listeners()` and status bar (light-content) unchanged. This timer is the only approved logic change.
**02 Login** — new `AuthBrandPane` (red, line-art, white logo, 56×4 white bar, "Deliver" Black 112/112/44). L: pane 538 wide left, 2px ink right rule. P: 360 band. M: 152 band. Form max 480 (L) / 560 (P): 64 logo tile (keep the hidden 10-tap counter on it), "Login" 44 Black + 2px underline, Phone Number (flag · +971 · chevron opens CountryPicker), Password (eye cell), then Login button + 56 fingerprint square (existing `fingerprint()`).
**03 Home** — header: ink menu square, logo, flex, bell square with accent count badge. "Welcome **Name,**" Black 36/26 (name accentDeep) + tagline muted. Section head "New Orders (n)" + "View All ›". `ActiveRequestTile` grid 3 (L) / 2 (P) / 1 (M). The round QR FAB becomes a bottom bar button "Scan QR Code" (360 right-aligned on tablets, full width phone) — same `setshowqr` handler.
**ActiveRequestTile** — white, 1px rule. 48 pink bag tile; OrderNo 18 Black accentDeep; CustomerName 16; FormattedDate 14 muted; amount 18 Black top-right on landscape, and on its own line under the date (17 Black) on portrait and phone so names don't truncate. Optional room row (room-service icon). Bottom strip: "ORDER STATUS" caps + status (amber Preparing / green Ready for Pickup / accentDeep Picked Up; Delivered green / Canceled accentDeep in history) | 56 arrow cell.
**04 Drawer** — ink panel 360 (280 phone), line-art 7%, over 60% scrim. Replace the shrink/slide `animatedStyle` on Home with a plain slide (`drawerType="slide"` stays). 72 avatar square, name 22 Black, "Account Settings" underlined. Rows 64 with 40 icon tiles; active row 4px accent left border + accent tile. Logout = white 2px outline button at bottom; loader replaces it while logging out.
**05 Scan QR Code (Qrpopup)** — full-bleed camera, 55% ink scrim, header with white outline back. Frame 360/440/240 with 6px accent corners and accent scan line.
**06 New Orders** — header + pink count chip; same tile grid.
**07 Order Detail** — header: OrderNo + FormattedDate, status chip on tablets. Blocks: pickup card (pin tile, NameAsPerTradeLicense, Address, "Get Direction" outline button → same Linking call; for OnTheWay it shows CustomerName + View Info), info rows (Payment Method, Payment Status, Order Status), items table (QTY | ITEM | PRICE caps header over 2px rule; rows open the item modal), "See More", bill (Sub Total, Delivery Charges, VAT Amount, Discount, Coupon Discount, Total Amount 20 Black over 2px rule). Actions: Pickup Order / Receive Payment / Mark as Delivered (accent) + Cancel Order (2px ink outline) — same conditions. L: items+bill left, 440 white panel right (2px left rule) with pickup, info rows and stacked buttons. P/M: one column, buttons side by side in the bottom bar. P shows info as a 3-cell strip.
**08 Customer Info modal** — dialog 2px ink border: "Customer Info" + 44 ink close square; fields as caps label + value rows (Name, Contact no., Email, Address, Building and Street, Flat No & Floor, Note To Rider). L two columns 760 wide; P 600 centred; M bottom sheet. Footer: Close (outline) + Call (accent). Restyle Change Status / Assign Delivery / item modals the same way.
**09 Payment Screen (PayToComplete)** — L: 480 white left panel with "TOTAL" + amount 72 Black and the bill; right: Waiting For Payment card (56 outline square, clock/loader/check by state), "OR" divider, two option tiles (cash / card, pink icon tile, chevron). P: amount hero 64 then stacked. M: no hero (bill carries the total). Receive Amount modal = dialog pattern from 08.
**10 Delivered** — success modal becomes a full accent field with line-art: 72 white check square, "Your order has been delivered successfully" Black 88/80/44, 2px white rule, order line, white 72 "Return to home screen" button (L: 400 wide on the right, bottom-aligned).
**11 My Deliveries** — header with outline date chip (DateBackHeader picker), tile grid with Delivered/Canceled.
**12 Notifications** — rows: 44 icon tile (pink unseen / disabled seen), title Bold (Black if unseen), body muted, time right; unseen rows get a 4px accent left border.
**13 Settings** — "Welcome," muted + name 36/28 Black over 2px rule; 72 tiles (Account Info, Change Password): grid 3 / 2 / list.
**14 Account Info / Change Password** — photo square 200/128/96 with 44 accent camera square (image-crop-picker); fields 56; phone row disabled fill. Save in bottom bar. Change Password uses the same field + eye cell pattern.
**15 Contact Us** — "Get in touch with us" + text, then the three existing `ScreenData` rows as 72 tiles (pink icon tile, caps label, value): Contact no. (`Contact , Contact2`), Email, Address (`StreetAddress`). Values stay API-driven from `BusinessSetting/Master` — no hard-coded contact details; hide a tile while its value is empty. Then "Send us a Message" + text + 200 message field; Submit in the bottom bar. L: two columns.
**16 Offline (InterentConnection)** — ground, logo top-left; bottom-left 72 ink wifi-off square, "Offline" Black 96/88/56, 2px rule, two lines of copy.

## Button sizing (RN)
Full-width buttons inside vertical stacks (Get Direction, Return to home screen, the landscape Order Detail action panel, Logout) need a fixed `height` and `alignSelf:'stretch'`. Never use `flex:1` on them inside a column, or they collapse. Side-by-side bottom-bar buttons use `flex:1`. On phone, Cancel Order / Pickup Order use 15 text and 14 padding so both fit at 360dp.

## States
Pressed accent → accentDeep; outline/white → #EDECEC fill. Loaders: `ActivityIndicator` in accent. Disabled: 45% opacity. RefreshControl colours = accent. Toasts: ink bar, white text, no radius. Status bar: light-content on red/ink screens, dark elsewhere; Android nav bar white (ink when drawer open — keep existing calls).

## Assets
`design/fougito/logo.svg`, `logo_bw.svg`, `lineart-tile-white.png`, Satoshi fonts (already in `assets/fonts`). Copy the SVG/PNG into `assets/Images` (use react-native-svg or export PNG @2x/@3x). Retire `bglogin.jpg`, `Sidemenu.png` backgrounds.
