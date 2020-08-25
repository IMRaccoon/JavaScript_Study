import { Sequelize } from 'sequelize-typescript';
import Brand from './brand.model';
import BrandProduct from './brandProduct.model';
import Parcel from './parcel.model';
import Shop from './shop.model';
import Scode from './scode.model';
import ShopOrder from './shopOrder.model';
import ScodeTemp from './scodeTemp';
import * as fs from 'fs';
import * as path from 'path';

function dbConfig() {
  const data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../config/config.json'), 'utf-8'),
  );

  return new Sequelize({
    ...data[process.env.NODE_ENV ?? 'development'],
    models: [__dirname + '**/*.model.ts'],
  });
}

export {
  Brand,
  BrandProduct,
  Parcel,
  Shop,
  Scode,
  ShopOrder,
  ScodeTemp,
  dbConfig,
};
