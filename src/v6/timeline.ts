/**
 * v6 pour choreography. Everything is a pure function of time t (seconds) so preview frames can be
 * rendered one at a time, deterministically. Units: metres, m³, m/s.
 * World: the glass stands at the origin on the counter (y = 0); camera looks down −z.
 */
export const DURATION = 8.0
export const G = 9.81
export const T_ON = 0.9 // beer leaves the spout
export const T_OFF = 5.05 // handle closed, flow cut at the spout
export const POURED = 3.3e-4 // 330 ml drawn
export const DEG = Math.PI / 180

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }
export const smoother = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * t * (t * (t * 6 - 15) + 10) }
export const mix = (a: number, b: number, t: number) => a + (b - a) * t

/* -------------------------------------------------------------------------------- draft tap */
/** Spout outlet (metres): just above the rim, a little off-centre so the stream runs down near the wall. */
export const SPOUT = { x: 0.012, y: 0.206 } as const
/** Handle pull angle (rad, + = toward the front/spout): drawn just before the flow, closed as it stops. */
export const leverAt = (t: number) => (smoother(T_ON - 0.4, T_ON - 0.06, t) - smoother(T_OFF - 0.3, T_OFF + 0.06, t)) * 36 * DEG

/* -------------------------------------------------------------------------------- flow */
// a draft faucet runs steady: smooth open/close ramps, a faint shimmer from the CO2 break-out
const shim = (t: number) => 1 + 0.025 * Math.sin(2 * Math.PI * 7.1 * t) * Math.sin(2 * Math.PI * 0.7 * t + 0.4)
const shape = (t: number) => smooth(T_ON - 0.06, T_ON + 0.07, t) * (1 - smooth(T_OFF - 0.27, T_OFF - 0.02, t)) * shim(t)
const DT = 1 / 2000
const N = Math.ceil((DURATION + 1) / DT)
const cum = new Float64Array(N + 1)
for (let i = 0; i < N; i++) cum[i + 1] = cum[i] + shape(i * DT) * DT
export const QMAX = POURED / cum[N]
/** Volume flow at the lip (m³/s). */
export const flowAt = (t: number) => QMAX * shape(t)
/** Volume that has left the tap by time t. */
export const pouredBy = (t: number) => { const i = clamp(t / DT, 0, N); const k = Math.floor(i); return QMAX * (cum[k] + (cum[Math.min(k + 1, N)] - cum[k]) * (i - k)) }
/** Exit speed at the spout outlet (m/s; ≈ Q / bore area). */
export const exitSpeed = (t: number) => 0.95 * shim(t)

/* -------------------------------------------------------------------------------- glass contents
 * A share of the poured beer whips into foam; foam slowly drains back to beer. Integrated once. */
export const FALL = 0.17 // s from the lip to the surface (≈ for volume accounting)
export const FOAM_PER_BEER = 1.35 // m³ of fresh foam per m³ of beer hitting the surface (falls as the glass fills)
export const FOAM_LIQUID = 0.22 // liquid fraction of foam
const fv = new Float64Array(N + 1), bv = new Float64Array(N + 1), turb = new Float64Array(N + 1)
{
  let f = 0, k = 0
  for (let i = 0; i <= N; i++) {
    const t = i * DT
    const q = flowAt(t - FALL)
    const tau = t < T_OFF + 0.2 ? 2.6 : mix(2.6, 60.0, smooth(T_OFF + 0.2, T_OFF + 1.5, t))
    // fresh-foam yield drops as the beer gets deeper (less fall height → gentler impact)
    const fill = clamp(pouredBy(t - FALL) / POURED)
    const y = FOAM_PER_BEER * mix(1.25, 0.45, fill)
    f += (y * q - f / tau) * DT
    k += (q / QMAX - k) * DT * 6
    fv[i] = f; turb[i] = k
    bv[i] = pouredBy(t - FALL) - FOAM_LIQUID * f
  }
}
const at = (a: Float64Array, t: number) => { const i = clamp(t / DT, 0, N); const k = Math.floor(i); return a[k] + (a[Math.min(k + 1, N)] - a[k]) * (i - k) }
export let FOAM_SCALE = 0.98
export const setFoamScale = (s: number) => { FOAM_SCALE = s }
export const foamVol = (t: number) => at(fv, t) * FOAM_SCALE
export const beerVol = (t: number) => Math.max(0, pouredBy(t - FALL) - FOAM_LIQUID * foamVol(t))
/** 0..1 how churned / cloudy the beer is (impact turbulence, decays after the pour). */
export const churnAt = (t: number) => clamp(at(turb, t))

/* -------------------------------------------------------------------------------- camera */
export function cameraAt(t: number, portrait: boolean) {
  const k = smoother(0, DURATION, t)
  const e = smoother(4.6, DURATION, t)
  if (portrait) {
    return {
      pos: [mix(0.045, 0.0, k) - e * 0.02, mix(0.15, 0.135, k) - e * 0.008, mix(0.62, 0.56, k) - e * 0.05] as const,
      look: [mix(0.022, 0.01, k) - e * 0.008, mix(0.19, 0.176, k) - e * 0.064, 0] as const,
      fov: mix(40, 31, e),
    }
  }
  return {
    pos: [mix(0.07, 0.03, k) - e * 0.05, mix(0.14, 0.13, k) - e * 0.012, mix(0.58, 0.55, k) - e * 0.06] as const,
    look: [mix(0.022, 0.016, k) - e * 0.014, mix(0.184, 0.174, k) - e * 0.058, 0] as const,
    fov: mix(37, 31, e),
  }
}
