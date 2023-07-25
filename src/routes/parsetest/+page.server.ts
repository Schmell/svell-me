import type { PageServerLoad } from './$types'

export const load = (async () => {
	return {}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData())
		console.log('formData: ', formData)
	}
}
