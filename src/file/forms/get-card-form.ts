import { BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { CardContent } from 'src/card/entities/card-content.entity';
import { Card } from 'src/card/entities/card.entity';

const PAPER_SIZE_A4 = 9;
const MAX_ROW_COUNT = 50;

export const getCardForm = async (
  res: Response,
  cardData?: [Card, CardContent[]],
) => {
  const isCard = !!cardData;
  if (isCard && cardData.length !== 2) {
    throw new BadRequestException(`엑셀 변환 실패: 카드 정보 부족`);
  }
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('카드', {
    pageSetup: {
      paperSize: PAPER_SIZE_A4,
    },
  });
  worksheet.columns = [
    { width: 15 }, // 도로명주소
    { width: 15 }, // 건물명 또는 동
    { width: 15 }, // 상호명 또는 호
    { width: 15 }, // 전화번호
    { width: 15 }, // 방문 거절 여부
  ];
  const topRows = [
    ['구역 번호', isCard ? cardData[0].idx : '', '', '', ''],
    ['구역 이름', isCard ? cardData[0].name : '', '', '', ''],
    ['메모', isCard ? cardData[0].memo : '', '', '', ''],
    [
      '도로명주소',
      '건물명 또는 동',
      '상호명 또는 호',
      '전화번호',
      '방문 거절 여부',
    ],
  ];
  worksheet.addRows(topRows);
  worksheet.mergeCells('B1:E1');
  worksheet.mergeCells('B2:E2');
  worksheet.mergeCells('B3:E3');

  worksheet.getCell('B1').numFmt = '@';

  // 주석
  worksheet.getCell(
    'B3',
  ).note = `해시태그는 #{단어} 형식으로 입력합니다.\n예) #차량필요`;

  // 시트 보호
  await worksheet.protect('1914', { insertRows: true });

  // 수정 가능 셀 지정
  worksheet.getCell('B2').protection = { locked: false };
  worksheet.getCell('B3').protection = { locked: false };

  // 구역 입력 행 추가
  let idx = topRows.length + 1;
  const makeRow = (cardContent: CardContent) => {
    const { street, building, name, phone, refusal } = cardContent;
    return [street, building, name, phone, refusal ? '예' : '아니오'];
  };
  for (let i = 0; i < (isCard ? cardData[1].length : MAX_ROW_COUNT); i++) {
    const row = isCard
      ? [...makeRow(cardData[1][i])]
      : ['', '', '', '', '아니오'];
    worksheet.addRow(row);
    worksheet.getCell(`A${idx}`).protection = { locked: false };
    worksheet.getCell(`B${idx}`).protection = { locked: false };
    worksheet.getCell(`C${idx}`).protection = { locked: false };
    const cell_phone = worksheet.getCell(`D${idx}`);
    cell_phone.protection = { locked: false };
    // 전화번호 문자열
    cell_phone.numFmt = '@';

    const cell_refusal = worksheet.getCell(`E${idx}`);
    cell_refusal.protection = { locked: false };
    // 방문 거절 여부 셀렉트박스
    cell_refusal.dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"예,아니오"'],
      error: '예 또는 아니오를 선택해야 합니다.',
      showErrorMessage: true,
    };
    idx++;
  }

  // 스타일
  worksheet.eachColumnKey((col) => (col.alignment = { horizontal: 'left' }));
  worksheet.getRow(1).border = { top: { style: 'thin' } };
  worksheet.getRow(3).height = 45;
  worksheet.getRow(3).alignment = { vertical: 'top' };
  worksheet.getRow(3).eachCell((cell, number) => {
    if (number <= 5) {
      cell.border = { bottom: { style: 'thin' } };
    }
  });
  worksheet.getRow(4).eachCell((cell) => (cell.font = { bold: true }));
  worksheet.getCell('A1').font = { bold: true };
  worksheet.getCell('A2').font = { bold: true };
  worksheet.getCell('A3').font = { bold: true };
  worksheet.getRow(MAX_ROW_COUNT + topRows.length).eachCell((cell, number) => {
    if (number <= 5) {
      cell.border = { bottom: { style: 'thin' } };
    }
  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + `card_${isCard ? cardData[0].idx : 'form'}.xlsx`,
  );

  await workbook.xlsx.write(res);

  res.end();
};
