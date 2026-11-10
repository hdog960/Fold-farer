/* FoldFarer: The Unfinished World. First Fold 0.36.0: living feather masks, flowing crown and illustrated midground orchard.
   Real, deterministic interactive preview. Original inline SVG stage, no external game art.
   This build is an aesthetic checkpoint, NOT the completed Milestone A vertical slice. */
(function(){
'use strict';
const SAVE_KEY='foldfarer.firstfold.0.1';
const initial=()=>({started:false,x:355,y:654,facing:1,direction:'down',area:'folio',threadSample:false,metMorrow:false,mended:false,letter:false,won:false});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const solids=[[64,333,548,576],[378,626,548,573],[885,1180,548,579],[1284,1436,548,577]];
const props=[[336,725,60,21],[573,728,17,13],[1144,735,58,18]];
// All scene bounds describe a genuine walkable foot plane, not the SVG backdrop.
// This single source is shared by movement, tap-to-walk and save migration.
const areaBounds={
 folio:[85,1360,552,768],
 atelier:[170,1280,456,772],
 terrace:[155,1280,400,770]
};
const boundsFor=area=>areaBounds[area]||areaBounds.folio;
function canStand(x,y,mended,area='folio'){
 if(area==='terrace'){
   const [left,right,back,front]=boundsFor('terrace');
   if(x<left||x>right||y<back||y>front)return false;
   // Props have physical *footprints*, not invisible full-height rectangles.
   if(((x-719)/57)**2+((y-483)/20)**2<1)return false; // bell dais
   if(((x-371)/51)**2+((y-615)/17)**2<1)return false; // lantern base
   if(((x-1022)/105)**2+((y-660)/24)**2<1)return false; // memory kiosk
   if(((x-1177)/55)**2+((y-591)/23)**2<1)return false; // ribbon tree
   if(((x-502)/58)**2+((y-563)/19)**2<1)return false; // dyer's bench
   if(((x-954)/65)**2+((y-555)/21)**2<1)return false; // lost-letter cabinet
   return true;
 }
 if(area==='atelier'){
   if(x<170||x>1280||y<456||y>772)return false;
   if(x>594&&x<852&&y>558&&y<655)return false; // Loom structure
   if(((x-427)/93)**2+((y-656)/24)**2<1)return false;
   if(((x-1085)/94)**2+((y-664)/25)**2<1)return false;
   return true;
 }
 if(x<85||x>1360||y<552||y>768)return false;
 if(x>708&&x<854&&(!mended||y<624||y>675))return false;
 if(solids.some(r=>x>r[0]&&x<r[1]&&y>r[2]&&y<r[3]))return false;
 if(props.some(p=>((x-p[0])/p[2])**2+((y-p[1])/p[3])**2<1))return false;
 return true;
}
function restorePosition(d){
 if(!areaBounds[d.area])d.area='folio';
 const [left,right,back,front]=boundsFor(d.area);
 d.x=clamp(d.x,left,right);
 d.y=clamp(d.y,back,front);
 d.facing=d.facing===-1?-1:1;
 if(!['up','down','side','diag-up','diag-down'].includes(d.direction))d.direction='down';
 if(!canStand(d.x,d.y,!!d.mended,d.area)){
   if(d.area==='atelier'){d.x=720;d.y=711;}
   else if(d.area==='terrace'){d.x=720;d.y=700;}
   else if(d.x>708&&d.x<854)d.x=d.x<781?696:864;
   else d.y=638;
 }
 return d;
}
function load(){
 try {
   const data=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
   if(data&&typeof data==='object'&&Number.isFinite(data.x)&&Number.isFinite(data.y)){
     return restorePosition({...initial(),...data});
   }
 }catch(e){console.warn('Preview save was not readable; starting new.',e)}
 return initial();
}
let state=load();
const $=id=>document.getElementById(id);
const el={world:$('world'),farRidges:$('paintedPaperRidges'),terraceRidges:$('terraceDistantCards'),terraceMidRidges:$('terraceMidgroundCards'),terraceLightShift:$('terraceLightShift'),folioScene:$('folioScene'),terraceScene:$('terraceScene'),terraceDepthStage:$('terraceDepthStage'),atelierScene:$('atelierScene'),atelierDepthStage:$('atelierDepthStage'),depthStage:$('depthStage'),tapMarker:$('tapMarker'),taviFlip:$('taviFlip'),morrow:$('morrow'),morrowContactBounce:$('morrowContactBounce'),portraitBadge:$('portraitBadge'),portraitSvg:$('portraitSvg'),portraitUse:$('portraitUse'),tavi:$('tavi'),taviContactBounce:$('taviContactBounce'),enemy:$('enemy'),bridge:$('bridgeFix'),broken:$('brokenBridge'),seam:$('seamLight'),objective:$('objective'),prompt:$('prompt'),promptText:$('promptText'),intro:$('intro'),start:$('start'),dialog:$('dialogue'),speaker:$('speaker'),speakerMark:$('speakerMark'),line:$('line'),nextLine:$('nextLine'),journal:$('journal'),journalButton:$('journalButton'),journalText:$('journalText'),resume:$('resume'),reset:$('reset'),interact:$('interact'),battle:$('battle'),battleTitle:$('battleTitle'),battleIntent:$('battleIntent'),battleLog:$('battleLog'),battleActions:$('battleActions'),timing:$('timing'),timingMarker:$('timingMarker'),timingTap:$('timingTap'),heroHp:$('heroHp'),heroBar:$('heroBar'),enemyHp:$('enemyHp'),enemyBar:$('enemyBar'),foldNode:$('foldNode'),battleDone:$('battleDone')};
let held={left:false,right:false,up:false,down:false}, dialogue=[],afterDialogue=null,battle=null,timingStart=0,timingActive=false,modal='intro',last=0,lastPrompt='',eventLocks={},moveTarget=null,lastSavedAt=0,walkDistance=0,mendingUntil=0,pivotStart=0,pivotUntil=0,pivotFacing=state.direction+':'+state.facing,lastVerticalTurnView=state.direction.includes('up')?'rear':'front';
const actorDepth={paperPlanter:725,folioNotice:728,paperBench:735,morrow:620,mila:643,enemy:652};
const atelierDepth={atelierSpoolCart:656,atelierLoom:631,atelierDyeBench:664};
const terraceDepth={terraceBell:484,terraceLantern:615,terraceKiosk:660,terraceRibbonTree:591,
 terraceDyersBench:563,terraceLetterCabinet:555};
let lastDepthOrder='';
const backdrop={x:0,y:0};
function updateBackdrop(dt){
 // Distant paper cards move more slowly than the physical walkable surface;
 // foreground props remain attached to their collision geometry.
 const tx=state.area==='folio'?clamp((720-state.x)*.014,-9,9):0;
 const ty=state.area==='folio'?clamp((654-state.y)*.018,-4,4):0;
 const alpha=1-Math.exp(-Math.min(Math.max(dt,0),.05)*3.5);
 backdrop.x+=(tx-backdrop.x)*alpha;
 backdrop.y+=(ty-backdrop.y)*alpha;
 el.farRidges.setAttribute('transform','translate('+backdrop.x.toFixed(2)+' '+backdrop.y.toFixed(2)+')');
 const dx=state.area==='terrace'?clamp((720-state.x)*.043,-21,21):0;
 const dy=state.area==='terrace'?clamp((580-state.y)*.038,-10,10):0;
 backdrop.terraceX=(backdrop.terraceX||0)+(dx-(backdrop.terraceX||0))*alpha;
 backdrop.terraceY=(backdrop.terraceY||0)+(dy-(backdrop.terraceY||0))*alpha;

 el.terraceRidges.setAttribute('transform','translate('+backdrop.terraceX.toFixed(2)+' '+backdrop.terraceY.toFixed(2)+')');
 // A nearer paper card glides much less than the furthest card, while the
 // walk plane, collision geometry, physical props and player stay fixed.
 el.terraceMidRidges.setAttribute('transform','translate('+(backdrop.terraceX*.43).toFixed(2)+' '+(backdrop.terraceY*.55).toFixed(2)+')');
 // Light drifts slightly with distant cards but never moves physical actors
 // or the camera hit-test coordinate system.
 el.terraceLightShift.setAttribute('transform','translate('+(backdrop.terraceX*.28).toFixed(2)+' '+(backdrop.terraceY*.24).toFixed(2)+')');
}
const companion={x:474,y:620,area:'folio',ready:false,flightSpeed:0,bank:0,pitch:0};
const morrowWingCycle=[0,1,2,3,2,1];
// Advance wing artwork through a continuous phase: changing from idle to
// following or dialogue never skips abruptly to an unrelated wing drawing.
const morrowFlight={phase:0,lastAt:null};
function updateMorrowAnimation(now){
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const talking=el.morrow.classList.contains('talking');
 el.morrow.dataset.beak=reduced?'0':(talking&&Math.floor(now/155)%3===1?'1':'0');
 if(reduced){
   morrowFlight.lastAt=now;
   el.morrow.dataset.flap='0';
   return;
 }
 const elapsed=morrowFlight.lastAt===null?0:clamp(now-morrowFlight.lastAt,0,50);
 morrowFlight.lastAt=now;
 // Wingbeats accelerate gently as the bird catches up with Tavi. The same
 // six original hand-illustrated cels remain in order, with no CSS scaling.
 const following=el.morrow.classList.contains('following');
 const speed=following?clamp(companion.flightSpeed/190,0,1):0;
 const interval=talking?105:(following?175-55*speed:240);
 morrowFlight.phase=(morrowFlight.phase+elapsed/interval)%morrowWingCycle.length;
 el.morrow.dataset.flap=String(morrowWingCycle[Math.floor(morrowFlight.phase)]);
}
function updateCompanion(dt=0){
 if(!state.metMorrow){
   companion.x=474;companion.y=620;companion.area='folio';companion.ready=false;companion.flightSpeed=0;companion.bank=0;companion.pitch=0;
   el.morrow.style.setProperty('--morrow-flight-bank','0deg');
   el.morrow.style.setProperty('--morrow-flight-pitch','0px');
   el.morrow.setAttribute('transform','translate(474 610)');
   el.morrow.classList.remove('following');
   if(el.morrow.parentNode!==el.depthStage){el.depthStage.appendChild(el.morrow);lastDepthOrder='';}
   return;
 }
 const indoors=state.area==='atelier';
 const terrace=state.area==='terrace';
 const [left,right,back,front]=boundsFor(state.area);
 const targetX=clamp(state.x-state.facing*67,left+6,right-6);
 const targetY=clamp(state.y-26,back+6,front-12);
 // The drawn bird banks into actual horizontal flight. Track the prior
 // position rather than the hero's facing, so a turn never snaps the artwork.
 const previousX=companion.x;
 const previousY=companion.y;
 const wasFollowing=companion.ready&&companion.area===state.area;
 if(!companion.ready||companion.area!==state.area){
   companion.x=targetX;companion.y=targetY;companion.area=state.area;companion.ready=true;
 }else if(dt>0){
   const easing=1-Math.exp(-Math.min(dt,.05)*7.1);
   companion.x+=(targetX-companion.x)*easing;
   companion.y+=(targetY-companion.y)*easing;
 }
 // Keep banking in the local paper-sprite, never on the ground shadow,
 // world transform, dialogue portrait, or save state. Reduced motion is still.
 const prefersStill=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const horizontalSpeed=wasFollowing&&dt>0?(companion.x-previousX)/Math.max(dt,.016):0;
 companion.flightSpeed=wasFollowing&&dt>0?
   Math.hypot(companion.x-previousX,companion.y-previousY)/Math.max(dt,.016):0;
 // Dampen bank and altitude response in world time, so abrupt hero turns
 // never snap the hand-painted bird between extreme poses. The local SVG
 // paper sprite banks; its ground shadow and world collision remain planted.
 const verticalSpeed=wasFollowing&&dt>0?(companion.y-previousY)/Math.max(dt,.016):0;
 const response=dt>0?1-Math.exp(-Math.min(dt,.05)*11):1;
 const desiredBank=prefersStill?0:clamp(horizontalSpeed*.025,-6,6);
 const desiredPitch=prefersStill?0:clamp(-verticalSpeed*.018,-3,3);
 companion.bank+=(desiredBank-companion.bank)*response;
 companion.pitch+=(desiredPitch-companion.pitch)*response;
 if(!wasFollowing||prefersStill){companion.bank=0;companion.pitch=0;}
 el.morrow.style.setProperty('--morrow-flight-bank',companion.bank.toFixed(2)+'deg');
 el.morrow.style.setProperty('--morrow-flight-pitch',companion.pitch.toFixed(2)+'px');
 const size=terrace?clamp(.61+(companion.y-400)*.00106,.61,1.01):clamp(.72+(companion.y-552)*.00075,.71,.89);
 el.morrow.setAttribute('transform','translate('+companion.x.toFixed(1)+' '+companion.y.toFixed(1)+') scale('+size.toFixed(3)+')');
 // The bird remains airborne: lighter bounce follows its *ground* projection.
 const birdLantern=Math.hypot(companion.x-371,(companion.y-615)*1.1);
 const birdBounce=terrace?.11+.24*Math.max(0,1-birdLantern/460):(indoors?.07:.10);
 el.morrowContactBounce.setAttribute('opacity',birdBounce.toFixed(3));
 // Cardstock feather highlights catch the SAME nearby warm light as the
 // walking world; this changes only paint values, not bird movement.
 const birdReflect=terrace?.56+.27*Math.max(0,1-birdLantern/460):(indoors?.48:.54);
 el.morrow.style.setProperty('--paper-rim-strength',birdReflect.toFixed(2));
 el.morrow.classList.add('following');
 const targetStage=indoors?el.atelierDepthStage:(terrace?el.terraceDepthStage:el.depthStage);
 if(el.morrow.parentNode!==targetStage){targetStage.appendChild(el.morrow);lastDepthOrder='';}
}
function updateCharacter(){
 // Terrace covers over 350 walkable vertical units, so its perspective scales
 // substantially more between back and front than the Folio street frontage.
 const terrace=state.area==='terrace';
 const z=terrace?clamp(.52+(state.y-400)*.00175,.52,1.17):clamp(.77+(state.y-552)*.0021,.77,1.23);
 // The playfield actor always has a positive (non-mirrored) spatial transform.
 // Mirroring is confined to the local paper-sprite group, keeping the
 // hero's world position, occlusion and UI sprite references independent.
 el.tavi.setAttribute('transform','translate('+state.x.toFixed(1)+' '+state.y.toFixed(1)+') scale('+z.toFixed(3)+')');
 // Warm light lies ON the physical floor, not on a portrait or fixed HUD layer.
 // Only the intensity changes with position. The ellipse stays at the exact
 // existing SVG foot anchor and inherits the same perspective scaling.
 const distanceToLantern=Math.hypot(state.x-371,(state.y-615)*1.1);
 const proximity=terrace?Math.max(0,1-distanceToLantern/460):0;
 const footBounce=terrace?.20+.45*proximity:(state.area==='atelier'?.10:.14);
 el.taviContactBounce.setAttribute('opacity',footBounce.toFixed(3));
 // Only the actual painted coat edge responds to the light. No portrait HUD,
 // fake sprite halo or area-wide flat rectangle is used.
 const coatReflect=terrace?.56+.32*proximity:(state.area==='atelier'?.50:.61);
 el.tavi.style.setProperty('--paper-rim-strength',coatReflect.toFixed(2));
 el.taviFlip.setAttribute('transform','scale('+state.facing+' 1)');
 for(const dir of ['up','down','side','diag-up','diag-down'])el.tavi.classList.toggle('dir-'+dir,state.direction===dir);
 const inside=state.area==='atelier';
 const targetStage=inside?el.atelierDepthStage:(terrace?el.terraceDepthStage:el.depthStage);
 const items=inside?{...atelierDepth,...(state.metMorrow?{morrow:companion.y}:{})}:
   terrace?{...terraceDepth,...(state.metMorrow?{morrow:companion.y}:{})}:
   {...actorDepth,morrow:state.metMorrow?companion.y:620};
 const sorted=Object.entries({...items,tavi:state.y}).sort((a,b)=>a[1]-b[1]).map(v=>v[0]);
 const signature=state.area+':'+sorted.join(':');
 if(el.tavi.parentNode!==targetStage)targetStage.appendChild(el.tavi);
 if(lastDepthOrder!==signature){for(const id of sorted)targetStage.appendChild($(id));lastDepthOrder=signature;}
}
function cancelTap(){moveTarget=null;el.tapMarker.setAttribute('visibility','hidden');}
function moveBy(dx,dy){
 const oldX=state.x,oldY=state.y;
 const [left,right,back,front]=boundsFor(state.area);
 const nextX=clamp(state.x+dx,left,right);
 const nextY=clamp(state.y+dy,back,front);
 if(canStand(nextX,nextY,state.mended,state.area)){
   state.x=nextX;state.y=nextY;
 }else{
   if(canStand(nextX,state.y,state.mended,state.area))state.x=nextX;
   if(canStand(state.x,nextY,state.mended,state.area))state.y=nextY;
 }
 return Math.hypot(state.x-oldX,state.y-oldY)>.01;
}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch(e){console.warn('Could not persist preview progress',e)}}
function objective(){
 if(state.area==='terrace')return 'Explore the North Terrace.';
 if(state.area==='atelier')return state.threadSample?'Leave the Threads workshop and return to the Folio.':'Explore the workshop and inspect the Mender’s Loom.';
 if(!state.metMorrow)return 'Find the ink-bird with the missing map.';
 if(!state.mended)return 'Mend the broken bridge at the river seam.';
 if(!state.letter)return 'Speak to Mila, the young courier.';
 if(!state.won)return 'Drive the Paper Scrapper away from the white road.';
 return 'First Fold complete — open your journal to review the trail.';
}
function sync(){
 el.folioScene.style.display=state.area==='folio'?'':'none';
 el.terraceScene.style.display=state.area==='terrace'?'':'none';
 el.prompt.classList.toggle('terrace-prompt',state.area==='terrace');
 el.atelierScene.style.display=state.area==='atelier'?'':'none';
 updateCompanion(0);
 updateCharacter();
 el.bridge.setAttribute('class',state.mended?'bridge-open':'bridge-closed');
 el.broken.style.opacity=state.mended?'0':'1';
 el.seam.style.opacity=state.mended?'.22':'1';
 el.seam.classList.toggle('hidden-seam',!!state.mended);
 el.enemy.style.display=state.won?'none':'';
 el.objective.textContent=objective();
 el.start.firstChild.textContent=state.started?'Continue Adventure ':'Open the Book ';
 updatePrompt();
}
function travelTo(area,x,y,direction){
 cancelTap();
 pivotStart=0;pivotUntil=0;el.tavi.classList.remove('pivoting');el.tavi.classList.remove('turning');
 pivotFacing=direction+':'+state.facing;lastVerticalTurnView=direction.includes('up')?'rear':'front';
 clearHeld();
 walkDistance=0;mendingUntil=0;
 el.tavi.dataset.stride='0';
 el.tavi.classList.remove('walking');
 el.tavi.classList.remove('mending');
 state.area=area;state.x=x;state.y=y;state.direction=direction;
 lastDepthOrder='';
 companion.ready=false;
 save();
 sync();
}
function showIntro(){
 modal='intro';el.intro.classList.remove('hidden');el.journal.classList.add('hidden');el.dialog.classList.add('hidden');el.battle.classList.add('hidden');
}
function startGame(){
 state.started=true;save();el.intro.classList.add('hidden');modal='field';sync();
 if(!state.metMorrow&&!eventLocks.intro){
   eventLocks.intro=true;
   speak([
    ['Tavi','A footbridge, a sunny village, and an uncomplicated repair job. That was the plan.','✦'],
    ['Morrow','Excellent plan. One difficulty: someone has removed an entire road from the map.','✒'],
    ['Tavi','That sounds significantly more complicated than a bridge.','✦'],
    ['Morrow','Finally, a tradesperson with observational skills. I am by the threads shop. Come speak to me.','✒']
   ]);
 }
}
function speak(lines,done){
 pivotStart=0;pivotUntil=0;el.tavi.classList.remove('pivoting');el.tavi.classList.remove('turning');
 dialogue=lines.slice();afterDialogue=typeof done==='function'?done:null;modal='dialogue';el.dialog.classList.remove('hidden');nextLine();
}
function nextLine(){
 const line=dialogue.shift();
 if(!line){
   el.dialog.classList.add('hidden');modal='field';
   $('morrow').classList.remove('talking');
   $('morrow').classList.remove('reacting');
   $('morrow').dataset.reaction='neutral';$('morrow').dataset.beak='0';
   $('mila').classList.remove('talking');
   el.tavi.classList.remove('speaking');
   el.tavi.dataset.mood='neutral';el.tavi.dataset.speech='closed';
   const done=afterDialogue;afterDialogue=null;
   if(done)done();
   save();sync();return;
 }
 el.speaker.textContent=line[0];
 el.line.textContent=line[1];
 el.speakerMark.textContent=line[2]||'✦';
 const isTavi=line[0]==='Tavi';
 const isMorrow=line[0]==='Morrow';
 const messageForMorrow=line[1].toLowerCase();
 const birdMood=isMorrow?
  (/removed|missing|danger|erased|lost|wrong/.test(messageForMorrow)?'alarmed':
   /excellent|finally|wonderful|brilliant|good|happy/.test(messageForMorrow)?'delighted':'attentive'):
  (isTavi&&state.metMorrow?'attentive':'neutral');
 el.morrow.classList.toggle('reacting',birdMood!=='neutral');
 el.morrow.dataset.reaction=birdMood;
 el.morrow.dataset.beak='0';
 const allowed=['curious','pleased','concerned','determined'];
 const message=line[1].toLowerCase();
 const suggested=message.includes('?')?'curious':
  /removed|erased|missing|danger|wrong|broken/.test(message)?'concerned':
  /good|bright|saved|wonderful|happy|perfect/.test(message)?'pleased':'determined';
 el.tavi.classList.toggle('speaking',isTavi);
 el.tavi.dataset.mood=isTavi?(allowed.includes(line[3])?line[3]:suggested):'neutral';
 el.tavi.dataset.speech='closed';
 // The speaking portrait is a crop of the *actual in-world character*.
 // This prevents UI portraits drifting away from the playable art direction.
 const portraits={Tavi:['taviSprite',0,0],Morrow:['morrowSprite',0,0],Mila:['mila',1024,643]};
 const source=portraits[line[0]];
 el.portraitBadge.classList.toggle('portrait-with-art',!!source);
 if(source){
   el.portraitUse.setAttribute('href','#'+source[0]);
   el.portraitUse.setAttribute('transform','translate(-'+source[1]+' -'+source[2]+')');
 }
 for(const person of ['morrow','mila']){
   $(person).classList.toggle('talking',line[0].toLowerCase()===person);
 }
 el.nextLine.textContent=dialogue.length?'Continue ›':'Close ›';
}
function nearest(){
 const choices=state.area==='terrace'?[
  {key:'terraceBell',x:719,y:495,r:95,text:'Inspect the archive bell'},
  {key:'terraceKiosk',x:1022,y:655,r:110,text:'Inspect the memory kiosk'},
  {key:'terraceTree',x:1177,y:584,r:105,text:'Inspect the ribbon tree'},
  {key:'terraceDyersBench',x:502,y:557,r:97,text:"Inspect the dyer's bench"},
  {key:'terraceLetterCabinet',x:954,y:551,r:98,text:'Read the lost-letter cabinet'},
  {key:'terraceExit',x:720,y:738,r:91,text:'Return to the Folio'}
 ]:state.area==='atelier'?[
   {key:'loom',x:724,y:618,r:113,text:state.threadSample?'Inspect the stitch loom':'Examine the stitch loom'},
   {key:'spools',x:430,y:647,r:103,text:'Inspect the colored thread spools'},
   {key:'dyes',x:1084,y:655,r:102,text:'Inspect the dye bottles'},
   {key:'exit',x:720,y:750,r:95,text:'Return outside to the Folio'}
 ]:[
  {key:'morrow',x:state.metMorrow?companion.x:474,y:state.metMorrow?companion.y:620,r:state.metMorrow?85:105,text:'Speak with Morrow'},
  {key:'seam',x:696,y:648,r:103,text:state.mended?'Inspect the repaired seam':'Mend the broken paper bridge'},
  {key:'mila',x:1024,y:643,r:102,text:'Speak with Mila'},
  {key:'scrapper',x:1244,y:652,r:105,text:state.won?'Inspect the quiet road':'Challenge the Paper Scrapper'},
  {key:'northGate',x:661,y:600,r:69,text:'Walk into the North Terrace'},
  {key:'door',x:467,y:576,r:55,text:'Enter the Threads workshop'},
  {key:'notice',x:573,y:728,r:62,text:'Read the Folio notice'}
 ];
 return choices.map(p=>({...p,dist:Math.hypot(state.x-p.x,(state.y-p.y)*1.15)}))
  .filter(p=>p.dist<=p.r).sort((a,b)=>(a.dist+(a.key==='morrow'&&state.metMorrow?145:0))-(b.dist+(b.key==='morrow'&&state.metMorrow?145:0)))[0]||null;
}
function updatePrompt(){
 if(modal!=='field'){el.prompt.classList.add('hidden');return;}
 const target=nearest();
 if(!target){el.prompt.classList.add('hidden');lastPrompt='';return;}
 if(target.text!==lastPrompt){el.promptText.textContent=target.text;lastPrompt=target.text;}
 el.prompt.classList.remove('hidden');
}
function interact(){
 if(modal==='dialogue'){nextLine();return;}
 if(modal!=='field')return;
 const target=nearest();
 if(!target){
  speak([['Tavi','Every seam has a story. I should explore a little farther.','✦']]);return;
 }
 switch(target.key){
 case 'northGate':
   travelTo('terrace',720,702,'up');
   speak([['Tavi','The street unfolds uphill. I could never see this terrace from the flat village map.','✦'],
          ['Morrow','A whole other page of the Folio. The roads have depth here, and every fold was made by hand.','✒']]);
   break;
 case 'terraceExit':
   travelTo('folio',661,642,'down');break;
 case 'terraceBell':
   speak([['Tavi','An archive bell made from folded sheet brass. A different seam is engraved into each petal.','✦','curious'],
          ['Morrow','It rings for stories kept, not pages erased. The sound deserves a better library.','✒']]);break;
 case 'terraceKiosk':
   speak([['Tavi','Every pamphlet tells a different version of the same day. The ink is still damp.','✦'],
          ['Morrow','Proof that one town can remember in more than one way. Keep the kiosk exactly like this.','✒']]);break;
 case 'terraceTree':
   speak([['Tavi','Someone sewed these paper blossoms on with real ribbon. There are dozens of different stitches.','✦']]);break;
 case 'terraceDyersBench':
   speak([['Tavi',"Three shades of sea-glass ink, and a cushion stitched from old book covers. The dyer was proud of this bench.",'✦'],
          ['Morrow','The town kept the seat even when the shop closed. Some things are useful as memories.','✒']]);break;
 case 'terraceLetterCabinet':
   speak([['Tavi','Letters returned from places that vanished off the map. None have been opened.','✦'],
          ['Morrow','Good. A lost address is not permission to read a private letter. We should restore the road first.','✒']]);break;
 case 'door':
   travelTo('atelier',720,711,'up');
   speak([['Tavi','The Threads workshop smells like old paper and freshly dyed ribbon. There is room to walk around the loom.','✦']]);
   break;
 case 'exit':
   travelTo('folio',467,627,'down');
   break;
 case 'loom':
   if(!state.threadSample){
     speak([
       ['Tavi','Every thread on this loom belongs to a different story. Some were tied off too early.','✦'],
       ['Morrow','A good mender joins what belongs together. A bad editor cuts away everything inconvenient.','✒'],
       ['Tavi','A bundle of unfinished thread. I should keep it; someone may need its original colors.','✦']
     ],()=>{state.threadSample=true;save();sync();});
   }else speak([['Tavi','One good stitch never requires erasing what came before.','✦']]);
   break;
 case 'spools':
   speak([['Tavi','The spools are arranged by fading rather than color. Whoever worked here remembered the difference.','✦']]);
   break;
 case 'dyes':
   speak([['Tavi','Ink, honey, riverwater and a little starlight. At least one of these dye labels is lying.','✦']]);
   break;
 case 'notice':
   speak([['Folio Notice','Lost: one road, one courier, and an entire Tuesday. Found: unusually persuasive footprints.','✉']]);
   break;
 case 'morrow':
   if(!state.metMorrow){
     speak([
      ['Morrow','My name is Morrow. I used to verify the archives. Now the archives insist the eastern road never existed.','✒'],
      ['Tavi','I remember that road. So do you.','✦'],
      ['Morrow','Then reality is outvoted two to an entire village. An unfortunate majority.','✒'],
      ['Morrow','That bridge is split along its binding. Use your Mender’s Needle, and do not sew your sleeve to the road.','✒']
     ],()=>{state.metMorrow=true;save();});
   }else speak([['Morrow',state.mended?'A neat seam. I nearly approve.':'The bridge is an open seam. Approach it and Mend.','✒']]);
   break;
 case 'seam':
   if(!state.metMorrow){
     speak([['Tavi','The bridge is torn along a glowing thread. Perhaps that ink-bird knows what happened.','✦']]);break;
   }
   if(!state.mended){
     speak([
      ['Tavi','The planks still remember where they belong.','✦'],
      ['Morrow','A rare case in which paperwork and reality agree. Fold the loose edge toward the other bank.','✒'],
      ['Tavi','Needle through. Pull the thread... and let it unfold.','✦']
     ],()=>{
       // Saved immediately, including across Home Screen suspension.
       state.mended=true;save();sync();
       cancelTap();clearHeld();walkDistance=0;
       el.tavi.dataset.stride='0';el.tavi.classList.remove('walking');
       const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
       mendingUntil=performance.now()+(reduced?0:900);
       if(!reduced)el.tavi.classList.add('mending');
     });
   }else speak([['Tavi','One clean seam. The bridge has its shape back, but that eastern road is still white.','✦']]);
   break;
 case 'mila':
   if(!state.mended){speak([['Morrow','We cannot reach Mila until we repair the bridge.','✒']]);break;}
   if(!state.letter){
     speak([
      ['Mila','The post office says nobody lives at the end of this road.','✉'],
      ['Morrow','A road does not need a resident to be a road.','✒'],
      ['Mila','It does if you work for the post office.','✉'],
      ['Tavi','Do you remember where it went?','✦'],
      ['Mila','I remember where it was. Everybody keeps telling me that’s different.','✉'],
      ['Mila','Please take this letter. It is addressed to my brother. I know I have one.','✉']
     ],()=>{state.letter=true;save();sync();});
   }else speak([['Mila','Somebody has to remember him. Thank you for taking the letter.','✉']]);
   break;
 case 'scrapper':
   if(!state.letter){
     speak([['Morrow','That thing is standing exactly where the old road used to be. Speak to Mila first.','✒']]);break;
   }
   if(!state.won)openBattle();
   else speak([['Tavi','The road is quiet. Not restored, but no longer guarded. This story is only beginning.','✦']]);
   break;
 }
}
function openJournal(){
 if(modal==='battle'||modal==='timing'||modal==='dialogue')return;
 modal='journal';el.journal.classList.remove('hidden');
 let notes=['<strong>First Fold — Aesthetic Review</strong>'];
 notes.push(state.metMorrow?'✓ Met Morrow, the ink-bird.':'○ Morrow waits near the Threads shop.');
 notes.push(state.mended?'✓ Mended the river bridge.':'○ An open seam separates the eastern village.');
 notes.push(state.letter?'✓ Received Mila’s letter for an erased courier.':'○ A courier waits across the river.');
 notes.push(state.won?'✓ Cleared the Paper Scrapper. This preview is complete.':'○ The road to the east is guarded.');
 notes.push(state.threadSample?'✓ Found the unfinished thread sample inside the Threads workshop.':'○ The Threads workshop contains an unfinished stitch loom.');
 notes.push('<br><em>The full prologue, finished animation sets, 30–60 minute vertical slice, manual backups, and expanded content are NOT implemented in this build.</em>');
 el.journalText.innerHTML=notes.join('<br>');
}
function closeJournal(){el.journal.classList.add('hidden');modal=state.started?'field':'intro';sync();}
function updateBattle(){
 if(!battle)return;
 el.heroHp.textContent=battle.hero+' / 24';
 el.enemyHp.textContent=battle.enemy+' / 26';
 el.heroBar.style.width=Math.max(0,battle.hero)/24*100+'%';
 el.enemyBar.style.width=Math.max(0,battle.enemy)/26*100+'%';
 el.foldNode.classList.toggle('raised',battle.fold>0);
 el.battleIntent.textContent=battle.finished?'Encounter finished':battle.morrowWeak?'Intent: Ink-blotted Swipe · 3 damage':'Intent: Paper Swipe · 5 damage';
}
const battleEffectNames=['attack','ink','fold','guard','recoil','victory'];
function showBattleEffect(action,perfect=false){
 for(const key of battleEffectNames)el.battle.classList.remove('fx-'+key);
 el.battle.classList.remove('fx-perfect');
 if(perfect)el.battle.classList.add('fx-perfect');
 if(action)el.battle.classList.add('fx-'+action);
}
function openBattle(){
 battle={hero:24,enemy:26,round:1,fold:0,morrowWeak:false,guard:false,busy:false,finished:false};
 modal='battle';el.battle.classList.remove('hidden');showBattleEffect(null);
 el.battleDone.classList.add('hidden');el.battleActions.classList.remove('hidden');el.timing.classList.add('hidden');
 el.battleLog.textContent='A Paper Scrapper unfolds its blade. The arena remembers the broken bridge.';
 updateBattle();
}
function afterHeroAction(text){
 if(!battle||battle.finished)return;
 battle.busy=true;
 el.battleLog.textContent=text;updateBattle();
 if(battle.enemy<=0){finishBattle(true);return;}
 setTimeout(()=>{
   if(!battle||battle.finished)return;
   let damage=5;
   if(battle.fold>0){damage-=3;battle.fold=0;}
   if(battle.morrowWeak){damage-=2;battle.morrowWeak=false;}
   if(battle.guard){damage-=4;battle.guard=false;}
   damage=Math.max(0,damage);
   showBattleEffect('recoil');
   battle.hero=Math.max(0,battle.hero-damage);
   if(battle.hero===0){el.battleLog.textContent='Tavi’s thread frays. The party must try again.';finishBattle(false);return;}
   battle.round++;
   battle.busy=false;
   el.battleLog.textContent='The Scrapper swipes for '+damage+' damage. Choose your next move.';
   updateBattle();
 },520);
}
function chooseBattle(kind){
 if(modal!=='battle'||!battle||battle.busy||battle.finished)return;
 if(kind==='attack'){
   modal='timing';timingActive=true;timingStart=performance.now();
   el.battleActions.classList.add('hidden');el.timing.classList.remove('hidden');return;
 }
 if(kind==='morrow'){showBattleEffect('ink');battle.enemy=Math.max(0,battle.enemy-6);battle.morrowWeak=true;afterHeroAction('Morrow’s ink needle marks the Scrapper for 6 damage and blots its next attack.');}
 if(kind==='fold'){showBattleEffect('fold');battle.fold=1;afterHeroAction('Tavi folds a hanging paper panel into protective cover.');}
 if(kind==='guard'){showBattleEffect('guard');battle.guard=true;afterHeroAction('Tavi braces the Mender’s Needle and waits for the swipe.');}
}
function progressAt(time){const t=((time-timingStart)%1700)/1700;return t<.5?t*200:(1-t)*200;}
function strike(){
 if(modal!=='timing'||!timingActive||!battle)return;
 const pct=progressAt(performance.now());
 const perfect=pct>=46&&pct<=54,success=pct>=37&&pct<=63;
 const damage=perfect?13:success?10:6;
 timingActive=false;modal='battle';
 el.timing.classList.add('hidden');el.battleActions.classList.remove('hidden');
 battle.enemy=Math.max(0,battle.enemy-damage);
 showBattleEffect('attack',perfect);
 afterHeroAction('Needle Strike — '+(perfect?'PERFECT STITCH!':success?'Clean stitch!':'Glancing stitch.')+' '+damage+' damage.');
}
function finishBattle(win){
 if(!battle)return;
 battle.finished=true;battle.busy=true;timingActive=false;modal='battle';
 el.timing.classList.add('hidden');el.battleActions.classList.add('hidden');el.battleDone.classList.remove('hidden');
 if(win){
   showBattleEffect('victory');
   state.won=true;save();el.battleLog.textContent='The Paper Scrapper collapses into harmless scraps. The eastern road still shines white.';
   el.battleDone.textContent='Return to the Folio';
 }else el.battleDone.textContent='Retry the Encounter';
 updateBattle();
}
function endBattle(){
 if(!battle||!battle.finished)return;
 const won=battle.enemy<=0;
 el.battle.classList.add('hidden');battle=null;modal='field';
 if(!won){openBattle();return;}
 sync();
 speak([
  ['Morrow','The blade is gone. But the missing road is still missing.','✒'],
  ['Tavi','I have Mila’s letter, and I know where we should start looking.','✦'],
  ['Morrow','You realize this means leaving an uncomplicated repair job unfinished?','✒'],
  ['Tavi','Some repairs need more than a needle.','✦'],
  ['Morrow','How inconvenient. I think I like you.','✒']
 ]);
}
function keyMove(key,value){
 const dirs={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down'};
 const d=dirs[key];
 if(d){held[d]=value;if(value)cancelTap();return true;}
 return false;
}
document.addEventListener('keydown',e=>{
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();
 if(keyMove(e.code,true))return;
 if(e.repeat)return;
 if(e.code==='Escape'){if(modal==='journal')closeJournal();else if(modal==='field')openJournal();return;}
 if(['Space','Enter','KeyE'].includes(e.code)){
   if(modal==='intro')startGame();
   else if(modal==='dialogue')nextLine();
   else if(modal==='timing')strike();
   else if(modal==='field')interact();
   else if(modal==='journal')closeJournal();
 }
});
document.addEventListener('keyup',e=>keyMove(e.code,false));
function clearHeld(){for(const d of Object.keys(held))held[d]=false;}
window.addEventListener('blur',()=>{clearHeld();cancelTap();save();});
window.addEventListener('pagehide',save);
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearHeld();cancelTap();save();}});
for(const key of document.querySelectorAll('[data-move]')){
 const direction=key.dataset.move;
 const stop=()=>{held[direction]=false;key.classList.remove('active');};
 key.addEventListener('pointerdown',e=>{e.preventDefault();key.setPointerCapture(e.pointerId);held[direction]=true;cancelTap();key.classList.add('active');});
 key.addEventListener('pointerup',stop);key.addEventListener('pointercancel',stop);key.addEventListener('lostpointercapture',stop);
}
el.world.addEventListener('pointerdown',event=>{
 if(modal!=='field'||!el.world.createSVGPoint||!el.world.getScreenCTM)return;
 const matrix=el.world.getScreenCTM();if(!matrix)return;
 const p=el.world.createSVGPoint();p.x=event.clientX;p.y=event.clientY;
 const loc=p.matrixTransform(matrix.inverse());
 const [left,right,back,front]=boundsFor(state.area);
 const x=clamp(loc.x,left,right),y=clamp(loc.y,back,front);
 if(!canStand(x,y,state.mended,state.area)){cancelTap();return;}
 moveTarget={x,y};
 el.tapMarker.setAttribute('transform','translate('+x.toFixed(1)+' '+y.toFixed(1)+')');
 el.tapMarker.setAttribute('visibility','visible');
});
el.start.addEventListener('click',startGame);
el.interact.addEventListener('click',interact);
el.nextLine.addEventListener('click',nextLine);
el.journalButton.addEventListener('click',()=>{if(modal==='journal')closeJournal();else openJournal();});
el.resume.addEventListener('click',closeJournal);
el.reset.addEventListener('click',()=>{
 if(!window.confirm('Restart this aesthetic preview and clear its local progress?'))return;
 localStorage.removeItem(SAVE_KEY);state=initial();companion.ready=false;eventLocks={};dialogue=[];afterDialogue=null;closeJournal();showIntro();sync();
});
el.battleActions.addEventListener('click',e=>{const button=e.target.closest('[data-battle]');if(button)chooseBattle(button.dataset.battle);});
el.timingTap.addEventListener('click',strike);
el.battleDone.addEventListener('click',endBattle);

