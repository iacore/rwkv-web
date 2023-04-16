<script lang="ts">
import { draggable } from "@neodrag/svelte"

import { state_canvas, state_nodes } from "./stores"

import BatchInferNode from "./canvas/BatchInferNode.svelte"
import ResultNode from "./canvas/ResultNode.svelte"
import { inspect } from "./util"

let elCanvas
let elNodes
function onDrag(detail) {
  state_canvas.update((o) => ({
    ...o,
    x: detail.offsetX,
    y: detail.offsetY,
  }))
}
</script>

<div class="canvas isolate" bind:this="{elCanvas}">
  <div
    class="nodes relative"
    bind:this="{elNodes}"
    use:draggable="{{
      position: $state_canvas,
      handle: elCanvas,
      cancel: elNodes,
      onDrag,
    }}"
  >
    {#each $state_nodes.items as node}
      {#if node.type == "infer"}
        <BatchInferNode data={node} />
      {:else if node.type == "result"}
        <ResultNode data={node} />
      {:else}
        Unknown node: {inspect(node)}
      {/if}
    {/each}
  </div>
</div>

<style>
.canvas {
  overflow: hidden;
}
</style>
