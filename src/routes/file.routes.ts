import { Application, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { uuid } from 'uuidv4';

import FileController from '../controllers/file.controller';

export default class FileRoutes {
  private fileController: FileController = new FileController();

  public route(app: Application) {
    /**
     * Store video
     */
    const videoStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'files');
      },
      filename: (req, file, cb) => {
        const newFilename = `${uuid()}${path.extname(file.originalname)}`;
        cb(null, newFilename);
      }
    });

    /**
     * Upload video
     */
    const videoUpload = multer({
      storage: videoStorage,
      limits: {
        fileSize: 10000000 // 10000000 Bytes = 10 MB
      },
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|MPEG-4|mov)$/)) {
          return cb(new Error('Please upload a video'));
        }
        cb(null, true);
      }
    });

    app.post('/api/upload', videoUpload.single('file'), (req: Request, res: Response) => {
      this.fileController.uploadNewFile(req, res);
    });

    app.get('/api/files/:id', (req: Request, res: Response) => {
      this.fileController.getFileById(req, res);
    });

    app.get('/api/files', (req: Request, res: Response) => {
      this.fileController.getFiles(req, res);
    });
  }
}
