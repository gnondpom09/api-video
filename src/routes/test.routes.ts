import { Application, Request, Response } from 'express';

export default class TestRoutes {
  public route(app: Application) {
    // test get
    app.get('/api/test', (req: Request, res: Response) => {
      res.status(200).json({ message: 'Get request successfull' });
    });

    // test post
    app.post('/api/test', (req: Request, res: Response) => {
      res.status(200).json({ message: 'Post request successfull' });
    });
  }
}
