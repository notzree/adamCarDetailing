// lib/prisma.ts
// import { PrismaClient } from '@prisma/client';

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//  prisma = global.prisma;
// }

// export default prisma;

import { PrismaClient } from '@prisma/client'

const globalForPrisma = global 

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

