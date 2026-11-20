# FougitoDeliver: Fougito restyle + tablet layouts

Paste everything below the line into Claude Code, run from the root of `FougitoDeliver/` with `deliver_app_handoff/` next to or inside the repo.

---

Restyle the existing React Native app to the Fougito theme (same system as FougitoReelMeal) and add tablet portrait and landscape layouts. Spec: `deliver_app_handoff/README.md`. Visual reference: `deliver_app_handoff/design/Deliver Redesign - All Devices.dc.html` (rows 01–16 = screens; columns = tablet landscape 1280×800, tablet portrait 800×1280, phone 360×800).

## Hard rules
1. The only approved logic change: Splash drops the video and navigates via a 2500 ms timer (README §01). Otherwise don't change navigation, route names, params, API/Redux/Firebase/notifee logic, Geolocation intervals, biometrics, RefreshToken, the hidden LIVE/DEMO toggle, or any handler and its conditions.
2. Keep every `HardCode` string and every element. Layout and visuals only.
3. Accent #F05152 (replaces #E14E4E). Radius 0. Remove `shadow*`/`elevation`. Rules: 1px #D9D7D7; 2px #181717 under headers/section titles and above bottom bars.
4. Button labels flush left, icon on the right.
5. One file at a time. If a change needs a logic edit, skip it and list it at the end.

## Steps
1. **Tokens.** Copy `ui-kit/tokens.js` to `Constants/tokens.js`. In `Constants/Color.js` keep every key, remap values: bgColor/screenBackgroundColorOtherPlace/authGray → #F4F4F4; black/normaltextColor/headingnormaltextColor/paranormaltextColor → #181717; every #E14E4E → #F05152; lightGray → #D9D7D7; gray/placeholderTextColor → #6E6B70 / #9A979C; inputBg → #FFFFFF; paraotptextColor → #474449.
2. **Fonts.** Satoshi is wired. Black = titles, order numbers, totals; Bold = labels/buttons; Medium = body.
3. **Layout hook.** `Components/useLayout.js` → `'phone' | 'tabletPortrait' | 'tabletLandscape'` (tablet = shortest side ≥ 600). Unlock tablet rotation. Use fixed dp on tablets instead of `scalableheight`.
4. **Shared components** (keep props): MainHeader, BackHeader, DateBackHeader, TransparentHeader, AuthButton, NumberInput, MyFormInputTile, Heading/SubHeading/Paragraph (fonts only), ActiveRequestTile, OrderDeatilTile, PopUpModel, ErrorPopUpModel, SuccessModal(Popup), Pickpop, Reasonpopup, SelfAssignpopup, Qrpopup, NotificationAlert, Toast, MenuListTile.
5. **New components:** `AuthBrandPane` (red field + line-art 16% + white logo + white bar + "Deliver") and `BottomBar` (white, 2px ink top rule).
6. **Screens, in order:** Splash, Login, Home, drawer (MainNavigation › CustomDrawerStyle), Qrpopup, NewOrders, OrderDetail (+ its modals), PayToComplete, success modals, DeliveredOrders, MyNotification, SettingScreen, Accountinfo, ChangePassword, ContactUsScreen, InterentConnection. Follow the README per screen; match the board per device.
7. **Landscape specifics:** Login split pane; Home/New Orders/My Deliveries 3-column grid; OrderDetail items+bill left, 440 action panel right; PayToComplete 480 total panel left; Customer Info two-column dialog.

## Gates
- `grep -rn "borderRadius\|elevation\|shadowOpacity" Components Screens Navigaor` → only 0 values or none.
- No #E14E4E left; no new hex values outside `tokens.js`/`Color.js`.
- Same elements on phone as before. Rotate a tablet emulator on every screen: nothing clips, no button off-screen.
- End to end on all three devices: login (password + fingerprint) → new order notification → order detail → Pickup Order → Receive Payment (cash and card) → Delivered → My Deliveries. QR self-assign and Cancel with reason still work.
