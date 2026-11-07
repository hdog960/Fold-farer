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
   appendChild(child){this.lastChild=child;child.parentNode=this;return child;},
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
key('ArrowUp',true);step(20);
assert(['0','1','2','3','4','5','6','7'].includes(e('tavi').dataset.stride),'Movement must select a frame from the eight-cel walking atlas');
assert(e('tavi').dataset.stride!=='0','Moving into the scene must advance beyond first stride state');
key('ArrowUp',false);
assert(pos().y<startY-35,'Up did not move into the screen');
assert(e('tavi').classList.contains('dir-up'),'Up did not display original back pose');
assert(e('paintedPaperRidges').attrs.transform?.startsWith('translate('),'Distant paper cards did not receive depth-responsive parallax');
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
assert(e('morrow').classList.contains('following'),'Morrow did not become a real following companion');
const morrowInitial=e('morrow').attrs.transform;
const wingFramesObserved=new Set();
for(let n=0;n<42;n++){step(2);wingFramesObserved.add(e('morrow').dataset.flap);}
assert(wingFramesObserved.size===4,'Follower must show four distinct illustrated wing poses');
assert(e('morrowGroundShadow'),'Missing ground-anchored bird shadow');
assert(e('taviGroundShadow'),'Missing grounded hero shadow');
key('ArrowRight',true);step(6);key('ArrowRight',false);
assert(e('morrow').attrs.transform!==morrowInitial,'Morrow failed to move in the same world as Tavi');
key('ArrowLeft',true);step(6);key('ArrowLeft',false);
key('ArrowUp',true);step(26);key('ArrowUp',false);
click('interact');
assert(save().area==='atelier','Walking to the workshop door did not enter the interior');
drainDialogue();
assert(e('atelierScene').style.display==='', 'Interior did not render');
assert(e('morrow').parentNode===e('atelierDepthStage'),'Morrow should follow Tavi into the workshop');
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
assert(e('morrow').parentNode===e('depthStage'),'Morrow should follow Tavi back outside');
// A second outdoor location must be genuinely explorable in depth, not a static scene.
walkRight(49);
key('ArrowUp',true);step(8);key('ArrowUp',false);
click('interact');
assert(save().area==='terrace','North Terrace gateway did not open a connected world');
drainDialogue();
assert(e('terraceScene').style.display==='', 'North Terrace is not visible');
for(const id of ['terraceMaterialStories','terraceDyerSilks','terraceBotanicalRelief','terraceGateEngraving','terraceLightShift']){
 assert(e(id),'Missing real stage art: '+id);
}
step(4);
assert(e('terraceLightShift').attrs.transform?.startsWith('translate('),
 'Sunlight must receive its own small parallax without moving collision geometry');
// These two fully drawn objects have the same footprints in SVG, physics and
// painter ordering; they cannot become pass-through props or invisible walls.
// The preview script intentionally keeps its pure collision function private.
// Browser movement will verify real physical blocking; this VM covers the
// published source footprint and the DOM-stage participation.
const source=read('game.js');
assert(source.includes('((x-502)/58)**2+((y-563)/19)**2<1'),"Dyer's bench collision footprint is missing");
assert(source.includes('((x-954)/65)**2+((y-555)/21)**2<1'),"Letter cabinet collision footprint is missing");

