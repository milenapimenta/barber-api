import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const startPort = Number(process.env.PORT ?? 3000);
  const maxAttempts = 5;
  let port = startPort;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await app.listen(port);
      return;
    } catch (err: any) {
      if (err?.code === 'EADDRINUSE' && attempt < maxAttempts) {
        // eslint-disable-next-line no-console
        console.warn(`Port ${port} in use, trying ${port + 1}...`);
        port += 1;
        continue;
      }
      throw err;
    }
  }
}
bootstrap();
