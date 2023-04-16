<script lang="ts">
// ignore the funny name, this is the base node
import { draggable } from "@neodrag/svelte"
import { get } from "svelte/store"
import { state_nodes } from "../stores"
import type { BaseNodeState } from "./mod"

export let title = "(untitled)"
export let data: BaseNodeState

let el: HTMLElement | undefined
let dragcancel: HTMLElement[] = []

$: {
  if (el) {
    dragcancel.push(...el.querySelectorAll('input'))
    dragcancel.push(...el.querySelectorAll('textarea'))
    dragcancel.push(...el.querySelectorAll('select'))
  }
}

function onDragStart(detail) {
  const maxStacking = Math.max(-1, ...get(state_nodes).items.map(o => o.stacking--))
  data.stacking = maxStacking + 1
}

function onDrag(detail) {
  data.x = detail.offsetX
  data.y = detail.offsetY
  // state_nodes.save()
}

function close() {
  state_nodes.update(o => ({
    items: o.items.filter(n => n.id != data.id)
  }))
}
</script>

<div
  bind:this={el}
  class="node isolate"
  style:z-index="{data.stacking}"
  use:draggable="{{
    position: { x: data.x, y: data.y },
    cancel: dragcancel,
    onDragStart,
    onDrag,
  }}"
>
  <div class=" justify-between">
    <span class="title font-bold px-1">{title}</span>
    <button class="btn-inline -mr-[1px] leading-none pb-0.5 float-right" on:click={close}>x</button>
  </div>
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
  width: 320px; /* remember this offset */
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
