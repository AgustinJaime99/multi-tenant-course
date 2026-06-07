import { PrismaClient, Role, CourseStatus, PurchaseStatus, PaymentProvider, PaymentStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("Admin1234", 10);
  const userPass = await bcrypt.hash("User1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Admin Demo",
      email: "admin@demo.com",
      passwordHash: adminPass,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {},
    create: {
      name: "Alumno Demo",
      email: "user@demo.com",
      passwordHash: userPass,
      role: Role.USER,
    },
  });

  // Curso inicial de barbería
  const course = await prisma.course.upsert({
    where: { slug: "barberia-profesional" },
    update: {},
    create: {
      slug: "barberia-profesional",
      title: "Barbería Profesional de Cero a Experto",
      subtitle: "Domina cortes, fades, barba y montá tu propio negocio",
      description:
        "Curso completo de barbería profesional: técnicas, herramientas, fades, diseño de barba y gestión de tu marca personal.",
      coverImage: "/images/course-cover.jpg",
      priceCents: 9900,
      currency: "USD",
      status: CourseStatus.PUBLISHED,
      modules: {
        create: [
          {
            title: "Fundamentos de la Barbería",
            order: 1,
            lessons: {
              create: [
                { title: "Bienvenida y herramientas esenciales", order: 1, durationMin: 8, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                { title: "Higiene, bioseguridad y postura", order: 2, durationMin: 12, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                { title: "Anatomía del cabello y tipos de rostro", order: 3, durationMin: 15, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
              ],
            },
          },
          {
            title: "Técnicas de Corte",
            order: 2,
            lessons: {
              create: [
                { title: "Uso de máquina y peines", order: 1, durationMin: 18, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                { title: "Fade clásico paso a paso", order: 2, durationMin: 22, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                { title: "Skin fade y degradados", order: 3, durationMin: 25, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
              ],
            },
          },
          {
            title: "Barba y Negocio",
            order: 3,
            lessons: {
              create: [
                { title: "Diseño y perfilado de barba", order: 1, durationMin: 16, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                { title: "Atención al cliente y fidelización", order: 2, durationMin: 14, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                { title: "Cómo montar tu barbería y marca", order: 3, durationMin: 20, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
              ],
            },
          },
        ],
      },
    },
    include: { modules: { include: { lessons: true } } },
  });

  // Compra activa demo para el usuario
  const existing = await prisma.purchase.findFirst({
    where: { userId: user.id, courseId: course.id },
  });

  if (!existing) {
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: PurchaseStatus.ACTIVE,
        provider: PaymentProvider.STRIPE,
        startedAt: new Date(),
      },
    });

    await prisma.payment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        purchaseId: purchase.id,
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.APPROVED,
        amountCents: course.priceCents,
        currency: course.currency,
        externalId: "seed_demo_payment",
      },
    });

    // Progreso parcial: completa la primera lección
    const firstLesson = course.modules[0]?.lessons[0];
    if (firstLesson) {
      await prisma.progress.create({
        data: { userId: user.id, lessonId: firstLesson.id },
      });
    }
  }

  console.log("Seed completado:");
  console.log("  Admin: admin@demo.com / Admin1234");
  console.log("  User:  user@demo.com / User1234");
  console.log(`  Curso: ${course.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
