import { prisma } from '$lib/server/prisma'
import { error } from '@sveltejs/kit'
import Blw from './Blw'
import { Prisma } from '@prisma/client'

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

export const Populate = ({ data, userId, file, orgId }) => {
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

	function racesCreate() {
		// this should maybe hit a createMany
		return blw.getRaces(uniqueIdString).map((race) => {
			return {
				...race
				// Comps: {
				// 	connect: compList
				// },
				// Event: {
				// 	connect: { uniqueIdString: uniqueIdString }
				// },
				// Publisher: {
				// 	connect: { id: userId }
				// }
			}
		})
	}

	function compsCreate() {
		return blw.getComps().map((comp) => {
			// need to connect event somehow, because a comp can have multiple events
			return {
				compId: comp.compId,
				club: comp.club,
				boat: comp.boat,
				skipper: comp.helmname,
				fleet: comp.fleet,
				division: comp.division,
				rank: comp.rank,
				nett: comp.nett,
				total: comp.total,
				rest: comp
				// Events: {
				// 	connect: [{ uniqueIdString: uniqueIdString }]
				// },
				// Publisher: {
				// 	connect: { id: userId }
				// }
			}
		})
	}

	function resultsCreate() {
		// return blw.getResults(race.raceId).map((result) => {
		// console.log('blw.getResults ', blw.getResults(''))
		return blw.getResults('').map((result) => {
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
				ratingWin: result.ratingWin

				// Publisher: {
				// 	connect: { id: userId }
				// }
				// Event: {
				// 	connect: { uniqueIdString: event.uniqueIdString }
				// },
				// Comp: {
				// 	connect: { compId: result.compId }
				// },
				// Race: {
				// 	connect: { uniqueRaceString: race.uniqueRaceString }
				// }
			}
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
		// console.log('resultsCreate(): ', resultsCreate())
		resultsCreate()
		try {
			await prisma.$transaction([
				prisma.event.upsert(eventCreate()),
				prisma.comp.createMany({ data: compsCreate() }),
				prisma.race.createMany({ data: racesCreate() }),
				prisma.result.createMany({ data: resultsCreate() })
			])
		} catch (error: any) {
			console.log('Import Error: ', error.message)
		}
	}
} // populate
