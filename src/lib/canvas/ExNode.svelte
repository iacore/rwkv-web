<script context="module" lang="ts">
export type ExNodeData = {
  x: number
  y: number
  stacking: number
}
</script>

<script lang="ts">
import { draggable } from "@neodrag/svelte"

export let title = "(untitled)"
export let data: ExNodeData = { x: 100, y: 100, stacking: 0 }

let el: HTMLElement | undefined
let dragcancel: HTMLElement[] = []

$: {
  if (el) {
    dragcancel.push(...el.querySelectorAll('input'))
    dragcancel.push(...el.querySelectorAll('textarea'))
  }
}

function onDrag(e) {
  data.x = e.detail.offsetX
  data.y = e.detail.offsetY
}
</script>

<div
  bind:this={el}
  class="node isolate"
  style:z-index="{data.stacking}"
  use:draggable="{{
    position: { x: data.x, y: data.y },
    cancel: dragcancel,
  }}"
  on:neodrag="{onDrag}"
  on:neodrag:start
  on:neodrag
  on:neodrag:end
>
  <div class="title font-bold px-1">{title}</div>
  <div class="content pl-1 pr-2 pb-2">
    <slot name="content" />
  </div>
  <div class="actions flex -mr-[1px] justify-end">
    <slot name="actions" />
  </div>
</div>

<style>
.node {
  position: absolute;
  outline: solid 1px white;
  width: 20rem;
  background-color: var(--color-background);
}
.content {
  display: grid;
  grid-auto-columns: auto 1fr;
}
.content :global(label) {
  display: grid;
  @apply gap-1;
  grid-template-columns: subgrid;
  grid-column: span 2;
}
</style>
