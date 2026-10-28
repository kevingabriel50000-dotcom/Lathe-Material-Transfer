# Lathe Material Transfer v1.2

Portable, English-language main/sub spindle transfer visualizer. Open `index.html` in Edge, Chrome or Firefox, or use the GitHub Pages deployment. No build step, dependencies or Internet connection are required for the downloaded file.

## Setup

Enter the **chuck face-to-face distance with the sub at its machine return position**, excluding jaws. This distance establishes a fixed view scale; changing transfer planes does not rescale the machine or move the fixed G54 origin. The sub chuck moves during the transfer, so instantaneous chuck separation changes.

Main jaw length defaults to **1.5 in**, sub jaw length to **1.0 in**, both editable. Chuck distance defaults to **600 mm (600/25.4 = 23.622047244… in)**, supplied by the user for the Lynx 2100LSY, not independently verified against manufacturer documentation. The application retains the conversion precision. Existing saved nonempty geometry is preserved; a previously blank browser distance is filled with this default. Do not substitute between-centers distance, turning length or axis travel for chuck-face distance.

A new browser starts with zero transfer inputs and prompts for setup. The last inputs are automatically restored in that browser when local storage is available. **New case** resets transfer inputs while preserving machine geometry. JSON case files provide explicit backups and transfers between computers. v1.0 case imports remain supported; v1.0 files without machine geometry use the current defaults.

## Linked values

There is one transfer, with two editable representations:

- **Actual grip + Actual Protrusion** calculate **Grab Plane + Return Plane**.
- Editing either plane recalculates actual grip and actual protrusion.
- Shared setup changes preserve whichever pair was edited last, identified below the fields.
- Calculated Return Plane zero remains zero; no postprocessor-specific correction is applied.

**Stick Out/protruding** is the initial stock-front distance from the main jaw face. **Front stock** is the frontal allowance removed before grab. Selecting Model front resets Front stock to zero; the user can then override it. G54 is fixed during motion, and B0 aligns the sub jaw face with G54 Z0. Positive physical and B movement is to the right.

Example: Stick Out 2, Front stock 0.025, Grab Plane -1, Return Plane 0.0001 gives actual grip 0.975, pull travel 1.0001 and final finished face 2.9751 in.

## Animation and scope

The sub approaches from its configured return position with smooth acceleration/deceleration before clamping. Stage controls, pull slider and a main-spindle zoom control allow inspection. The static machine scale includes real axial jaw lengths. Basic checks reject overlap with the main jaw plane, insertion more than 4.5 inches behind the sub chuck face and motion outside the configured return-position envelope. These schematic checks do not validate a machine program or actual collision clearances.

After the main clamps, the sub opens and returns home without material; the bar remains at its final protrusion. Return with material is disabled pending cut-off modeling. Cut-off geometry and G55 remain unimplemented. No G-code import, CNC output or synchronization validation is provided.

## Validation

`node tests/calculations.cjs` checks calculation examples, both-direction equivalence and geometry constraints. For browser regression checks, with Playwright available, start `python3 -m http.server 8765 --bind 127.0.0.1` and run `node tests/browser.cjs`. Optionally set `CHROMIUM_PATH` to a browser executable or `APP_URL` to a different local test server. The 20-inch distance in that test is synthetic, not a Lynx specification. No application build is needed.
