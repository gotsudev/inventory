import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = process.env.NEXT_PASSWORD_USER;
  if (!password) {
    throw new Error(
      'La variable de entorno NEXT_PASSWORD_USER no está establecida'
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: 'surtihogar@admin.com',
      name: 'Surtihogar Renovar',
      password: hashedPassword
    }
  });

  console.log('Usuario inicial creado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
