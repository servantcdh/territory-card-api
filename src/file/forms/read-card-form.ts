import * as ExcelJS from 'exceljs';
import { CreateCardContentDto } from 'src/card/dto/create-card-content.dto';
import { CreateCardDto } from 'src/card/dto/create-card.dto';
import { CreateCardTagDto } from 'src/card/dto/create-card-tag.dto';
import { UpdateCardDto } from 'src/card/dto/update-card.dto';
import { Card } from 'src/card/entities/card.entity';

export const REGEX_HASHTAG = /(#+[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9(_)]{1,})/;

export const readCardForm = async (
  file: Express.Multer.File,
): Promise<ReadCardFromExcel> => {
  const wb = new ExcelJS.Workbook();
  const workbook = await wb.xlsx.load(file.buffer);
  const worksheet = workbook.getWorksheet(1);

  // Card Dto Data
  const idx = +worksheet.getCell('B1').value;
  const name = worksheet.getCell('B2').value.toString();
  const memo = worksheet.getCell('B3').value.toString();
  const status = true;
  const createCard: CreateCardDto = { name, memo };
  const updateCard: UpdateCardDto = { idx, status, ...createCard };
  const card: Card = { ...createCard, idx, status };

  // CardTag Dto Data
  const tags = memo
    .split(' ')
    .filter((word) => REGEX_HASHTAG.test(word))
    .map((word) => word.substring(word.indexOf('#')));
  const createCardTag: CreateCardTagDto[] = tags.map((tag) => ({ tag }));

  // CardContent Dto Data
  const createCardContent: CreateCardContentDto[] = [];
  worksheet.eachRow((row, number) => {
    if (number > 4) {
      const street = row.getCell(1).toString();
      const building = row.getCell(2).toString();
      const name = row.getCell(3).toString();
      const phone = row.getCell(4).toString();
      const refusal = row.getCell(5).toString().length === 1;
      if (street || building) {
        createCardContent.push({
          card,
          street,
          building,
          name,
          phone,
          refusal,
        });
      }
    }
  });

  return {
    card,
    createCard,
    updateCard,
    createCardTag,
    createCardContent,
  };
};

export interface ReadCardFromExcel {
  card: Card;
  createCard: CreateCardDto;
  updateCard: UpdateCardDto;
  createCardTag: CreateCardTagDto[];
  createCardContent: CreateCardContentDto[];
}
