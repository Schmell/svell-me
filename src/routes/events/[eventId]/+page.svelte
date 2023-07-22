<script script lang="ts">
	import type { PageData } from './$types'
	import Page from '$lib/components/layout/Page.svelte'
	import Icon from '@iconify/svelte'
	import { page } from '$app/stores'
	import Input from '$lib/components/form/Input.svelte'
	import Button from '$lib/components/form/Button.svelte'
	// import Picker from 'emoji-picker-element/svelte'
	import { enhance } from '$app/forms'
	import { formatDateTime } from '$lib/utils/formatters'
	import { now } from 'svelte/internal'

	// import { comment } from 'svelte/internal'

	export let data: PageData
	export let form
	// $: console.log('form: ', form)
	// export let liked
	$: ({ event, comments } = data)

	// $: console.log('comments: ', comments)
	// $: console.log('event: ', event)
	//
	function getHref(website) {
		return website && website.startsWith('http://') ? website : `http://${website}`
	}

	function checkForUserLike(comment) {
		if (comment.likes.some((like) => like.userId === data.user?.userId)) {
			return true
		}
		return false
	}

	function getLikeId(comment) {
		// comment.likes?.forEach((like) => {
		// 	// console.log('like: ', like.id)
		// 	if (like.userId === data.user?.userId) {
		// 		try {
		// 			// await prisma.like.delete({
		// 			// 	where: id: like.id
		// 			// })
		// 		} catch (error) {}
		// 	}
		// })
		return comment.id
	}
</script>

{#if data}
	<Page title={event?.name} className="mt-8">
		<div class="max-w-md mx-auto bg-base-100 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
			<div class="md:flex">
				<div class="md:shrink-0">
					<img
						class="h-48 w-full object-cover md:h-full md:w-48 rounded-br-full"
						src={event?.titleImage ? event?.titleImage : 'https://picsum.photos/id/384/400/300/'}
						alt="Title for {event?.name}"
					/>
				</div>
				<div class="pt-8 pb-4 px-8">
					<div class="uppercase tracking-wide text-sm text-accent font-semibold">
						{@html event?.name}
					</div>
					<a
						href={`/venue/${event?.venueId}`}
						class="block mt-1 text-lg leading-tight font-medium text-base-content hover:underline"
					>
						{event?.venueName}
					</a>
					<p class="mt-2 text-base-content">
						{event?.description ? event?.description : 'No description provided'}
					</p>
					<a href={getHref(event?.eventwebsite)} class="text-secondary">{event?.eventwebsite} </a>
				</div>
			</div>
			<div class="px-4 pb-4  flex justify-end">
				<div class="tooltip tooltip-top" data-tip="View Competitors">
					<a href="/comps/{event?.id}" class="btn btn-ghost p-1">
						<Icon class="text-3xl text-primary" icon="material-symbols:groups-outline-rounded" />
					</a>
				</div>
				<div class="tooltip tooltip-top" data-tip="View Races">
					<a href="/races/{event?.id}" class="btn btn-ghost p-1">
						<Icon class="text-3xl text-primary" icon="material-symbols:preview" />
					</a>
				</div>
				{#if data.user?.userId === event?.publisherId}
					<div class="tooltip tooltip-top" data-tip="Edit Event">
						<a href="/events/edit/{event?.id}?from={$page.url.pathname}" class="btn btn-ghost p-1">
							<Icon class="text-3xl text-primary" icon="material-symbols:edit-outline" />
						</a>
					</div>
				{/if}
			</div>
		</div>

		<div class="mt-4">
			<div class="flex gap-2 justify-between">
				<div class="font-semibold">Comments:</div>
				<div class="avatar-group -space-x-4">
					{#if event?.comments}
						{#each event?.comments as comment}
							<div class="avatar">
								<div class="w-6 bg-base-300">
									<img alt={`@${comment?.User.username}`} src={comment?.User.avatar} />
								</div>
							</div>
						{/each}
					{/if}

					<div class="avatar placeholder">
						<div class="w-6 bg-neutral-focus text-neutral-content">
							<span>+{event?._count.comments}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="divider" />

			{#if comments}
				{#each comments as comment}
					<div class="flex items-start gap-2">
						<div class="avatar pt-4">
							<div class="w-8 h-8 rounded-full">
								<img alt={comment.User.username} src={comment.User.avatar} />
							</div>
						</div>
						<div class="flex gap-2 py-2 items-end w-full justify-between pr-4">
							<div class="w-full">
								<div class="font-semibold">
									<a href="/user/{comment.User.id}">{`@${comment.User.username}`}</a>
								</div>
								<div>{@html comment.comment}</div>
								<div class="text-xs text-accent">
									{formatDateTime(comment?.createdAt ?? new Date())}
								</div>
							</div>

							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<div class="flex flex-col gap-4 justify-between">
								<div class="dropdown dropdown-end">
									<label tabindex="0" class=""> <Icon icon="mdi:dots-vertical" /> </label>
									<ul
										tabindex="0"
										class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
									>
										<li><button>Edit</button></li>
										<li><button class="text-error">Delete</button></li>
									</ul>
								</div>

								<!-- like component -->
								<div>
									<form method="post" action="?/like" use:enhance>
										<input type="hidden" name="eventId" value={event?.id} />
										<input type="hidden" name="commentId" value={comment.id} />
										<input type="hidden" name="likeId" value={form?.id} />
										<div
											class="flex items-center gap-2 px-2 rounded-full "
											class:bg-accent={checkForUserLike(comment)}
											class:bg-base-100={!checkForUserLike(comment)}
										>
											{#if checkForUserLike(comment)}
												<button formaction="?/unlike">
													<Icon class="text-base-100" icon="mdi:thumb-up" />
												</button>
											{:else}
												<button>
													<Icon icon="mdi:thumb-up-outline" />
												</button>
											{/if}
											<div
												class=" border-l-2 border-base-200 pl-2"
												class:text-base-100={checkForUserLike(comment)}
											>
												{comment._count.likes}
											</div>
										</div>
									</form>
								</div>
								<!-- like component -->
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<form method="POST" action="?/comment" use:enhance>
			<Input {form} name="comment" label="Add a comment" />
			<input type="hidden" name="type" value="event" />
			<input type="hidden" name="eventCommentId" value="new" />
			<Button type="submit">Submit</Button>
			<!-- <Picker /> -->
		</form>
	</Page>
{/if}
