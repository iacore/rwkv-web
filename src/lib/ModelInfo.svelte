<script lang="ts">
import type { ModelInfo } from "./server"

export let data: ModelInfo
</script>

<div class="flex justify-between gap-2">
	<div class="flex-shrink-[999999] whitespace-nowrap overflow-hidden text-ellipsis" dir="rtl" title={data.model_path}>{data.model_path}</div>
	<div class="">|Vocab|={data.vocab_count}</div>
	<div class="">|State|={data.state_count}</div>
</div>