const fs=require('fs'); const assert=require('assert');
for(const f of ['index.html','style.css','app.js','README.md','data/data.js']) assert(fs.existsSync(f),f+' missing');
const html=fs.readFileSync('index.html','utf8'), js=fs.readFileSync('app.js','utf8');
assert(html.includes('style.css')&&html.includes('app.js')); 
for(const x of ['renderLock','renderHome','renderControl','renderNotifications','renderSwitcher','messages','photos','camera','safari','notes','calendar','phone','settings']) assert(js.includes('function '+x),x+' missing');
console.log('OK: core project files and render modules are present.');
