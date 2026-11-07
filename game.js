/* FoldFarer: The Unfinished World. First Fold 0.1.0.
   Real, deterministic interactive preview. Original inline SVG stage, no external game art.
   This build is an aesthetic checkpoint, NOT the completed Milestone A vertical slice. */
(function(){
'use strict';
const SAVE_KEY='foldfarer.firstfold.0.1';
const initial=()=>({started:false,x:273,y:654,facing:1,metMorrow:false,mended:false,letter:false,won:false});
function load(){
 try {
   const data=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
   if(data&&typeof data==='object'&&Number.isFinite(data.x)&&Number.isFinite(data.y)){
     return {...initial(),...data,x:Math.max(120,Math.min(1330,data.x)),y:654};
   }
 }catch(e){console.warn('Preview save was not readable; starting new.',e)}
 return initial();
}
let state=load();
const $=id=>document.getElementById(id);
const el={tavi:$('tavi'),enemy:$('enemy'),bridge:$('bridgeFix'),broken:$('brokenBridge'),seam:$('seamLight'),objective:$('objective'),prompt:$('prompt'),promptText:$('promptText'),intro:$('intro'),start:$('start'),dialog:$('dialogue'),speaker:$('speaker'),speakerMark:$('speakerMark'),line:$('line'),nextLine:$('nextLine'),journal:$('journal'),journalButton:$('journalButton'),journalText:$('journalText'),resume:$('resume'),reset:$('reset'),interact:$('interact'),battle:$('battle'),battleTitle:$('battleTitle'),battleIntent:$('battleIntent'),battleLog:$('battleLog'),battleActions:$('battleActions'),timing:$('timing'),timingMarker:$('timingMarker'),timingTap:$('timingTap'),heroHp:$('heroHp'),heroBar:$('heroBar'),enemyHp:$('enemyHp'),enemyBar:$('enemyBar'),foldNode:$('foldNode'),battleDone:$('battleDone')};
let held={left:false,right:false}, dialogue=[],afterDialogue=null,battle=null,timingStart=0,timingActive=false,modal='intro',last=0,lastPrompt='',eventLocks={};
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch(e){console.warn('Could not persist preview progress',e)}}
function objective(){
 if(!state.metMorrow)return 'Find the ink-bird with the missing map.';
 if(!state.mended)return 'Mend the broken bridge at the river seam.';
 if(!state.letter)return 'Speak to Mila, the young courier.';
 if(!state.won)return 'Drive the Paper Scrapper away from the white road.';
 return 'First Fold complete — open your journal to review the trail.';
}
function sync(){
 el.tavi.setAttribute('transform','translate('+state.x.toFixed(1)+' '+state.y+') scale('+state.facing+' 1)');
 el.bridge.setAttribute('class',state.mended?'bridge-open':'bridge-closed');
 el.broken.style.opacity=state.mended?'0':'1';
 el.seam.style.opacity=state.mended?'.22':'1';
 el.enemy.style.display=state.won?'none':'';
 el.objective.textContent=objective();
 el.start.firstChild.textContent=state.started?'Continue Adventure ':'Open the Book ';
 updatePrompt();
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
 dialogue=lines.slice();afterDialogue=typeof done==='function'?done:null;modal='dialogue';el.dialog.classList.remove('hidden');nextLine();
}
function nextLine(){
 const line=dialogue.shift();
 if(!line){
   el.dialog.classList.add('hidden');modal='field';
   const done=afterDialogue;afterDialogue=null;
   if(done)done();
   save();sync();return;
 }
 el.speaker.textContent=line[0];
 el.line.textContent=line[1];
 el.speakerMark.textContent=line[2]||'✦';
 el.nextLine.textContent=dialogue.length?'Continue ›':'Close ›';
}
function nearest(){
 const x=state.x;
 const choices=[
  {key:'morrow',x:474,r:88,text:'Speak with Morrow'},
  {key:'seam',x:689,r:90,text:state.mended?'Inspect the repaired seam':'Mend the broken paper bridge'},
  {key:'mila',x:1024,r:94,text:'Speak with Mila'},
  {key:'scrapper',x:1244,r:98,text:state.won?'Inspect the quiet road':'Challenge the Paper Scrapper'}
 ];
 return choices.filter(p=>Math.abs(x-p.x)<=p.r).sort((a,b)=>Math.abs(x-a.x)-Math.abs(x-b.x))[0]||null;
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
     ],()=>{state.mended=true;save();sync();});
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
function openBattle(){
 battle={hero:24,enemy:26,round:1,fold:0,morrowWeak:false,guard:false,busy:false,finished:false};
 modal='battle';el.battle.classList.remove('hidden');
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
 if(kind==='morrow'){battle.enemy=Math.max(0,battle.enemy-6);battle.morrowWeak=true;afterHeroAction('Morrow’s ink needle marks the Scrapper for 6 damage and blots its next attack.');}
 if(kind==='fold'){battle.fold=1;afterHeroAction('Tavi folds a hanging paper panel into protective cover.');}
 if(kind==='guard'){battle.guard=true;afterHeroAction('Tavi braces the Mender’s Needle and waits for the swipe.');}
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
 afterHeroAction('Needle Strike — '+(perfect?'PERFECT STITCH!':success?'Clean stitch!':'Glancing stitch.')+' '+damage+' damage.');
}
function finishBattle(win){
 if(!battle)return;
 battle.finished=true;battle.busy=true;timingActive=false;modal='battle';
 el.timing.classList.add('hidden');el.battleActions.classList.add('hidden');el.battleDone.classList.remove('hidden');
 if(win){
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
 const left=['ArrowLeft','KeyA'].includes(key),right=['ArrowRight','KeyD'].includes(key);
 if(left||right){held[left?'left':'right']=value;return true;}
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
window.addEventListener('blur',()=>{held.left=false;held.right=false;save();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){held.left=false;held.right=false;save();}});
for(const key of document.querySelectorAll('[data-move]')){
 const direction=key.dataset.move;
 const stop=()=>{held[direction]=false;key.classList.remove('active');};
 key.addEventListener('pointerdown',e=>{e.preventDefault();key.setPointerCapture(e.pointerId);held[direction]=true;key.classList.add('active');});
 key.addEventListener('pointerup',stop);key.addEventListener('pointercancel',stop);key.addEventListener('lostpointercapture',stop);
}
el.start.addEventListener('click',startGame);
el.interact.addEventListener('click',interact);
el.nextLine.addEventListener('click',nextLine);
el.journalButton.addEventListener('click',()=>{if(modal==='journal')closeJournal();else openJournal();});
el.resume.addEventListener('click',closeJournal);
el.reset.addEventListener('click',()=>{
 if(!window.confirm('Restart this aesthetic preview and clear its local progress?'))return;
 localStorage.removeItem(SAVE_KEY);state=initial();eventLocks={};dialogue=[];afterDialogue=null;closeJournal();showIntro();sync();
});
el.battleActions.addEventListener('click',e=>{const button=e.target.closest('[data-battle]');if(button)chooseBattle(button.dataset.battle);});
el.timingTap.addEventListener('click',strike);
el.battleDone.addEventListener('click',endBattle);
function frame(now){
 const dt=Math.min(.05,(now-last)/1000||0);last=now;
 if(modal==='field'){
   const direction=(held.right?1:0)-(held.left?1:0);
   if(direction){
     const prior=state.x;state.facing=direction===1?1:-1;
     state.x=Math.max(100,Math.min(1350,state.x+direction*225*dt));
     if(!state.mended){
       if(prior<=705&&state.x>705)state.x=705;
       if(prior>=845&&state.x<845)state.x=845;
     }
     el.tavi.classList.add('walking');sync();
   }else{el.tavi.classList.remove('walking');updatePrompt();}
 }else{el.tavi.classList.remove('walking');el.prompt.classList.add('hidden');}
 if(modal==='timing'&&timingActive){el.timingMarker.style.left=progressAt(now)+'%';}
 requestAnimationFrame(frame);
}
sync();
if(state.started){el.start.firstChild.textContent='Continue Adventure ';}else{el.start.firstChild.textContent='Open the Book ';}
requestAnimationFrame(frame);
if('serviceWorker' in navigator && location.protocol==='https:'){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('Offline caching unavailable',err)));
}
})();