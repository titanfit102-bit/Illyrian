const fs=require('node:fs'),vm=require('node:vm');
for(const f of fs.readdirSync('demo').filter(x=>x.endsWith('.js')))new vm.Script(fs.readFileSync('demo/'+f,'utf8'),{filename:f});
const html=fs.readFileSync('demo/ILLYRIAN_DEMO_v1.7.html','utf8');
for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
const vendored=fs.readFileSync('demo/i18n/vendor/i18next.min.js');
if(!vendored.equals(fs.readFileSync('security/node_modules/i18next/dist/umd/i18next.min.js')))throw Error('Vendored i18next differs from audited package');
console.log('PASS: JS parses; served i18next equals locked audited npm distribution');