assert(e('terraceDyersBench').parentNode===e('terraceDepthStage'),'Dyers bench is not in active paint ordering');
assert(e('terraceLetterCabinet').parentNode===e('terraceDepthStage'),'Letter cabinet is not in active paint ordering');
assert(e('prompt').classList.contains('terrace-prompt'),'Terrace prompt should use its own unobstructed HUD placement');
assert(e('folioScene').style.display==='none', 'Folio should hide while exploring terrace');
assert(e('morrow').parentNode===e('terraceDepthStage'),'Morrow did not follow into the upper courtyard');
const nearTerraceY=pos().y;
const nearTerraceScale=Number(/scale\(([-.0-9]+)/.exec(e('tavi').attrs.transform)?.[1]??0);
key('ArrowUp',true);step(45);key('ArrowUp',false);
assert(pos().y<nearTerraceY-95,'North Terrace has no substantive into-screen navigation');
const farTerraceScale=Number(/scale\(([-.0-9]+)/.exec(e('tavi').attrs.transform)?.[1]??0);
assert(farTerraceScale<nearTerraceScale-.12,'Deep walk-plane perspective does not scale the character');
key('ArrowDown',true);step(45);key('ArrowDown',false);
click('interact');
assert(save().area==='folio','Terrace descent back to the Folio failed');
assert(!e('prompt').classList.contains('terrace-prompt'),'Terrace HUD placement must reset when returning to Folio');
assert(e('morrow').parentNode===e('depthStage'),'Morrow did not descend with Tavi');
walkRight(58);
walkRight(12);assert(pos().x<=709,'Crossed an unrepaired bridge or river');
click('interact');drainDialogue();assert(save().mended,'Bridge Mend failed');
assert(e('tavi').classList.contains('mending'),'Bridge repair must show the hero needle gesture');
step(70);
assert(!e('tavi').classList.contains('mending'),'Needle flourish must finish and unblock the player');
assert(e('bridgeFix').attrs.class==='bridge-open','Bridge artwork not opened');
assert(e('seamLight').classList.contains('hidden-seam'),'Mended seam effect should recede');
// The visual crossing and the collision model must describe the same bridge.
walkRight(42);
assert(pos().x>854,'Tavi cannot cross the physically mended paper bridge');
walkRight(43);click('interact');drainDialogue();assert(save().letter,'Mila letter not received');
walkRight(55);click('interact');
assert(!e('battle').classList.contains('hidden'),'Battle did not start');
function battleChoose(name){e('battleActions').fire('click',{target:{closest:()=>({dataset:{battle:name}})}});}
battleChoose('attack');assert(!e('timing').classList.contains('hidden'),'Timing command not shown');
now+=425;click('timingTap');assert(e('enemyHp').textContent==='13 / 26','Perfect strike was not applied');
assert(e('battle').classList.contains('fx-attack')&&e('battle').classList.contains('fx-perfect'),'Perfect stitch did not trigger physical attack effect');
while(timers.length)timers.shift()();
battleChoose('morrow');assert(e('battle').classList.contains('fx-ink'),'Morrow ink needle had no scene effect');
while(timers.length)timers.shift()();
assert(e('enemyHp').textContent==='7 / 26','Morrow did not damage enemy');
battleChoose('fold');assert(e('battle').classList.contains('fx-fold'),'Fold Cover had no visible paper-panel effect');
while(timers.length)timers.shift()();
battleChoose('guard');assert(e('battle').classList.contains('fx-guard'),'Guard had no scene effect');
while(timers.length)timers.shift()();
battleChoose('attack');now+=425;click('timingTap');
assert(!e('battleDone').classList.contains('hidden'),'Victory button missing');
assert(e('battle').classList.contains('fx-victory'),'Victory did not cause a physical paper burst');
click('battleDone');drainDialogue();
assert(save().won,'Victory checkpoint missing');
click('journalButton');assert(e('journalText').innerHTML.includes('preview is complete'),'Journal summary missing');
click('resume');
assert(e('battle').classList.contains('hidden')&&e('journal').classList.contains('hidden'),'Modals not closed');
key('ArrowRight',true);step(110);key('ArrowRight',false);step(1);
assert(pos().x<=1360,'Hero exceeded authored scene bounds');
assert(!e('tavi').classList.contains('walking'),'Hero must not moonwalk against a map edge');
assert(e('tavi').dataset.stride==='0','Feet must rest at contact after hitting a wall');
console.log('Gameplay simulation passed: 2D movement, depth poses, river collision, Morrow -> Mend -> Mila -> timed battle -> victory -> journal/save.');
