import en from './en';
import ru from './ru';


export const getLocale = (locale: string)=>{

  if(locale.toLowerCase().includes('ru')){
    return ru;
  }

  return en;
}
