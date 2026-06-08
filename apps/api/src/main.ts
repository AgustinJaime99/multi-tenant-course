import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const allowedOrigins = [
    config.get<string>("frontendUrl"),
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, cb) => {
      // Allow server-to-server requests (no origin header)
      if (!origin) return cb(null, true);
      // Allow any Vercel preview/production URL for this project
      if (origin.endsWith(".vercel.app")) return cb(null, true);
      // Allow explicitly listed origins (localhost, configured frontendUrl)
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: undefined,
    maxAge: 0,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Course Platform API")
    .setDescription("API de la plataforma de cursos (white-label)")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  const port = config.get<number>("port") ?? 4000;
  await app.listen(port);
  logger.log(`API lista en http://localhost:${port}/api`);
  logger.log(`Swagger en http://localhost:${port}/api/docs`);
}

bootstrap();
