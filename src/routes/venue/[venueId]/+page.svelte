<script lang="ts">
	import Page from '$lib/components/layout/Page.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: ({ venue } = data)
</script>

<Page title={venue.name}>
	<div>
		<div>{venue.website ? venue.website : 'no website provided'}</div>
		<div class="flex gap-2">
			<div class="avatar">
				<div class="w-8 rounded-full">
					<img alt={venue.Publisher?.username} src={venue.Publisher?.avatar} />
				</div>
			</div>
			<div>{venue.Publisher?.name}</div>
		</div>
		<div class="divider" />
		<h1>Events:</h1>
		<ul>
			{#each venue.Events as event}
				<li>
					<a href={`/events/${event.id}`}>{event.name}</a>
				</li>
			{/each}
		</ul>
	</div>
</Page>
