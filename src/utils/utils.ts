import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getStorage = (key: string) => {
  let val = localStorage.getItem(key);
  try {
    val && (val = JSON.parse(val));
  } finally {
    return val;
  }
};
export const setStorage = (key: string, value?: any) => {
  let str = '';
  try {
    value && (str = JSON.stringify(value));
  } finally {
    localStorage.setItem(key, str);
  }
};
