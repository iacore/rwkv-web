<script lang="ts">
import ExNode, { type ExNodeData } from "./ExNode.svelte"

export let data: ExNodeData
</script>

<ExNode title="Infer Result" data={data}
	on:neodrag:start
	on:neodrag
	on:neodrag:end>
	<svelte:fragment slot="content">
		<label>state <input type="text" disabled /></label>
    <label>probs <input type="text" disabled /></label>
	</svelte:fragment>
	<svelte:fragment slot="actions">
		<button class="btn-inline">Infer more</button>
		<button class="btn-inline">Sample</button>
	</svelte:fragment>
</ExNode>
