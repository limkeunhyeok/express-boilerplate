import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

export default class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
  }

  public listen(): void {
    const port = 3000;
    this.app.listen(port, () => {
      console.log(`Server stating on port ${port}`);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }

  private initializeMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cookieParser());
    this.app.use(cors({ origin: '*' }));
    this.app.get('/health-check', (req: Request, res: Response) => {
      res.send('ok');
    });
  }
}
