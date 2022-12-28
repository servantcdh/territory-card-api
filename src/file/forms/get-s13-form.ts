import * as fs from 'fs';
import createReport from 'docx-templates';
import { StreamableFile } from '@nestjs/common';

export const getS13 = async (territoryRecord: any[]) => {
  try {
    // TODO: 템플릿 반복문 수정 필요
    const template = fs.readFileSync('static/S-13_KO_template.docx');

    const docx: FormS13 = {
      serviceYear: territoryRecord[0].serviceYear,
      rows: [],
    };

    territoryRecord.forEach((record, rowIdx) => {
      const records = record.territoryRecordContent;
      records.forEach((trContent, contentIdx) => {
        const { user, dateAssigned, dateCompleted } = trContent;
        const { name: nameAssignedTo } = user;
        const content: ContentS13 = {
          nameAssignedTo,
          dateAssigned,
          dateCompleted,
        };
        if (contentIdx % 4 === 0) {
          docx.rows.push({
            cardIdx: record.card.idx,
            cardName: record.card.name,
            lastDateCompleted: record.lastDateCompleted,
            contents: [content],
          });
        } else {
          const contents = docx.rows[docx.rows.length - 1].contents;
          contents.push(content);
        }
      });
      const contents = docx.rows[docx.rows.length - 1].contents;
      for (let i = 0; i < 4; i++) {
        if (!contents[i]) {
          contents.push({
            nameAssignedTo: '',
            dateAssigned: '',
            dateCompleted: '',
          });
        }
      }
    });

    console.log(docx.rows);

    const s13 = await createReport({
      template,
      data: { docx },
    });

    return new StreamableFile(s13);
  } catch (e) {
    console.log(e.message);
    // throw new NotFoundException('s-13 워드 템플릿 확인 필요');
  }
};

export interface FormS13 {
  serviceYear: number;
  rows: RowS13[];
}

export interface RowS13 {
  cardIdx: number;
  cardName: string;
  lastDateCompleted: string;
  contents: ContentS13[];
}

export interface ContentS13 {
  nameAssignedTo: string;
  dateAssigned: string;
  dateCompleted: string;
}
