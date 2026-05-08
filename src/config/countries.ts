/**
 * 国家配置统一管理
 */

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  currency: string;
  language: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    currency: 'USD',
    language: 'en-US',
    flag: new URL('@/assets/imgs/country/de.png', import.meta.url).href,
  },
  {
    code: 'BR',
    name: 'Brazil',
    dialCode: '+55',
    currency: 'BRL',
    language: 'pt-BR',
    flag: new URL('@/assets/imgs/country/br.png', import.meta.url).href,
  },
];