function updateTaviActing(now){
 const reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 if(el.tavi.classList.contains('speaking')){
   el.tavi.dataset.speech=reduced?'closed':Math.floor(now/190)%3===0?'open':'closed';
 }else el.tavi.dataset.speech='closed';
 if(modal!=='field'||mendingUntil){
   pivotUntil=0;el.tavi.classList.remove('pivoting');el.tavi.classList.remove('turning');
   return;
 }
 const facing=state.direction+':'+state.facing;
 if(facing!==pivotFacing){
   pivotFacing=facing;
   if(state.direction!=='side')lastVerticalTurnView=state.direction.includes('up')?'rear':'front';
   el.tavi.dataset.turnView=lastVerticalTurnView;
   el.tavi.dataset.turnPhase='0';
   pivotStart=now;pivotUntil=reduced?0:now+156;
   el.tavi.classList.toggle('pivoting',!reduced);
   el.tavi.classList.toggle('turning',!reduced);
 }
 if(pivotUntil&&now>=pivotUntil){
   pivotUntil=0;el.tavi.classList.remove('pivoting');el.tavi.classList.remove('turning');
 }else if(pivotUntil){
   const phase=String(Math.min(2,Math.floor((now-pivotStart)/52)));
   el.tavi.dataset.pivotPhase=phase;
   el.tavi.dataset.turnPhase=phase;
 }
}

