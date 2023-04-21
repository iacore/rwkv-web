design notes

## Recursive font control

```css
.example-recursive {
  /* 1 = mono */
  --mono: "MONO" 0;
  /* -15 (slant) to 0 (normal) */
  --slnt: "slnt" 0;
  font-variation-settings: var(--mono), var(--slnt);
  /* control weight with this */
  font-weight: 600;
}
```

## Export svg

```shell
inkscape -l --export-filename=public/favicon.svg design/favicon.svg
```

## Components

Tokenizer
- global
- can be shared across model and browser tabs
- error handling: minimal

Server
- transient/unstable
- over network

Model Info
- global
- per model

## All async stuff

- wait for tokenizer (once
- wait for server (retry-able)
- infer request (slow)
- encode/decode (<100ms)
