
const ABSPATHREGEXP = /^(https?:)?\/\/\S/;

export function isAbsoluteUrl(url: string) {
    return ABSPATHREGEXP.test(url);
}
