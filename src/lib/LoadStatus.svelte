<script lang="ts">
import { promiseStateFancyString, type PromiseState } from "./util"

export let data: PromiseState
</script>

<code class="whitespace-nowrap"
  >[<span
    class:text-hl="{data == 'rejected'}"
    class:animate-flicker="{data == 'pending'}"
    >{promiseStateFancyString(data)}</span
  >]</code
>
