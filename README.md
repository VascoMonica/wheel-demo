# Reinventing the Wheel

Interactive demo accompanying **Reinventing the Wheel**. Move four weights to maximize the wheel's average speed down a ramp.

## Run the demo

Open `index.html` in a current browser, keeping the `assets` folder beside it. The same files can be hosted on GitHub Pages. There is no build step, package installation, Python server or oTree session to start.

Drag the dark weights along the four striped arms. The configuration order is **North, East, South, West**. Positions run from 1, nearest the centre, to 12, farthest out. The initial configuration is `(5, 5, 5, 5)`, as specified in the supplied oTree project.

Click **Release the Wheel**, confirm, and watch the wheel descend. Select **Continue to the next round** for another attempt. There is no round limit. Previous rounds can be inspected and reused. The exact-position controls provide a keyboard alternative to dragging.

**Animation speed** changes playback only. The default uses the original rate of 83.3 simulation samples per second. Use 8× for a quick preview. Scores are independent of playback speed, display size and the device's refresh rate.

## Files

| File or folder | Purpose |
| --- | --- |
| `index.html` | Entry page. Keep this exact lowercase name. |
| `assets/` | Original wheel graphics, bundled PixiJS, browser physics, score table, styling and controls. Upload the whole folder. |
| `PUBLICACION.md` | Step-by-step publication instructions in Spanish. |
| `VALIDATION.md` | Numerical and interaction checks, with their limits. |
| `THIRD_PARTY_NOTICES.txt` | Notice for the bundled visualization library. |

## Fidelity to the supplied program

The wheel, arms, weights and ramp use the provided drawing classes and PixiJS 6.5.8. The visible drawing coordinates and colours are preserved. The unused, permanently hidden text-input component was removed. Paths to optional arrow images were made relative so that project-level GitHub Pages URLs work.

The ODE in the supplied `engine.py` is implemented in `assets/physics.js`, using the original constants and sample grid. The browser uses fourth-order Runge–Kutta with four substeps per original sample. This is a numerical port, not a byte-for-byte reproduction of SciPy's `odeint`.

The 20,736 scores are copied losslessly from the earlier demo's embedded original lookup table. They determine the displayed average speed and the successful run's finish frame. No score is estimated from browser animation timing. All successful crossing frames and all failed outcomes were also independently matched by the browser integrator; see `VALIDATION.md`.

The free demo keeps the original confirmation and result-screen pattern. Paid rounds, cash earnings, participant sessions and predecessor treatments are replaced by unlimited exploration and a session best. Trials are kept only in page memory; reloading starts a new session.

The original interface checks for a stalled wheel after sample 650. This adaptation ends every zero-score attempt at sample 651, including configurations that become stranded partway down the ramp. This prevents an unsuccessful run from waiting indefinitely. Such a wheel can wobble, reverse or move a short distance before receiving zero.

## Physics parameters

| Parameter | Value |
| --- | --- |
| Rolling-axis radius | 0.0065 m |
| Ramp angle | 14 degrees |
| Bare-wheel mass | 1.65 kg |
| Mass of each movable weight | 0.095 kg |
| Bare-wheel inertia | 0.017 kg m² |
| Resistance parameter | 0.00366 |
| Gravity | 9.81 m/s² |
| First weight position | 0.04 m from axis |
| Spacing between positions | 0.028 m |
| Ramp length used for scoring | 0.92 m |
| Simulation grid | 3,800 samples from 0 to 38 s, inclusive |
| Scoring/playback baseline | 83.3 samples/s |

For radii `r1, r2, r3, r4` in N/E/S/W order, the original coefficients are:

`K = J/m + r1² + r2² + r3² + r4²`

`A = (r1-r3)g/K`, `B = (r2-r4)g/K`, `C = r0 sin(alpha)(4+M/m)g/K`, `D = k/K`.

The differential equation is `theta'' = A sin(theta) + B cos(theta) + C - D theta' |theta'|`, starting from rest. As in the original, the finish test rounds covered distance to two decimal places before comparing it with 0.92 m.

## Publish or update

Follow `PUBLICACION.md`. The website source is the repository root on `main`. Place `index.html` and `assets` alongside one another at that root. Future updates can replace these files while keeping the same repository and public URL.

This package contains only the standalone demonstration and its documentation. It does not include the oTree server settings.
