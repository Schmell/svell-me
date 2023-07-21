import { prisma } from '$lib/server/prisma'
import { error, fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
	async function getVenue() {
		try {
			return await prisma.venue.findUniqueOrThrow({
				where: { id: params.venueId },
				include: { Events: true, Publisher: true }
			})
		} catch (error) {
			console.log('error: ', error)
			throw fail(404, {})
		}
	}
	return {
		venue: getVenue()
	}
}) satisfies PageServerLoad
