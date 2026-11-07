/**
 * Opening-pour configuration. Switch LIQUID_KIND to 'redWine' to pour wine instead of beer.
 * Everything that gives the liquid its colour lives in LIQUIDS so it can be tuned in one place.
 */
export type LiquidKind = 'beer' | 'redWine'
export const LIQUID_KIND: LiquidKind = 'beer'

export interface LiquidLook {
  /** Beer–Lambert absorption per scene unit (1 unit ≈ 10 cm) for R, G, B. Higher = darker in that channel. */
  absorb: [number, number, number]
  /** Colour of the light shining through the liquid from behind (linear, can exceed 1 for glow). */
  backlight: [number, number, number]
  /** Tint mixed in while the liquid is churned/aerated during the pour. */
  churn: [number, number, number]
  /** Foam colour (linear). */
  foam: [number, number, number]
  /** Final liquid level as a fraction of the glass interior (0 = base, 1 = rim). */
  fill: number
  /** Final foam head thickness in scene units (0 for no head). */
  foamHeight: number
  /** Overlay colours used by the 2D "dive into the glass" flood. */
  flood: [string, string, string]
}

export const LIQUIDS: Record<LiquidKind, LiquidLook> = {
  beer: {
    absorb: [0.75, 2.1, 6.0],
    backlight: [1.5, 1.2, 0.85],
    churn: [1.0, 0.8, 0.48],
    foam: [0.92, 0.83, 0.64],
    fill: 0.745,
    foamHeight: 0.25,
    flood: ['#F2B53A', '#D88F18', '#8A4F0C'],
  },
  redWine: {
    absorb: [1.1, 16.0, 12.0],
    backlight: [2.6, 1.6, 1.5],
    churn: [0.75, 0.12, 0.18],
    foam: [0.55, 0.12, 0.2],
    fill: 0.55,
    foamHeight: 0.012,
    flood: ['#B3263E', '#7A0F22', '#3A0610'],
  },
}

export const LIQUID = LIQUIDS[LIQUID_KIND]
