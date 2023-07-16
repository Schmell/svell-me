import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
	//   const alice = await prisma.user.upsert({
	//     where: { username: 'sheldon' },
	//     update: {},
	//     create: {
	//       email: 'sheldon.street@gmail.com',
	//       name: 'Sheldon Street',
	//     },
	//   })
	//   console.log({ alice})
}
main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
