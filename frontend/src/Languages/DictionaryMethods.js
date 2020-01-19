export function httpGet(theUrl)
{
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

export const translatorKey =  'trnsl.1.1.20200113T001347Z.da05fe3bfdc667ea.0fa6c688d13c416ed1cab21b1216064d4e6c7224';
export const dictionaryKey = 'dict.1.1.20200109T012204Z.51919f04f8ff840e.c6b9dc7ca3cae0772e01a50cd495491e0f8a686b'

//returns the language the text is written
export function detectLang (text)  {
    const response = `https://translate.yandex.net/api/v1.5/tr.json/detect?key=${translatorKey}&text=${text}`;
    let json = httpGet(response);
    let input = JSON.parse(json);
    return input.lang;

}

//returns codded list of possible languages you can translate to
//USE possibleTranslations(detectLang(sample))
export function possibleTranslations(lang){
    const response = `https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${translatorKey}`;
    let json = httpGet(response);
    let input = JSON.parse(json);
    let possibilities = [];

    if(input.dirs){
        for(let i = 0; i < input.dirs.length; i++) {
           if((input.dirs[i].indexOf(lang)) === 0)
               possibilities.push(input.dirs[i]);

        }
    }

    let languages = [];
    for(let i = 0; i < possibilities.length; i++) {
        languages.push(possibilities[i].substring(3,5));
    }
    return languages;
}

//returns full name of the language with language's code as argument
export function fullName(lang) {
    const response = `https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${translatorKey}&ui=ms`;
    let json = httpGet(response);
    // eslint-disable-next-line
    let input = JSON.parse(json);
    let name;
    if(input.langs.hasOwnProperty(lang)){
        name = input.langs[lang];
    }

    return name;
}

