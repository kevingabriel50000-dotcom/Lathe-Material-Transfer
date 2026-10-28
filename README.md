# Lathe Material Transfer v1.4

Portable, English-language main/sub spindle transfer visualizer. Open `index.html` in Edge, Chrome or Firefox, or use the GitHub Pages deployment. No build step, dependencies or Internet connection are required for the downloaded file.

## Setup

Enter **Face-to-face chucks machine distance** in millimeters with the sub at its machine return position, excluding jaws. Transfer and jaw dimensions remain in inches; case files retain the internal inch distance for backward compatibility. This distance establishes a fixed view scale; changing transfer planes does not rescale the machine or move the fixed G54 origin. The sub chuck moves during the transfer, so instantaneous chuck separation changes.

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

The sub approaches from its configured return position with smooth acceleration/deceleration before clamping. Zoom applies a uniform scale to both axes. Drag the diagram to pan horizontally or vertically. Mouse-wheel zoom is anchored at the cursor; the slider uses the last cursor location on the diagram (or the viewport center). Reset view restores the original camera. Plane strokes stay thin as zoom increases. Reset trajectory restarts time without changing inputs or the camera. Stage controls, pull slider and a main-spindle zoom control allow inspection. Playback can pause and continue at the same point, including during the 600 ms hold between stages. The sub jaw position label is measured from G54 B0; Model face remains a protrusion measured from the main jaw face. The static machine scale includes real axial jaw lengths. Basic checks reject overlap with the main jaw plane, insertion more than 4.5 inches behind the sub chuck face and motion outside the configured return-position envelope. These schematic checks do not validate a machine program or actual collision clearances.

After the main clamps, **Return without material** opens the sub jaws and returns home while the bar stays in place. **Return with material** performs cut-off, retracts the insert, and returns with the separated part held in the sub jaws. Cut-off Z defaults to G54 Z0 and bar diameter to 1 inch. The generic square insert defaults to editable width 0.118 inches, fixed corner radius 0.011 inches and fixed length 0.4 inches. A schematic 2-inch blade extends above the insert; its width is 80% of the insert width. The parked insert clears the chuck/jaw radial envelope. Its programmed point is the virtual lower-left corner; the insert extends toward positive Z. The radial feed reaches the spindle centerline plus corner-radius overtravel (theoretical point X = −2 × radius in diameter programming). The kerf is swept symmetrically as the bar rotates. The kerf occupies [cut Z, cut Z + width]. The cut-plane trace is visible only during the cutting descent and grows with the insert movement. Cut-off runs in 1.8 seconds, holds 0.1 seconds at center, then retracts in 0.9 seconds.

The displayed axial clearance checks the insert against the sub jaw face, not the holder or turret. Nonpositive insert clearance blocks playback. During transfer and return, Model face follows the material and detached part. Only once the sub reaches home, Model face resets to the next model face in the remaining main-spindle stock: G54 Z0 minus Front stock, independent of the cut plane, without changing the fixed G54 origin or the physical location of the detached part. The final sub-jaw-face to part-cut-face distance is Return Plane − Cut-off plane − insert width; it is independent of the configured machine-home separation. G55, G-code import, CNC output and synchronization validation remain unimplemented.

## Validation

`node tests/calculations.cjs` checks calculation examples, both-direction equivalence and geometry constraints. For browser regression checks, with Playwright available, start `python3 -m http.server 8765 --bind 127.0.0.1` and run `node tests/browser.cjs` and `node tests/view.cjs`. Optionally set `CHROMIUM_PATH` to a browser executable or `APP_URL` to a different local test server. The 20-inch distance in that test is synthetic, not a Lynx specification. No application build is needed.

## Base version

The Git tag `v1.3` preserves the approved base program. Future changes must not move or replace this tag.
