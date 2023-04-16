<script lang="ts">
export let data: Uint8Array | null
</script>

{#if data}
	<div class="flex gap-[1px]">
		{#each data.slice(0, 128) as i}
		<span style:height="calc(100% * {i / 255})"></span>
		{/each}
	</div>
{:else}
	<abbr title="no state">
		∅
	</abbr>
{/if}

<style>
	span {
		@apply bg-white w-[1px];
	}
</style>
