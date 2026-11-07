import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,createContext} from 'node:vm';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const markup=read('index.html');
const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const elements=new Map();
function element(id){
 const classes=new Set();
 const listeners=new Map();
 return {
   id,style:{},dataset:{},firstChild:{textContent:''},textContent:'',innerHTML:'',attrs:{},
   classList:{
     add:x=>classes.add(x),remove:x=>classes.delete(x),
     contains:x=>classes.has(x),
     toggle:(x,force)=>{if(force===true){classes.add(x);return true;}if(force===false){classes.delete(x);return false;}if(classes.has(x)){classes.delete(x);return false;}classes.add(x);return true;}
   },
   addEventListener:(type,cb)=>listeners.set(type,cb),
   setAttribute(x,y){this.attrs[x]=y;},
   setPointerCapture(){},
   fire(type='click',event={}){const cb=listeners.get(type);assert(cb,id+' missing '+type+' listener');cb(event);}
 };
}
for(const id of ids)elements.set(id,element(id));
const moveLeft=element('move-left'),moveRight=element('move-right');
moveLeft.dataset.move='left';moveRight.dataset.move='right';
const docEvents=new Map(),winEvents=new Map(),storage=new Map();
let now=0,raf=null,timers=[];
const document={
 hidden:false,
 getElementById:id=>{assert(elements.has(id),'unknown element '+id);return elements.get(id);},
 querySelectorAll:sel=>sel==='[data-move]'?[moveLeft,moveRight]:[],
 addEventListener:(name,cb)=>docEvents.set(name,cb)
};
const win={addEventListener:(name,cb)=>winEvents.set(name,cb),confirm:()=>true};
const context=createContext({
 document,window:win,localStorage:{
   getItem:key=>storage.get(key)??null,
   setItem:(key,value)=>storage.set(key,value),
   removeItem:key=>storage.delete(key)
 },
 location:{protocol:'file:'},navigator:{},
 requestAnimationFrame:cb=>{raf=cb},
 setTimeout:cb=>{timers.push(cb);return timers.length;},
 performance:{now:()=>now},
 console:{warn:()=>{}}
});
new Script(read('game.js'),{filename:'game.js'}).runInContext(context);
const e=id=>elements.get(id);
const click=id=>e(id).fire();
function step(count){
 for(let i=0;i<count;i++){now+=1000/60;const cb=raf;assert(cb,'animation callback missing');raf=null;cb(now);}
}
function key(code,down){
 const ev={code,preventDefault(){},repeat:false};
 const fn=docEvents.get(down?'keydown':'keyup');
 assert(fn,'missing keyboard handler');fn(ev);
}
function moveRight(n){key('ArrowRight',true);step(n);key('ArrowRight',false);step(1);}
function drainDialogue(){
 assert(!e('dialogue').classList.contains('hidden'),'Expected dialogue');
 for(let i=0;i<20;i++){click('nextLine');if(e('dialogue').classList.contains('hidden'))return;}
 throw Error('Dialogue did not close');
}
const save=()=>JSON.parse(storage.get('foldfarer.firstfold.0.1')||'null');
assert(e('intro').classList.contains('hidden')===false,'Intro missing');
click('start');drainDialogue();
moveRight(54);assert(Math.abs(save()?.x-273)<5,'Walk location is expected to save only at checkpoint');
click('interact');drainDialogue();assert(save().metMorrow,'Morrow recruitment failed');
moveRight(58);click('interact');drainDialogue();assert(save().mended,'Bridge Mend failed');
assert(e('bridgeFix').attrs.class==='bridge-open','Bridge artwork not opened');
moveRight(85);click('interact');drainDialogue();assert(save().letter,'Mila letter not received');
moveRight(55);click('interact');
assert(!e('battle').classList.contains('hidden'),'Battle did not start');
function battleChoose(name){e('battleActions').fire('click',{target:{closest:()=>({dataset:{battle:name}})}});}
battleChoose('attack');assert(!e('timing').classList.contains('hidden'),'Timing command not shown');
now+=425;click('timingTap');assert(e('enemyHp').textContent==='13 / 26','Perfect strike was not applied');
while(timers.length)timers.shift()();
battleChoose('morrow');while(timers.length)timers.shift()();
assert(e('enemyHp').textContent==='7 / 26','Morrow did not damage enemy');
battleChoose('attack');now+=425;click('timingTap');
assert(!e('battleDone').classList.contains('hidden'),'Victory button missing');
click('battleDone');drainDialogue();
assert(save().won,'Victory checkpoint missing');
click('journalButton');assert(e('journalText').innerHTML.includes('preview is complete'),'Journal summary missing');
click('resume');
assert(e('battle').classList.contains('hidden')&&e('journal').classList.contains('hidden'),'Modals not closed');
console.log('Gameplay simulation passed: intro -> Morrow -> Mend -> Mila -> timed battle -> victory -> journal/save.');
