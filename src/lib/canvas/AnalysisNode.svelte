<script lang="ts">
import ExNode from "./ExNode.svelte"
import type { NodeState_Analysis } from "./types"

export let data: NodeState_Analysis
</script>

<ExNode title="Stat Analysis" data="{data}" wip={true}>
  <svelte:fragment slot="content">
    <div>
			top
			<ul>
				<li>1</li>
				<li>2</li>
				<li>3</li>
			</ul>
		</div>
  </svelte:fragment>
  <svelte:fragment slot="actions">
  </svelte:fragment>
</ExNode>
