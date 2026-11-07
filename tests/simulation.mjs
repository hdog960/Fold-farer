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
   appendChild(child){this.lastChild=child;return child;},
   setAttribute(x,y){this.attrs[x]=y;},
   setPointerCapture(){},
   fire(type='click',event={}){const cb=listeners.get(type);assert(cb,id+' missing '+type+' listener');cb(event);}
 };
}
for(const id of ids)elements.set(id,element(id));
const moveButtons=Object.fromEntries(['left','right','up','down'].map(d=>{const button=element('move-'+d);button.dataset.move=d;return [d,button];}));
const docEvents=new Map(),winEvents=new Map(),storage=new Map();
let now=0,raf=null,timers=[];
const document={
 hidden:false,
 getElementById:id=>{assert(elements.has(id),'unknown element '+id);return elements.get(id);},
 querySelectorAll:sel=>sel==='[data-move]'?Object.values(moveButtons):[],
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
function walkRight(n){key('ArrowRight',true);step(n);key('ArrowRight',false);step(1);}
function drainDialogue(){
 assert(!e('dialogue').classList.contains('hidden'),'Expected dialogue');
 for(let i=0;i<20;i++){click('nextLine');if(e('dialogue').classList.contains('hidden'))return;}
 throw Error('Dialogue did not close');
}
const save=()=>JSON.parse(storage.get('foldfarer.firstfold.0.1')||'null');
assert(e('intro').classList.contains('hidden')===false,'Intro missing');
click('start');assert(e('portraitUse').attrs.href==='#taviSprite','Tavi dialogue sprite must not depend on field position');drainDialogue();
// Verify actual into-the-world movement, separate rear artwork, and retreat.
const pos=()=>{const match=/translate\(([-.0-9]+) ([-.0-9]+)\)/.exec(e('tavi').attrs.transform);assert(match,'Missing transform');return {x:Number(match[1]),y:Number(match[2])};};
const startY=pos().y;
key('ArrowUp',true);step(20);key('ArrowUp',false);
assert(pos().y<startY-35,'Up did not move into the screen');
assert(e('tavi').classList.contains('dir-up'),'Up did not display original back pose');
key('ArrowDown',true);step(20);key('ArrowDown',false);
assert(pos().y>startY-6,'Down failed to return toward the camera');
assert(e('tavi').classList.contains('dir-down'),'Down did not display front pose');
// Walking northwest and southeast must show authored three-quarter art, not a flipped back walk.
key('ArrowUp',true);key('ArrowRight',true);step(20);
assert(e('tavi').classList.contains('dir-diag-up'),'NW/NE travel did not select original 3/4 back art');
key('ArrowUp',false);key('ArrowRight',false);
const afterQuarter=pos();
key('ArrowDown',true);key('ArrowLeft',true);step(20);
assert(e('tavi').classList.contains('dir-diag-down'),'SE/SW travel did not select original 3/4 front art');
key('ArrowDown',false);key('ArrowLeft',false);
assert(Math.abs(pos().x-355)<7 && Math.abs(pos().y-startY)<7,'Diagonal return drift');
walkRight(32);
assert(Math.abs(pos().x-475)<16,'Horizontal movement regressed');
click('interact');drainDialogue();assert(save().metMorrow,'Morrow recruitment failed');
key('ArrowUp',true);step(26);key('ArrowUp',false);
click('interact');
assert(save().area==='atelier','Walking to the workshop door did not enter the interior');
drainDialogue();
assert(e('atelierScene').style.display==='', 'Interior did not render');
assert(e('folioScene').style.display==='none', 'Outdoor scene was not hidden');
const entryY=pos().y;
key('ArrowUp',true);step(18);key('ArrowUp',false);
assert(pos().y<entryY-25,'Interior does not support walking inward');
click('interact');drainDialogue();
assert(save().threadSample,'Workshop loom reward missing');
key('ArrowDown',true);step(18);key('ArrowDown',false);
click('interact');
assert(save().area==='folio','Workshop exit failed');
assert(e('folioScene').style.display==='', 'Outdoor scene did not return');
walkRight(58);
walkRight(12);assert(pos().x<=709,'Crossed an unrepaired bridge or river');
click('interact');drainDialogue();assert(save().mended,'Bridge Mend failed');
assert(e('bridgeFix').attrs.class==='bridge-open','Bridge artwork not opened');
walkRight(85);click('interact');drainDialogue();assert(save().letter,'Mila letter not received');
walkRight(55);click('interact');
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
console.log('Gameplay simulation passed: 2D movement, depth poses, river collision, Morrow -> Mend -> Mila -> timed battle -> victory -> journal/save.');
