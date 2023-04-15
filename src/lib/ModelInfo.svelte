<script lang="ts">
import type { ModelInfo } from "./server"

export let data: ModelInfo
</script>

<div class="flex justify-between gap-2 overflow-hidden">
  <div
    class="flex-shrink-[999999] whitespace-nowrap overflow-hidden text-ellipsis"
    dir="rtl"
  >
    <span dir="auto" title="{data.model_path}">{data.model_path}</span>
  </div>
  <div class="">|Vocab|={data.vocab_count}</div>
  <div class="">|State|={data.state_count}</div>
</div>
