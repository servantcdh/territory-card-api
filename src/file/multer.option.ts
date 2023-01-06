import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export const multerOptionFactory = (): MulterOptions => {
  return {
    fileFilter: (_, file, callback) => {
      if (file.originalname.match(/\.(xlsx)$/)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('지원하는 파일이 아닙니다.'), false);
      }
    },
    storage: memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  };
};
