<script lang="ts">
import { promiseStateFancyString, type PromiseState } from "./util"

export let state: PromiseState
</script>

<code class="whitespace-nowrap"
  >[<span
    class:text-hl="{state == 'rejected'}"
    class:animate-flicker="{state == 'pending'}"
    >{promiseStateFancyString(state)}</span
  >]</code
>
