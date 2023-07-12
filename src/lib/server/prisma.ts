import { PrismaClient } from '@prisma/client'
import { env } from '$env/dynamic/private'

const prisma = global.__prisma || new PrismaClient({ log: ['info', 'warn', 'error'] })

if (env.NODE_ENV === 'development') {
	global.__prisma = prisma
}

export { prisma }
