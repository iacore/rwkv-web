export type TokenChoice = {
  /** token id */
  i: number
  /** probability (linear, normalized) */
  p: number
}

export function preselect(
  data: Float32Array,
  temperature: number,
  top_p: number
): TokenChoice[] {
  // todo
  return [
    {
      i: 74,
      p: 0.4,
    },
    {
      i: 73,
      p: 0.3,
    },
    {
      i: 72,
      p: 0.2,
    },
    {
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },{
      i: 71,
      p: 0.1,
    },
  ]
}
