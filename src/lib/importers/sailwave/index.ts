import { prisma } from '$lib/server/prisma'
import { error } from '@sveltejs/kit'
import Blw from './Blw'
import { setFlash } from 'sveltekit-flash-message/server'
import { messages } from '$lib/stores/messages'
// import { Prisma } from '@prisma/client'

interface CreateEventProps {
	data: any
	userId: string
	file: any
	orgId: string
}

export async function CheckForDuplicates({ data, userId, file, orgId }) {
	const blw = new Blw({ data, file })
	const event = blw.getEvent()
	const usid =
		event.name.split(' ').join('_') +
		'-' +
		event.eventeid +
		'-' +
		event.venueName.split(' ').join('_')

	return await prisma.event.findUnique({
		where: { uniqueIdString: usid }
	})
}

export function CreateEvent({ data, userId, file, orgId }: CreateEventProps) {
	// use prisma create here..
	// but can we still connect??
	// figure out a way to unique -ish comps
}

export async function Populate({ data, userId, file, orgId, input }) {
	// so upsert is easy but this doesn't make sense.
	// people will either be creating, updating or overwritting
	// ??????? could have Duplicate problems by using this method
	// also cuurently not supporting updating at all

	// no file so exit
	if (!data) throw error(400, { message: 'Populate function requires data' })

	// Make new Blw class
	const blw = new Blw({ data, file })
	const event = blw.getEvent()
	const { eventeid, uniqueIdString } = event
	const blwComps = blw.getComps()

	// The query needs to be broken into smaller chunkcs to work in serverless
	// Instead of one big upsert we need to check for duplicates first
	// we can probably add the first chunk easy with event, org, venue which are all flat
	// Not to sure how to do the races as i had comps and results nested

	function eventCreate() {
		const eventObj = {
			...event,

			Publisher: {
				connect: { id: userId }
			},
			Organization: {
				connect: { id: orgId }
			},
			Venue: {
				connectOrCreate: {
					where: { name: event.venueName },
					create: {
						name: event.venueName,
						email: event.rest.venueemail,
						website: event.rest.venuewebsite,
						burgee: event.rest.venueburgee,
						Publisher: { connect: { id: userId } }
					}
				}
			}
		}
		return {
			// data: upObj
			where: { uniqueIdString: uniqueIdString },
			update: {},
			create: eventObj
		}
	}

	async function racesCreate() {
		//
		const compList = await blwComps.map((comp) => {
			return { compId: comp.compId }
		})
		// console.log('compList: ', compList)

		return await blw.getRaces(uniqueIdString).map((race) => {
			return {
				where: { uniqueRaceString: race.uniqueRaceString },
				update: {},
				create: {
					...race,
					Comps: {
						connect: compList
					},
					Event: {
						connect: { uniqueIdString: uniqueIdString }
					},
					Publisher: {
						connect: { id: userId }
					}
				}
			}
		})
	}

	async function compsCreate() {
		return await blw.getComps().map((comp) => {
			// need to connect event somehow, because a comp can have multiple events
			return {
				where: { compId: comp.compId },
				update: {
					club: comp.club,
					boat: comp.boat,
					skipper: comp.helmname,
					fleet: comp.fleet,
					division: comp.division,
					rank: comp.rank,
					nett: comp.nett,
					total: comp.total,
					rest: comp,
					Events: {
						connect: [{ uniqueIdString: uniqueIdString }]
					}
				},
				create: {
					compId: comp.compId,
					club: comp.club,
					boat: comp.boat,
					skipper: comp.helmname,
					fleet: comp.fleet,
					division: comp.division,
					rank: comp.rank,
					nett: comp.nett,
					total: comp.total,
					rest: comp,
					Events: {
						connect: [{ uniqueIdString: uniqueIdString }]
					},
					Publisher: {
						connect: { id: userId }
					}
				}
			}
		})
	}

	async function resultsCreate() {
		// const races = blw.getComps()
		return blw.getRaces(uniqueIdString).map((race) => {
			return blw.getResults(race.raceId).map((result) => {
				// console.log('result.compId: ', result.compId)
				// console.log('race.uniqueRaceString: ', race.uniqueRaceString)
				//  Note convert to numbers
				return {
					resultId: result.resultId,
					points: result.points,
					finish: result.finish,
					start: result.start,
					position: result.position,
					discard: result.discard,
					elasped: result.elasped,
					corrected: result.corrected,
					resultType: result.resultType,
					elapsedWin: result.elapsedWin,
					ratingWin: result.ratingWin,

					Publisher: {
						connect: { id: userId }
					},
					Event: {
						connect: { uniqueIdString: event.uniqueIdString }
					},
					Comp: {
						connect: { compId: result.compId }
					},
					Race: {
						connect: { uniqueRaceString: race.uniqueRaceString }
					}
				}
			})
		})
	}

	function upsertObj() {
		const upObj = {
			...event,

			Publisher: {
				connect: { id: userId }
			},
			Organization: {
				connect: { id: orgId }
			},
			Venue: {
				connectOrCreate: {
					where: { name: event.venueName },
					create: {
						name: event.venueName,
						email: event.rest.venueemail,
						website: event.rest.venuewebsite,
						burgee: event.rest.venueburgee
					}
				}
			},

			Races: {
				create: blw.getRaces(uniqueIdString).map((race) => {
					return {
						...race,
						Publisher: {
							connect: { id: userId }
						},
						Comps: {
							connectOrCreate: blw.getComps().map((comp) => {
								return {
									where: { compId: comp.compId },
									create: {
										compId: comp.compId,
										club: comp.club,
										boat: comp.boat,
										skipper: comp.helmname,
										fleet: comp.fleet,
										division: comp.division,
										rank: comp.rank,
										nett: comp.nett,
										total: comp.total,
										rest: comp,
										// should be Events
										// Events:
										Publisher: {
											connect: { id: userId }
										}
									}
								}
							})
						},
						Results: {
							create: blw.getResults(race.raceId).map((result) => {
								//  Note convert to numbers
								return {
									resultId: result.resultId,
									points: result.points,
									finish: result.finish,
									start: result.start,
									position: result.position,
									discard: result.discard,
									elasped: result.elasped,
									corrected: result.corrected,
									resultType: result.resultType,
									elapsedWin: result.elapsedWin,
									ratingWin: result.ratingWin,

									Publisher: {
										connect: { id: userId }
									},
									Event: {
										connect: { uniqueIdString: event.uniqueIdString }
									},
									Comp: {
										connect: { compId: result.compId }
									}
								}
							})
						}
					}
				})
			}
		}
		return {
			// data: upObj
			where: { uniqueIdString: uniqueIdString },
			update: {},
			create: upObj
		}
	}

	function delay(t) {
		return new Promise((resolve) => setTimeout(resolve, t))
	}

	addTables()

	async function addTables() {
		try {
			// await prisma.event.upsert(upsertObj())
			const comps = await compsCreate()
			const races = await racesCreate()
			const resultsArray = await resultsCreate()
			console.log('Start import')
			console.time('time: ')
			// setFlash({ type: 'success', message: 'Importing started' }, input)
			messages.update(() => {
				return { message: 'Importing started' }
			})

			await prisma.event.upsert(eventCreate())
			console.timeLog('time: ', 'event comlpete: ')

			messages.update(() => {
				return { message: 'Event complete' }
			})

			await Promise.all(
				comps.map(async (comp) => {
					return await prisma.comp.upsert(comp)
				})
			)

			messages.update(() => {
				return { message: 'Comps complete' }
			})

			console.timeLog('time: ', 'comps complete')
			await Promise.all(
				races.map(async (race) => {
					return await prisma.race.upsert(race)
				})
			)

			messages.update(() => {
				return { message: 'Races complete' }
			})

			console.timeLog('time: ', 'races comlpete: ')

			await Promise.all(
				resultsArray.map(async (results) => {
					results.map(async (result) => {
						await prisma.result.create({ data: result })
					})
				})
			)

			messages.update(() => {
				return { message: 'Import complete' }
			})

			console.timeLog('time: ', 'results comlpete: ')
			console.timeEnd('time: ')
		} catch (error: any) {
			console.log('Import Error: ', error.message)
		}
	}
} // populate
