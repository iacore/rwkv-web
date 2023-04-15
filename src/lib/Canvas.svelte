<script lang="ts">
import ExNode from "./canvas/ExNode.svelte"
import InferNode from "./canvas/InferNode.svelte"
import ResultNode from "./canvas/ResultNode.svelte"
</script>

<div class="canvas isolate">
  <div class="nodes">
    <InferNode data={{x: 100, y: 100}}/>
    <ResultNode data={{x: 100, y: 230}}/>
  </div>
</div>

<style>
.canvas {
  position: relative;
}
</style>
