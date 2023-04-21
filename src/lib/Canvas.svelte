<script lang="ts">
import { type DragEventData, draggable } from "@neodrag/svelte"

import { addIndicator, indicators, state_canvas, state_nodes } from "./stores"

import BatchInferNode from "./canvas/BatchInferNode.svelte"
import ResultNode from "./canvas/ResultNode.svelte"
import AnalysisNode from "./canvas/AnalysisNode.svelte"
import { inspect } from "./util"
import StreamNode from "./canvas/StreamNode.svelte"

let elCanvas, elNodes
function onDrag(detail: DragEventData) {
  state_canvas.update((o) => ({
    ...o,
    x: detail.offsetX,
    y: detail.offsetY,
  }))
}
</script>

<div class="isolate overflow-hidden" bind:this="{elCanvas}">
  <div
    class="relative"
    bind:this="{elNodes}"
    use:draggable="{{
      position: $state_canvas,
      handle: elCanvas,
      cancel: elNodes,
      onDrag,
    }}"
  >
    <div class="nodes pointer-events-auto">
      {#each $state_nodes.items as node (node.id)}
        {#if node.type == "infer"}
          <BatchInferNode data="{node}" />
        {:else if node.type == "result"}
          <ResultNode data="{node}" />
        {:else if node.type == "analysis"}
          <AnalysisNode data="{node}" />
        {:else if node.type == "stream"}
          <StreamNode data="{node}" />
        {:else}
          Unknown node: {inspect(node)}
        {/if}
      {/each}
    </div>
    <div class="indicators pointer-events-auto">
      {#each $indicators as item}
        <div class="isolate absolute bg-hl w-10 h-10 -top-5 -left-5 animate-flicker" style="transform:translate({item.x}px, {item.y}px) rotate(45deg);">
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
</style>
