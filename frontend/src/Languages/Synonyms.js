import {httpGet, detectLang} from './YandexHandlerMethods'


let dictionaryKey = 'dict.1.1.20200109T012204Z.51919f04f8ff840e.c6b9dc7ca3cae0772e01a50cd495491e0f8a686b'

function getSelectedText() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      // eslint-disable-next-line
      (activeElTagName === "textarea") || (activeElTagName === "input" && /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}


function lookForWords(text, lan) {

    text=text.trim();

   // let yandex_dictionary_key = 'dict.1.1.20200109T012204Z.51919f04f8ff840e.c6b9dc7ca3cae0772e01a50cd495491e0f8a686b'
    let lang = lan+'-ru'
    let response = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key='+dictionaryKey+'&lang='+lang+'&text='+text;
    //let response = $get('https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key='+yandex_dictionary_key+'&lang=en-ru&text='+text, function(result){ return document.getElementById("result").innerHTML.result.text})
    let json = httpGet(response);
    let output = JSON.parse(json);

    let syn = [];

    if(output.def){
        for(let i =0; i!== output.def.length; i++){
            if(output.def[i].tr){
                for(let j = 0; j!== output.def[i].tr.length; j++){
                    if(output.def[i].tr[j].mean){
                        let mean = output.def[i].tr[j].mean;
                        if(Array.isArray(mean)){
                            for(let k = 0; k !== mean.length; k++)
                               syn.push(mean[k].text)
                        }
                        else syn.push(mean.text)
                    
                    }
                  
                }
            }
            
        }
    }

    return syn;

}

export default function monitorSynonyms(id){
    document.onmouseup = document.onkeyup = document.onselectionchange = function() {
        document.getElementById(id).value = getSelectedText();
        let input = getSelectedText();
        const lang = detectLang(input)
        let syn = lookForWords(input, lang);
      //  console.log(syn);
        setTimeout(2000);
        return syn;
      };
}