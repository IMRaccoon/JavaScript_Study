import { Request, Response } from 'express';
import { Brand, Shop } from '../models';

export const signUpBrand = async (req: Request, res: Response) => {
  const { user_id, password, name } = req.body;

  try {
    let brand = new Brand({ userId: user_id, password, name });
    await brand.save();
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }

  return res.sendStatus(200);
};

export const signUpShop = async (req: Request, res: Response) => {
  const { user_id, password, root_id, name } = req.body;

  try {
    let brand = await Brand.findByPk(root_id);
    let shop = await new Shop({
      userId: user_id,
      password,
      name,
    }).save();

    await brand.$add('shop', shop);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }

  return res.sendStatus(200);
};

export const signInBrand = async (req: Request, res: Response) => {
  const { id, password } = req.body;

  const brand = await Brand.findByPk(id);
  brand.$get('shops').then(console.log);

  res.sendStatus(200);
};

export const signInShop = async (req: Request, res: Response) => {
  const { id, password } = req.body;

  const shop = await Shop.findByPk(id);
  shop.$get('brands').then(console.log);

  res.sendStatus(200);
};
