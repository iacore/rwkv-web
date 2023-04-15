<script lang="ts">
import ExNode from "./canvas/ExNode.svelte"
import BatchInferNode from "./canvas/BatchInferNode.svelte"
import ResultNode from "./canvas/ResultNode.svelte"

import { draggable } from "@neodrag/svelte"
import { state_canvas } from "./stores"

let elCanvas
let elNodes
function onDrag(e) {
  state_canvas.update(o => ({
    ...o,
    x: e.detail.offsetX,
    y: e.detail.offsetY,
  }))
}
</script>

<div class="canvas isolate" bind:this="{elCanvas}">
  <div class="nodes relative" bind:this="{elNodes}" use:draggable={{
    position: $state_canvas,
    handle: elCanvas,
    cancel: elNodes,
  }}
    on:neodrag={onDrag}>
    <BatchInferNode data={{x: 100, y: 100-60}}/>
    <ResultNode data={{x: 100, y: 400-60}}/>
  </div>
</div>

<style>
.canvas {
  overflow: hidden;
}
</style>
