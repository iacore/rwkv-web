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

function onDrag(e) {
  data.x = e.detail.offsetX
  data.y = e.detail.offsetY
}
</script>

<div
  class="node isolate"
  style:z-index="{data.stacking}"
  use:draggable="{{ position: { x: data.x, y: data.y } }}"
  on:neodrag="{onDrag}"
  on:neodrag:start
  on:neodrag
  on:neodrag:end
>
  <div class="title font-bold">{title}</div>
  <div class="content">
    <slot name="content" />
  </div>
  <div class="actions">
    <slot name="actions" />
  </div>
</div>

<style>
.node {
  outline: solid 1px white;
  display: inline-block;
  position: absolute;
  background-color: var(--color-background);
}
</style>
