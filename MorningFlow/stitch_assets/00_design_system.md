# Design System Specification: Monochrome Prestige

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Nocturnal Gallery."** 

This is not a "Dark Mode" version of a white site; it is a bespoke, high-end editorial environment designed to feel like a physical luxury gallery at night. We move beyond the "standard" SaaS interface by embracing high-contrast monochromatic tension and deep, atmospheric layering. 

To break the "template" look, we utilize **Intentional Asymmetry**. Layouts should avoid perfect 50/50 splits, opting instead for wide-open negative space (using the `24` spacing scale) contrasted against tightly grouped, high-impact typography. Overlapping elements—where a glass container partially obscures a sharp headline—create a sense of physical depth and "prestige" that flat grids cannot replicate.

---

## 2. Colors & Tonal Architecture
The palette is strictly achromatic, relying on the interplay of light and shadow to define function.

### The Palette (Material Convention)
*   **Background:** `#131313` (The Infinite Canvas)
*   **Primary:** `#FFFFFF` (The Focal Light)
*   **Surface Tiers:** From `surface_container_lowest` (#0E0E0E) to `surface_bright` (#393939).
*   **On-Surface (Text):** High-contrast `#E2E2E2` for primary content; `on_surface_variant` (#C6C6C6) for secondary descriptions.

### The "No-Line" Rule
Standard 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined through background color shifts. To separate a hero section from a feature grid, transition from `surface` (#131313) to `surface_container_low` (#1B1B1B). This creates a "soft edge" that feels integrated into the environment.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the hierarchy below to define importance:
1.  **Base:** `surface` (The floor)
2.  **Sectioning:** `surface_container_low` (Subtle elevation)
3.  **Components/Cards:** `surface_container_highest` (Interactive focal points)

### The "Glass & Gradient" Rule
To inject "soul" into the monochrome theme, utilize monochromatic gradients. CTAs should not be flat; use a gradient from `primary` (#FFFFFF) to `primary_container` (#D4D4D4) to give buttons a metallic, machined quality. Floating cards must use `surface_variant` at 40% opacity with a `backdrop-blur` of 20px-40px to simulate frosted glass.

---

## 3. Typography
Our type system conveys authority through stark contrast and generous tracking.

*   **Display (Manrope):** Use `display-lg` (3.5rem) for singular, high-impact statements. Tighten letter-spacing slightly (-0.02em) to create a "block" of text that feels like a physical object.
*   **Headline (Manrope):** Use `headline-lg` (2rem) for section headers. Always in `#FFFFFF`.
*   **Body (Inter):** Use `body-lg` (1rem) for readability. Secondary descriptions must use `on_surface_variant` (#C6C6C6) to pull back visually and let the headlines lead.
*   **Label (Inter):** Use `label-md` (0.75rem) with 0.1em tracking for all-caps "Overlines." This adds a technical, premium feel to metadata.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** and environmental physics.

*   **The Layering Principle:** Avoid shadows where possible. Instead, place a `surface_container_high` card inside a `surface_container_lowest` section. The value shift provides all the "lift" required.
*   **Ambient Shadows:** For floating elements (Modals/Popovers), use a shadow with a 60px blur at 8% opacity using the `on_surface` color. It should feel like an atmospheric glow, not a drop shadow.
*   **The "Ghost Border":** While solid lines are banned for sectioning, interactive glass containers may use a "Ghost Border"—the `outline_variant` token at 20% opacity. This defines the edge of the glass without breaking the monochromatic flow.
*   **Glassmorphism:** All "floating" containers must use semi-transparent surface colors. This allows the background content to bleed through, ensuring the layout feels like one cohesive ecosystem.

---

## 5. Components

### Buttons
*   **Primary:** A stark `#FFFFFF` fill with `#1A1C1C` text. Roundedness: `xl` (3rem/30px).
*   **Secondary:** Glass-fill (Surface at 20% opacity) with a Ghost Border.
*   **Tertiary:** Text-only with an underline that appears only on hover, using `primary_fixed`.

### Cards & Lists
*   **The Divider Ban:** Never use horizontal lines. Separate list items using the `3` (1rem) spacing scale.
*   **Cards:** Use `surface_container` with `lg` (2rem) corner radius. For premium cards, apply the "Glass & Gradient" rule with a subtle white-to-transparent top-down gradient.

### Input Fields
*   **State:** Unfocused fields are `surface_container_highest` with no border. On focus, the field should gain a Ghost Border and the label should shift to `#FFFFFF`.
*   **Roundedness:** `md` (1.5rem) to maintain the "pill" aesthetic without looking like a button.

### Interactive Chips
*   **Selection:** Use `primary_container` with a high-contrast `on_primary_container` (#000000) text for active states.

---

## 6. Do’s and Don’ts

### Do:
*   **Use White Space as a Tool:** If a layout feels crowded, increase spacing to `16` (5.5rem). Space is a luxury indicator.
*   **Embrace Asymmetry:** Offset text blocks from the center of the grid to create a modern, editorial vibe.
*   **Layer Glass:** Overlap glass containers to see how the blurs interact.

### Don’t:
*   **Don't Use Pure Gray Shadows:** Shadows should always be a low-opacity version of the background or primary text color to maintain "airiness."
*   **Don't Use 1px Borders:** If you feel you need a line, use a background color shift instead.
*   **Don't Use Color:** This system is strictly monochromatic. Use variations in transparency and blur to create visual interest rather than hue.
*   **Don't Square the Corners:** Never drop below the `DEFAULT` (1rem) roundedness scale. This system is defined by its soft, inviting curves.
