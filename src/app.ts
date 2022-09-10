import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response, Router } from 'express';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Controller } from './common/interfaces';
import { port } from './config';
import { logger } from './lib/logger';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { loggingMiddleware } from './middlewares/logging.middleware';

export default class App {
  private app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen(): void {
    this.app.listen(port, () => {
      logger.info(`Server stating on port ${port}`);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }

  private initializeMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    // this.app.use(hpp()); Block when sending an array as a query string
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cookieParser());
    this.app.use(cors({ origin: '*' }));
    this.app.use(loggingMiddleware);
    this.app.use(authMiddleware);
    this.app.get('/health-check', (req: Request, res: Response) => {
      res.send('ok');
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'Express Boilerplate',
          version: '1.0.0',
          description: 'This is the express api server documentation.',
        },
        host: 'localhost:3300',
        basePath: '/api',
      },
      apis: [
        './src/swagger/schema/*',
        './src/swagger/api/**/*.yaml',
        './src/swagger/tag/*',
      ],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeControllers(controllers: Controller[]) {
    const router = Router();

    controllers.forEach((controller) => {
      router.use(controller.router);
    });

    this.app.use('/api', router);
  }
}
