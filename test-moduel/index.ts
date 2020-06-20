import * as pluralize from 'pluralize';
import { a } from './src/index';

/**
 * @Method: Returns the plural form of any noun.
 * @Param: {string}
 * @Return: {string}
 */
export function getPlural(str: any): string {
  console.log(a);
  return pluralize.plural(str);
}
