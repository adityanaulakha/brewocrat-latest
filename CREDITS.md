# Asset credits (pour v6 — the site's opening intro)

The intro (`src/components/Preloader.tsx` → `src/components/pour/PourV6.tsx` → `src/v6/`; standalone preview at `pour-v6.html`) renders lager drawn from a brass draft tap into a weizen glass with Three.js.
No AI-generated images, video or models are used. Every third-party asset is CC0 (public domain); no
attribution is legally required, it is recorded here for provenance.

| Asset | File in repo | Source | Author | License |
|---|---|---|---|---|
| Brewocrat medallion on the tap handle (logo in gold on black enamel, raised relief, brass bezel; built at runtime in `src/v6/textures.ts` `badgeTexture`) | `public/Logopng-02-300.webp` | client's own brand asset | Brewocrat | client-owned |
| Draft beer tap (column tower, faucet, hex coupling, turned-wood handle — the handle reuses the CC0 Wood Table 001 texture below) | `src/v6/tap.ts` | original procedural lathe geometry written for this project (no third-party model) | Brewocrat site | project-owned |
| "Beer glasses set" GLB — trimmed to just its **wheat / weizen glass** mesh (open lip wall + thick closed foot, 83 × 194 mm); the set's beer/foam meshes and textures were removed with glTF-Transform (3.2 MB → 47 KB) | `public/pour-v6/weizen_glass.glb` | https://www.innerscene.com/tools/library/3d-parts/beer-glasses-set-78259ebd | Innerscene Corp | CC0 1.0 |
| "Studio Small 09" HDRI (studio softboxes, used for reflections/lighting) | `public/pour-v6/studio_small_09_1k.hdr` | https://polyhaven.com/a/studio_small_09 | Sergej Majboroda | CC0 1.0 |
| "Wood Table 001" PBR texture (bar top: diffuse, OpenGL normal, roughness) | `public/pour-v6/wood_table_001_{diffuse,nor_gl,rough}_1k.jpg` | https://polyhaven.com/a/wood_table_001 | Dimitrios Savva, Rico Cilliers | CC0 1.0 |

How the models are used: the GLBs are loaded at runtime with `GLTFLoader`; the glass wall
profiles (outer wall, inner wall, floor, lip, crown bead) are read from the meshes' own vertex rings and
re-revolved at 200+ segments with a Catmull-Rom smoothing pass (`src/v6/profile.ts`, `src/v6/vessel.ts`),
because the source meshes are modest-poly (56–130 radial segments) and facet visibly in an extreme
close-up. Dimensions are unchanged. The beer, foam, stream, bubbles and condensation are
simulated / generated in code from those same profiles, so liquid can never extend past the glass walls.
