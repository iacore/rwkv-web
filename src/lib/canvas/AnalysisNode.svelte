<script lang="ts">
import { state_nodes, store_client, store_tokenizer } from "../stores"
import type { TokenizerHandle } from "../tokenizers/shim"
import ExNode from "./ExNode.svelte"
import type { NodeState_Analysis } from "./state"
import StateViz from "./StateViz.svelte"

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
