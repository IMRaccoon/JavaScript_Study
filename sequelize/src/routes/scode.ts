import { Request, Response } from 'express';
import { ScodeTemp } from '../models';

export const scodeTempController = async (req: Request, res: Response) => {
  const { name, phone, address1, address2, shopId } = req.body;
  const barcode = Math.floor(Math.random() * 500).toString();
  try {
    await new ScodeTemp({
      barcode,
      name,
      phone,
      address1,
      address2,
      shopId,
    }).save();
  } catch (error) {
    return res.sendStatus(500);
  }
  return res.sendStatus(200);
};

export const scodeRegister = async (req: Request, res: Response) => {
  const { shopId, barcode } = req.body;

  ScodeTemp.findOne({ where: { shopId, barcode } })
    .then((_) => console.log(_.get()))
    .catch((_) => res.sendStatus(500));

  return res.sendStatus(200);
};
