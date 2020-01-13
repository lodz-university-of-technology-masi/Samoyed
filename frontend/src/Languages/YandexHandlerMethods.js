export function httpGet(theUrl)
{
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

const translatorKey =  'trnsl.1.1.20200113T001347Z.da05fe3bfdc667ea.0fa6c688d13c416ed1cab21b1216064d4e6c7224';

export function detectLang (text)  {
    const response = `https://translate.yandex.net/api/v1.5/tr.json/detect?key=${translatorKey}&text=${text}`;
    let json = httpGet(response);
    let output = JSON.parse(json);
    //console.log(output);
    return output.lang;

}

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
    console.log(possibilities);

}


