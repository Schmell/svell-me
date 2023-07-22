import { prisma } from '$lib/server/prisma'
import type { PageServerLoad, Actions } from './$types'

export const load = (async ({ params, locals }) => {
	// console.log('params: ', params)
	const user = await locals.validateUser()
	const getEvent = async () => {
		try {
			return await prisma.event.findUniqueOrThrow({
				where: { id: params.eventId },
				select: {
					id: true,
					name: true,
					description: true,
					titleImage: true,
					venueId: true,
					venueName: true,
					publisherId: true,
					eventwebsite: true,
					_count: { select: { comments: true } },
					comments: { select: { User: { select: { avatar: true, username: true } } }, take: 10 }
				}

				// This would be easier and only one transactiion, but can't be lasy loaded
				// include: { comments: true }
			})
		} catch (error) {
			console.log('error: ', error)
		}
	}
	const getComments = async () => {
		try {
			return await prisma.eventComment.findMany({
				where: { eventId: params.eventId },
				// _count: true,
				include: {
					User: {
						select: { avatar: true, username: true, id: true }
					},
					_count: {
						select: { likes: true }
					},
					likes: { where: { userId: user.user?.userId }, select: { userId: true, id: true } }
				},
				orderBy: {
					createdAt: 'desc'
				}
			})
		} catch (error) {
			console.log('error: ', error)
		}
	}
	return {
		event: getEvent(),
		comments: getComments()
	}
}) satisfies PageServerLoad

// const eventSchema = z.object({
// 	name: z.string().min(1).max(64).trim(),
// 	description: z.string().optional(),
// 	website: z.string().url().optional(),
// 	email: z.string().min(1).max(64).email(),
// 	titleImage: z.string().url().optional()
// })

export const actions = {
	like: async ({ request, params, locals }) => {
		const fd = await request.formData()
		const formData = Object.fromEntries(fd) as Record<string, string>
		console.log('formData: ', formData)
		const user = await locals.validateUser()

		try {
			return await prisma.like.create({
				data: {
					type: 'comment',
					eventComment: { connect: { id: formData.commentId } },
					User: { connect: { id: user.user?.userId } },
					Event: { connect: { id: params.eventId } }
				}
			})
		} catch (error) {
			console.log('error: ', error)
			return { error: 'error' }
		}
	},

	unlike: async ({ request, locals, params }) => {
		const fd = await request.formData()
		const formData = Object.fromEntries(fd) as Record<string, string>
		const user = await locals.validateUser()
		console.log('formData: ', formData)
		try {
			await prisma.like.delete({
				where: { id: formData.likeId }
			})
		} catch (error) {
			console.log('error: ', error)
		}
	},

	comment: async ({ request, locals, params }) => {
		const fd = await request.formData()

		const { comment, type, eventCommentId } = Object.fromEntries(fd)
		const user = await locals.validateUser()
		try {
			await prisma.eventComment.upsert({
				where: { id: eventCommentId as string },
				update: {
					comment: comment as string,
					type: type as string
				},
				create: {
					comment: comment as string,
					type: type as string,
					User: { connect: { id: user.user?.userId as string } },
					Event: { connect: { id: params.eventId } }
				}
			})
		} catch (error) {
			console.log('error: ', error)
		}
	}
} satisfies Actions
