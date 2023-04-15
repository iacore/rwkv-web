<script lang="ts">
import ExNode from "./ExNode.svelte"
import type { NodeState_Result } from "./mod"

export let data: NodeState_Result
</script>

<ExNode title="Infer Result" data="{data}">
  <svelte:fragment slot="content">
    <label>state <input type="text" disabled /></label>
    <label>logits <input type="text" disabled /></label>
    <label>next <select></select></label>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <button class="btn-inline">Infer Next</button>
    <button class="btn-inline">Infer Batch</button>
    <button class="btn-inline">Sample</button>
  </svelte:fragment>
</ExNode>
