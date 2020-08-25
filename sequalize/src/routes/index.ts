import { Router } from 'express';
import * as account from './account';
import * as scode from './scode';

const router = Router();

router.post('/account/brand/signup', account.signUpBrand);
router.post('/account/shop/signup', account.signUpShop);
router.post('/account/brand/signin', account.signInBrand);
router.post('/account/shop/signin', account.signInShop);

router.post('/scode/temp', scode.scodeTempController);
router.post('/scode/register', scode.scodeRegister);

export default router;
