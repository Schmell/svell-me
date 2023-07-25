import { prisma } from '$lib/server/prisma'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
	const getComps = async () => {
		try {
			return await prisma.comp.findMany({
				where: {
					Events: { every: { id: params.eventId } }
				},
				orderBy: [
					{
						boat: 'asc'
					}
				]
			})
		} catch (error) {
			console.error('error: ', error)
		}
	}

	return {
		comps: getComps()
	}
}) satisfies PageServerLoad
