<script lang="ts">
export let data: PromiseLike<string>
</script>

{#await data}
  <span>⧗</span>
{:then data}
  {data}
{/await}
