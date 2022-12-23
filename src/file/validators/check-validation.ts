import { BadRequestException } from '@nestjs/common';

export const checkDto = <T>(d: T | T[], required: string[]) => {
  let specimen: T[] = [];
  if (!Array.isArray(d)) {
    specimen = [d];
  } else {
    specimen = d;
  }
  specimen.forEach((dto) => {
    const invalidKeys = Object.keys(dto).filter((key) => {
      if (!required.includes(key)) {
          return false;
      }
      return !dto[key].toString().trim();
    });
    if (invalidKeys.length) {
      throw new BadRequestException(`필수 입력 값이 없음: ${invalidKeys.join(', ')}`);
    }
  });
};

