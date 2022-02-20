import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import { CommonRoutes } from './routes/common.routes';
import FileRoutes from './routes/file.routes';
import TestRoutes from './routes/test.routes';

const PORT: number = 3030;

export default class App {
  public app: express.Application;

  private testRoutes: TestRoutes = new TestRoutes();

  private fileRoutes: FileRoutes = new FileRoutes();

  private commonRoutes: CommonRoutes = new CommonRoutes();

  public logger = '';

  constructor() {
    this.app = express();
    this.config();

    this.testRoutes.route(this.app);
    this.fileRoutes.route(this.app);
    this.commonRoutes.route(this.app);
  }

  private config(): void {
    const allowedOrigins = ['http://localhost:3000'];

    const options: cors.CorsOptions = {
      origin: allowedOrigins
    };
    this.app.use(cors(options));
    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  public listen() {
    this.app.listen(PORT, () => {
      console.log(`Server listen on port ${PORT}`);
    });
  }
}
