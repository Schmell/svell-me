<script lang="ts">
	import Icon from '@iconify/svelte'
	import { createPagination } from '@melt-ui/svelte'
	// import ChevronLeft from '~icons/lucide/chevron-left';
	// import ChevronRight from '~icons/lucide/chevron-right';

	const { prevButton, nextButton, pages, pageTrigger, range, root } = createPagination({
		count: 100,
		perPage: 10,
		page: 1,
		siblingCount: 1
	})
</script>

<nav class="flex flex-col items-center gap-4" aria-label="pagination" melt={$root}>
	<p class="text-center">
		Showing items {$range.start} - {$range.end}
	</p>
	<div class="flex items-center gap-2">
		<button melt={$prevButton}><Icon icon="mdi:chevron-left" /></button>
		{#each $pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<span>...</span>
			{:else}
				<button melt={$pageTrigger(page)}>{page.value}</button>
			{/if}
		{/each}
		<button melt={$nextButton}><Icon icon="mdi:chevron-right" /></button>
	</div>
</nav>

<style lang="postcss">
	button {
		display: grid;
		place-items: center;
		border-radius: theme('borderRadius.sm');
		background-color: theme('colors.white');
		/* color: theme('colors.magnum.700'); */
		@apply text-base-300 shadow-sm text-sm px-3
		/* box-shadow: theme('boxShadow.sm'); */

		/* font-size: theme('fontSize.sm'); */

		/* padding-inline: theme('spacing.3'); */
		height: theme('spacing.8');

		&:hover {
			opacity: 0.75;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}

		&[data-selected] {
			/* background-color: theme('colors.magnum.900');
             */
			@apply bg-base-300
			color: theme('colors.white');
		}
	}
</style>
