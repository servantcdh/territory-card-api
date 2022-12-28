import * as fs from 'fs';
import createReport from 'docx-templates';
import { TerritoryRecord } from 'src/record/entities/territory-record.entity';
import { StreamableFile } from '@nestjs/common';

export const getS13 = async (territoryRecord: TerritoryRecord[]) => {
  try {
    // TODO: 다섯 번째 카드 기록 부터는 다음 페이지로 넘어가도록 구현
    const template = fs.readFileSync('static/S-13_KO_template.docx');

    const records = territoryRecord.map((record) => {
      const contents = [];
      record.territoryRecordContent.forEach((c, i) => {
        if (i < 4) {
          contents.push(c);
        }
      });
      for (let i = 0; i < 4; i++) {
        if (!contents[i]) {
          contents.push({
            dateAssigned: '',
            dateCompleted: '',
            user: {
              name: '',
            },
          });
        }
      }
      return {
        ...record,
        territoryRecordContent: contents,
      };
    });
    const data = {
      serviceYear: territoryRecord[0].serviceYear,
      territoryRecord: records,
    };

    const s13 = await createReport({
      template,
      data: {
        data,
      },
    });

    return new StreamableFile(s13);
  } catch (e) {
    console.log(e.message);
    // throw new NotFoundException('s-13 워드 템플릿 확인 필요');
  }
};
