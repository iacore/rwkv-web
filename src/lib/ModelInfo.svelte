<script lang="ts">
import type { ModelInfo } from "./server"

export let data: ModelInfo | undefined


const MARQUEE_TEXT = "Model Info Not Available"
</script>

{#if data}
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
{:else}
  <div class="marquee">
    <div class="marquee__inner">
      <span>{MARQUEE_TEXT}</span>
      <span aria-hidden="true">{MARQUEE_TEXT}</span>
      <span aria-hidden="true">{MARQUEE_TEXT}</span>
      <span aria-hidden="true">{MARQUEE_TEXT}</span>
      <span aria-hidden="true">{MARQUEE_TEXT}</span>
      <span aria-hidden="true">{MARQUEE_TEXT}</span>
      <span aria-hidden="true">{MARQUEE_TEXT}</span>
      <span aria-hidden="true">{MARQUEE_TEXT}</span>
    </div>
  </div>
{/if}

<style>
.marquee {
  position: relative;
  overflow: hidden;
  --move-initial: calc(-12.5%);
  --move-final: calc(0%);
}

.marquee__inner {
  width: fit-content;
  display: flex;
  position: relative;
  animation: marquee 5s linear infinite;
  animation-play-state: paused;
}

.marquee span {
  padding: 0 2rem;
  white-space: nowrap;
}

.marquee .marquee__inner {
  animation-play-state: running;
}

@keyframes marquee {
  0% {
    transform: translateX(var(--move-initial));
  }

  100% {
    transform: translateX(var(--move-final));
  }
}
</style>
