<script lang="ts">
export let data: PromiseLike<string | undefined>
</script>

{#await data}
	<span class="animate-pulse">⌛</span>
{:then data} 
	{data}
{/await}