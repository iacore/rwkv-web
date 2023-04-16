export type TokenChoice = {
  /** token id */
  i: number
  /** probability (linear, normalized) */
  p: number
}


function sum(e_x: number[]) {
  return e_x.reduce((a, b) => a + b, 0)
}

/** return (exclusive) upper bound index */
function first_cumsum_over(sorted: TokenChoice[], top_p: number): number {
  let cum = 0
  for (let i = 0; i < sorted.length; ++i) {
    const { p } = sorted[i]
    cum += p
    if (cum > top_p) return i
  }
  return sorted.length
}

// this seem to be fast enough
export function preselect(
  logits: Float32Array,
  temperature: number,
  top_p: number
): TokenChoice[] {
  debugger;
  const logits_0 = Array.from(logits)
  const logits_0_max = Math.max(...logits_0)

  // console.log("logits_0", logits_0)

  // poorman's softmax
  const e_x = logits_0.map(x => Math.exp(x - logits_0_max))
  // console.log("e_x", e_x, logits_0_max)
  const e_x_sum = sum(e_x)
  let probs = e_x.map(el => el / e_x_sum)
  // console.log("probs", probs)

  const sorted = Array.from(probs).map((p, i) => ({ p, i }))
  sorted.sort((a, b) => b.p - a.p)
  const cutoff_i = first_cumsum_over(sorted, top_p)
  // console.log("cutoff_i", cutoff_i, sorted, top_p)

  return sorted.slice(0, cutoff_i).map(({p, i}) => ({p: p / temperature, i}))
}

/** return token id */
export function random_choice(sorted: TokenChoice[]): number {
  let threshold = Math.random() * sorted.reduce((a, b) => a + b.p, 0)

  let cum = 0
  for (let i = 0; i < sorted.length; ++i) {
    const { p, i: token_id } = sorted[i]
    cum += p
    if (cum > threshold) return token_id
  }
  throw new Error("impossible")
}
