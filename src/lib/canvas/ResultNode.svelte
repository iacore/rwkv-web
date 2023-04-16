<script lang="ts">
import ExNode from "./ExNode.svelte"
import type { NodeState_Result } from "./state"
import StateViz from "./StateViz.svelte"

export let data: NodeState_Result
</script>

<ExNode title="Infer Result" data="{data}">
  <svelte:fragment slot="content">
    <span>state <StateViz data={data.state} /></span>
    <label>logits <input type="text" disabled /></label>
    <label>next <select></select></label>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <button class="btn-inline">Infer Next</button>
    <button class="btn-inline">Infer Batch</button>
    <button class="btn-inline">Sample</button>
  </svelte:fragment>
</ExNode>
