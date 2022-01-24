export {default as NAVER } from "./naver";

export const STORAGE_KEY = 'point-collector';
export const EXTENSION_ID = 'fnjnbigaldpfibknjoadnjlccokggkln';

export const FAVICON_URL = (domain) => {
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=19&url=${domain}`
}