function frame(now){
 const dt=Math.min(.05,(now-last)/1000||0);last=now;
 if(mendingUntil&&now>=mendingUntil){
   mendingUntil=0;el.tavi.classList.remove('mending');
 }
 let fieldMotion=false;
 if(modal==='field'&&!mendingUntil){
  let x=(held.right?1:0)-(held.left?1:0);
  let y=(held.down?1:0)-(held.up?1:0);
  let moving=x!==0||y!==0;
  if(!moving&&moveTarget){
   const dx=moveTarget.x-state.x,dy=moveTarget.y-state.y;
   if(Math.hypot(dx,dy*1.25)<6)cancelTap();
   else{x=dx;y=dy;moving=true;}
  }
  if(moving){
   const len=Math.hypot(x,y)||1;
   // Eight-way visual language: custom diagonal facing rather than moonwalked side art.
   const ax=Math.abs(x),ay=Math.abs(y);
   if(x!==0)state.facing=x>0?1:-1;
   if(ay>ax*1.65)state.direction=y<0?'up':'down';
   else if(ax>ay*1.65)state.direction='side';
   else state.direction=y<0?'diag-up':'diag-down';
   const oldX=state.x,oldY=state.y;
   const moved=moveBy(x/len*225*dt,y/len*165*dt);
   if(!moved&&moveTarget)cancelTap();
   if(moveTarget&&Math.hypot(moveTarget.x-state.x,(moveTarget.y-state.y)*1.25)<8)cancelTap();
   el.tavi.classList.toggle('walking',moved);
   if(moved){
    const travelled=Math.hypot(state.x-oldX,(state.y-oldY)*1.35);
    walkDistance+=travelled;
    el.tavi.dataset.stride=String(Math.floor(walkDistance/15)%8);
    fieldMotion=true;
    updatePrompt();
    if(now-lastSavedAt>=1100){save();lastSavedAt=now;}
   }else{
    walkDistance=0;el.tavi.dataset.stride='0';
   }
  }else{
    walkDistance=0;el.tavi.dataset.stride='0';
    el.tavi.classList.remove('walking');updatePrompt();
  }
 }else{
  walkDistance=0;el.tavi.dataset.stride='0';
  el.tavi.classList.remove('walking');el.prompt.classList.add('hidden');
 }
 updateTaviActing(now);
 updateBackdrop(dt);
 updateMorrowAnimation(now);
 if(modal==='field'&&state.metMorrow){updateCompanion(dt);updateCharacter();}
 else if(modal==='field'&&fieldMotion)updateCharacter();
 if(modal==='timing'&&timingActive)el.timingMarker.style.left=progressAt(now)+'%';
 requestAnimationFrame(frame);
}
sync();
if(state.started){el.start.firstChild.textContent='Continue Adventure ';}else{el.start.firstChild.textContent='Open the Book ';}
requestAnimationFrame(frame);
if('serviceWorker' in navigator && location.protocol==='https:'){
  window.addEventListener('load',async()=>{
    try{
      // Same installed Home Screen icon, always the same address. Updates are
      // downloaded when the app opens or resumes with an internet connection.
      const registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
      const checkUpdates=()=>registration.update().catch(err=>console.warn('Version check unavailable',err));
      checkUpdates();
      window.addEventListener('pageshow',checkUpdates);
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdates();});
      setInterval(checkUpdates,15*60*1000);
    }catch(err){console.warn('Offline caching unavailable',err);}
  });
}
})();