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
