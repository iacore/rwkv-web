<!-- <script lang="ts">
import { tokenizer_promise } from "./tokenizer_shim"

const tokenizer = await tokenizer_promise

let count: number = 0
const increment = () => {
  count += 1
}

let prompt = ""
</script>

<input type="text" bind:value="{prompt}" />
<br />
{#await tokenizer.then(t => t.encode(prompt, true)) then encoding}
  {encoding.tokens}
  <br>
  {encoding.input_ids}
{/await}
<br />
<button on:click="{increment}">
  count is {count}
</button> -->
