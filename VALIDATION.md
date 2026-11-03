# Validation

## Original score data

- Exact lookup values checked: **20,736 / 20,736**.
- Positive-speed configurations: **6,643**.
- Zero-score configurations: **14,093**.
- Original two-decimal display rounding checked for all **795** distinct scores.
- SHA-256 of the original little-endian float64 table: `fd205a18649aa67499a68eeb00f6d6c550b8b001dafa61e7b5de5e44ae972956`.

## Browser physics port

The equations and constants in the supplied `engine.py` were ported to JavaScript with four RK4 substeps per original sample. The same inclusive 3,800-sample grid over 38 seconds was used.

- Successful crossing frames matched: **6,643 / 6,643**.
- Failed outcomes matched across the full simulation horizon: **14,093 / 14,093**.
- Mismatching finish frames or outcomes: **0**.

An additional comparison with the original SciPy `odeint` trajectories covered **128 configurations** and **1,536 sample points**, including balanced, optimal, stalled and seeded random configurations.

- Maximum angular difference in that comparison: **9.079747451e-05 radians**.
- Maximum centre-position difference: **5.901835839e-05 cm**.
- That position difference at the original 3.5× drawing scale: **0.0002065642544 CSS pixels**.

These are empirical comparison results for the checked inputs and samples, not a general bound on all possible numerical errors. Displayed scores always use the original lookup data.

## Interaction and graphics checks

The supplied drawing classes were executed with an offline native-Canvas adapter. The actual standalone controller was exercised against DOM and Canvas test adapters for:

- Initial `(5, 5, 5, 5)` configuration.
- Mouse and touch-coordinate drags on all four arms, including a 320-pixel display width.
- Position limits and snapping to positions 1–12.
- Release confirmation, cancellation and control locking.
- Successful descent and a failed attempt.
- Correct displayed result and session best.
- Continuing to the next round.
- Previous-round inspection and configuration reuse.
- Reusing three renderer instances instead of creating new renderers for every round.

## Remaining review

A complete browser visual and end-to-end review was not available in this environment because no local browser binary was installed. Native-Canvas checks cover the original scene geometry; they do not replace a browser review of CSS, WebGL and native dialogs. Open `index.html` locally and review the published site on desktop and mobile before adding the link to the paper.
