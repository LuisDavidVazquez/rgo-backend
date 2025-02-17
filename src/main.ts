import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  dotenv.config(); // Carga las variables de entorno desde el archivo .env
  const port = process.env.PORT || 3001;

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuración de CORS
  const corsOptions = {
    //  origin: ['*'],
    origin: [
      'http://rastreogo.dev.s3-website.us-east-2.amazonaws.com',
      'http://localhost:5006',
      'http://localhost:4200', // Asumiendo que este es tu puerto de desarrollo local

      'https://app.rastreogo.com'
    ],
    //origin: ['*'],

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  // Habilitar CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Esto permite que cualquier dominio acceda al servidor.
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS'); // Métodos permitidos
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Cabeceras permitidas
    next();
  });
  app.enableCors(corsOptions);


  const config = new DocumentBuilder()
    .setTitle('RastreoGo API')
    .setDescription('API para la gestión de usuarios, sims, y más')
    .setVersion('1.0')
    .addTag('usuarios')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port, () => {
    // console.log('Server running on port ' + port);
  });


}
bootstrap();
