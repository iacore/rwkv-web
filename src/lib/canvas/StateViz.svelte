<script lang="ts">
export let data: Uint8Array | undefined
</script>

{#if data == undefined}
  <abbr title="no state"> ∅ </abbr>
{:else}
  <div class="flex gap-[1px]">
    {#each data.slice(0, 128) as i}
      <span style:height="calc(100% * {i / 255})"></span>
    {/each}
  </div>
{/if}

<style lang="postcss">
span {
  @apply bg-text w-[1px];
}
</style>
