import ffmpeg from 'fluent-ffmpeg';
import { VideoResolution } from '../models/video-resolution.enum';

const VIDEO_TRANSCODING_FPS = {
  MIN: 10,
  AVERAGE: 30,
  MAX: 60,
  KEEP_ORIGIN_FPS_RESOLUTION_MIN: 720
};

type TranscodeOptions = {
  inputPath: string;
  outputPath: string;
  resolution?: VideoResolution;
  isPortraitMode?: boolean;
};

export default class fileService {
  constructor() {}

  private getVideoFileStream(path: string) {
    return new Promise<any>((res, rej) => {
      ffmpeg.ffprobe(path, (err, metadata) => {
        if (err) return rej(err);

        const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
        if (!videoStream) throw new Error('Cannot find video stream of ' + path);

        return res(videoStream);
      });
    });
  }

  /**
   * Get complete list of files
   */
  public getFiles(): any[] {
    return [];
  }

  /**
   * Get file selected
   * @param id id of file
   */
  public getFileById(id: string): any {
    return {};
  }

  async getVideoFileResolution(path: string) {
    const videoStream = await this.getVideoFileStream(path);

    return {
      videoFileResolution: Math.min(videoStream.height, videoStream.width),
      isPortraitMode: videoStream.height > videoStream.width
    };
  }

  async getVideoFileFPS(path: string) {
    const videoStream = await this.getVideoFileStream(path);

    for (const key of ['r_frame_rate', 'avg_frame_rate']) {
      const valuesText: string = videoStream[key];
      if (!valuesText) continue;

      const [frames, seconds] = valuesText.split('/');
      if (!frames || !seconds) continue;

      const result = parseInt(frames, 10) / parseInt(seconds, 10);
      if (result > 0) return result;
    }

    return 0;
  }

  getDurationFromVideoFile(path: string) {
    return new Promise<number>((res, rej) => {
      ffmpeg.ffprobe(path, (err, metadata) => {
        if (err) return rej(err);
        const duration: number = metadata.format.duration || 0;

        return res(Math.floor(duration));
      });
    });
  }

  transcode(options: TranscodeOptions) {
    return new Promise<void>(async (res, rej) => {
      const fps = await this.getVideoFileFPS(options.inputPath);

      let command = ffmpeg(options.inputPath)
        .output(options.outputPath)
        .videoCodec('libx264')
        .outputOption('-movflags faststart');

      // Set player FPS limits
      if (fps > VIDEO_TRANSCODING_FPS.MAX) command = command.withFPS(VIDEO_TRANSCODING_FPS.MAX);
      else if (fps < VIDEO_TRANSCODING_FPS.MIN) command = command.withFPS(VIDEO_TRANSCODING_FPS.MIN);

      if (options.resolution !== undefined) {
        const size = options.isPortraitMode === true ? `${options.resolution}x?` : `?x${options.resolution}`;
        command = command.size(size);
      }

      command
        .on('error', (err: any, stdout: any, stderr: any) => {
          console.error('Error in transcoding job.', { stdout, stderr });
          return rej(err);
        })
        .on('end', res)
        .run();
    });
  }
}
