import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  tmpFolder: string;
  uploadFolder: string;
}

export default {
  tmpFolder,
  uploadFolder: path.resolve(tmpFolder, 'uploads'),
} as IUploadConfig;