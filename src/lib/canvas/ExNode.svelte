<script lang="ts">
//! ignore the funny class name, this is the base node

import { draggable } from "@neodrag/svelte"
import { state_nodes } from "../stores"
import { type BaseNodeState, createMaxStacking } from "./types"

export let title = "(untitled)"
export let data: BaseNodeState
export let wip = false

let el: HTMLElement | undefined
let dragcancel: HTMLElement[] = []

$: {
  if (el) {
    const rect = el.getBoundingClientRect()
    data.el_width = rect.width
    data.el_height = rect.height
    dragcancel.push(...el.querySelectorAll("input"))
    dragcancel.push(...el.querySelectorAll("textarea"))
    dragcancel.push(...el.querySelectorAll("select"))
  }
}

function onDragStart(_detail) {
  data.stacking = createMaxStacking() + 1
}

function onDrag(detail) {
  data.x = detail.offsetX
  data.y = detail.offsetY
  state_nodes.save()
}

function close() {
  state_nodes.update((o) => {
    const i = o.items.findIndex((n) => n.id == data.id)
    if (i >= 0) o.items.splice(i, 1)
    return o
  })
}
</script>

<div
  bind:this="{el}"
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
    <span class="title font-bold px-1"
      >{#if wip}<span class="font-normal">[WIP] </span>{/if}{title}</span
    >
    <button
      class="btn-inline -mr-[1px] leading-none pb-0.5 float-right"
      on:click="{close}">x</button
    >
  </div>
  <div class="content pl-1 pr-2 pb-2">
    <slot name="content" />
  </div>
  <div class="actions flex -mr-[1px] justify-end">
    <slot name="actions" />
  </div>
</div>

<style lang="postcss">
.node {
  position: absolute;
  outline: solid 1px var(--color-text);
  background-color: var(--color-background);
}
.content {
  display: grid;
  grid-auto-columns: auto 256px;
}
:global(.content > *) {
  display: grid;
  @apply gap-1;
  grid-template-columns: subgrid;
  grid-column: span 2;
  /* :global(.content > * > :first-child) {
    text-align: right;
  } */
}
</style>
