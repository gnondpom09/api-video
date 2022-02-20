import { Request, Response } from 'express';
import fileService from '../services/file.service';

export default class FileController {
  private fileService: fileService = new fileService();

  /**
   * Upload new file
   * @param req
   * @param res
   */
  public uploadNewFile(req: Request, res: Response) {
    if (req.body) {
      res.status(200).send({ message: 'File Uploaded', code: 200 });
    } else {
      res.status(400).send({ error: true, message: 'datas of file must be passed' });
    }
  }

  /**
   * Get complete list of files
   * @param req
   * @param res
   */
  public async getFiles(req: Request, res: Response) {
    const files: any[] = await this.fileService.getFiles();
    if (files && files.length > 0) {
      res.status(200).json({ data: files, message: 'Get request successfull' });
    } else {
      res.status(204).json({ message: 'No files to return' });
    }
  }

  /**
   * Get file by Id
   * @param req
   * @param res
   */
  public async getFileById(req: Request, res: Response) {
    if (req.params) {
      const id = req.params.id;
      const file = await this.fileService.getFileById(id);
      res.status(200).json({ data: file, message: 'Get request successfull' });
    } else {
      res.status(400).send({ error: true, message: 'datas of file must be passed' });
    }
  }
}
