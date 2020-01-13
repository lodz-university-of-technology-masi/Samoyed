export function httpGet(theUrl)
{
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

const TranslatorKey =  'trnsl.1.1.20200113T001347Z.da05fe3bfdc667ea.0fa6c688d13c416ed1cab21b1216064d4e6c7224';


export function detectLang (text)  {
    const response = `https://translate.yandex.net/api/v1.5/tr.json/detect?key=${TranslatorKey}&text=${text}`;
    let json = httpGet(response);
    let output = JSON.parse(json);
    //console.log(output);
    return output.lang;

}


