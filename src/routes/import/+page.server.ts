import type { Actions, PageServerLoad } from '../$types'
import { error, redirect } from '@sveltejs/kit'
import { CheckForDuplicates, Populate } from '$lib/importers/sailwave'

import pkg from 'papaparse'
const { parse } = pkg
import { prisma } from '$lib/server/prisma'
import { goto } from '$app/navigation'

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate()
	// If not logged in redirect
	if (!session) {
		throw redirect(302, '/')
	}
	// const events = await prisma.event.findMany({ include: { Publisher: true } })
	const orgs = await prisma.organization.findMany({
		where: { ownerId: session.userId }
	})
	return {
		// events,
		orgs
	}
}

export const actions: Actions = {
	default: async (input) => {
		const { request, locals, params, cookies } = input
		const fd = await request.formData()

		const { org, file }: any = Object.fromEntries(fd)

		//  TODO:
		// Impement multiple file upload

		//  TODO:
		// check for duplicates etc.. before

		const texted = await file.text()
		console.log('texted: ', texted)
		parse(texted, {
			complete: async (results) => {
				console.log('complete: papaparse')
				const uid = await input.locals.validate()
				const duplicates = await CheckForDuplicates({
					data: results.data,
					userId: uid?.userId,
					file: file,
					orgId: org
				})

				if (duplicates !== null) {
					console.log('duplicates: ', duplicates)
				}
				console.log('results.data: ', results.data)
				Populate({ data: results.data, userId: uid?.userId, file: file, orgId: org })
			},
			error: (status, err) => {
				// TODO
				console.log('import error: ', status, err)
				throw error(418, `error from import server ts ${err}`)
			}
		})
		// })
		// history.back()
		// goto('/events')
		console.log('redirect: ', redirect)
		throw redirect(300, '/events')
		// return { status: 201 }
	}
}
