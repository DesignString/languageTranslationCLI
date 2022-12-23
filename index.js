const translate = require('@iamtraction/google-translate');
const prompt = require('prompt-sync')();


function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
  

const textValue = prompt('Enter the text : ') ?? 'Dummy Text';
const textCamelCase = camelize(textValue)
const textField = prompt(`Enter field name : ${textCamelCase} `,textCamelCase);

const languages = ['zh-CN','fr','hi','ru','tr','vi','en'];

const sleeper = (timer = 1000 )=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },timer)
    })
}
console.log('Generating translation...')

async function getAllTranslations(){
    const langs = {
        en:{[textField || textCamelCase]:textValue}
    }
    let timer = 700;
    if(textValue.length > 300 && textValue.length < 400){
        timer = 1000;
    }else if(textValue.length > 400 && textValue.length < 1000){
        timer = 1200;
    }
    else if(textValue.length > 1000){
        timer = 1500;
    }
    for (const lang of languages){
        // prevent rate limit for api
        await sleeper()
        translate(textValue, { from: 'en', to: lang }).then(res => {
            langs[lang] = {[textField]:res.text};
          }).catch(err => {
            console.error(err);
          });
    }
    return langs
}

getAllTranslations().then((rs)=>{
    console.log('Transalted Object',rs)
})