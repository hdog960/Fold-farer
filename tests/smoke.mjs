import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),game=read('game.js'),css=read('styles.css'),sw=read('sw.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
new Script(game,{filename:'game.js'});
new Script(sw,{filename:'sw.js'});
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate id attributes');
for(const id of [...game.matchAll(/\$\('([^']+)'\)/g)].map(x=>x[1]))assert(ids.includes(id),'Referenced HTML id absent: '+id);
for(const file of ['styles.css','game.js','manifest.webmanifest','icon.svg'])assert(html.includes('./'+file),'HTML missing '+file);
for(const x of ['bridgeFix','brokenBridge','tavi','taviBackArt','taviSideArt','depthStage','paperPlanter','folioNotice','paperBench','courtyardDepth','folioScene','atelierScene','atelierDepthStage','atelierLoom','atelierSpoolCart','atelierDyeBench','tapMarker','morrow','mila','enemy','timing','battle','journal'])assert(ids.includes(x),'Missing interactive element '+x);
for(const id of ['morrowSprite','taviFrontQuarterArt','taviBackQuarterArt','portraitBadge','portraitSvg','portraitUse','battleTaviArt','battleScrapperArt','taviSprite','battleDiorama'])assert(ids.includes(id),'Missing game-sourced battle/portrait art '+id);
for(const id of ['mila-letter-hand','scrapper-sword-arm'])assert(html.includes(id),'Missing animated actor detail '+id);
assert(html.includes('<use href="#taviSprite"/>'),'Battle Tavi art must be in local actor coordinates');
assert(game.includes("Tavi:['taviSprite',0,0]"),"Tavi's portrait must not use moving world coordinates");
for(const id of ['battleEffects','needleSlash','inkNeedle','foldShield','guardGlyph','enemyImpact','enemyPaperBurst'])assert(ids.includes(id),'Foldline action art missing '+id);
assert(html.includes('id="paperBotanicalGarden"'),'Missing cut-paper garden');
assert([...html.matchAll(/id="tree-[0-9]+"/g)].length===11,'Botanical count changed');
for(let type=0;type<5;type++)assert(html.includes('tree-family-'+type),'Missing cut-paper silhouette family '+type);
assert(css.includes('farerFootForward')&&css.includes('farerShoulder'),'Missing real gait motion');
assert(game.includes('else if(modal===\'field\'&&fieldMotion)updateCharacter()'),'Tap-to-walk art must advance without a companion');
assert.equal(manifest.display,'standalone');
assert.equal(manifest.start_url,'./');
for(const direction of ['up','down','left','right'])assert(html.includes('data-move="'+direction+'"'),'Missing '+direction+' touch button');
assert(game.includes('canStand')&&game.includes('ArrowUp')&&game.includes('sync'), 'Missing depth traversal plumbing');
for(const id of ['paintedPaperRidges','handPaintedCanopies','craftArchitecture','craftGround','craftMotes','atelierArtFinishing'])assert(html.includes('id="'+id+'"'),'Missing art element '+id);
for(const id of ['craftFibers','craftRoof','craftVeins','craftWeave','craftWood'])assert(html.includes('id="'+id+'"'),'Missing vector paper pattern '+id);
for(const id of ['riverCutout','riverHighlights','brokenBridge','bridgeFix','seamLight'])assert(ids.includes(id),'Foldline paper river art missing '+id);
for(const id of ['dimensionalArchitecture','folioBindingHouse','threadsTailorHouse','postboundHouse','edgePaperHouse','architectSide','architectPaperEdge']){
 assert(ids.includes(id),'Missing built paper house art: '+id);
}
for(const id of ['folioNorthGate','terraceScene','terraceDistantCards','terraceGateBack','terraceGround','terraceSideWalls','terraceDepthStage','terraceBell','terraceLantern','terraceKiosk','terraceRibbonTree','terraceNearEdge']){
 assert(ids.includes(id),'Connected 2.5D terrace asset missing '+id);
}
assert(game.includes("terrace:[155,1280,400,770]"),'Terrace must have a distinct deep walkable footprint');
assert(game.includes("state.area==='terrace'"),'Terrace actor depth sorting and scene switching are missing');
assert(ids.includes('taviFlip'),'Separate hero mirroring group missing');
assert(game.includes("el.taviFlip.setAttribute('transform'"),'Mirror must affect only local hero art');
assert(game.includes("state.facing+' 1)'"),'Hero mirroring must be horizontal only, never invert Y');
assert(css.includes('prompt.terrace-prompt'),'Terrace-specific HUD position not implemented');
assert(css.includes('#tavi{transform-box:view-box;transform-origin:0 0}'),'SVG hero scale anchor must remain at actor feet');
for(const id of ['terracePavingInlay','terraceFacadeFinish','inkDyersNook','vellumConservatory','terraceDyersBench','terraceLetterCabinet']){
 assert(ids.includes(id),'Terrace sculptural material missing: '+id);
}
assert((html.match(/class="tavi-eyes-blink"/g)||[]).length===3,'Front, side and 3/4 forward need eyelid sprites');
assert(css.includes('farerClosedEyes')&&css.includes('terraceLanternFlicker'),'Character or lantern living art missing');
assert(game.includes('terraceDyersBench:563,terraceLetterCabinet:555'),'New physical props must be ordered by foot depth');
assert(css.includes('prefers-reduced-motion:reduce'));
assert(sw.includes('caches.open'));
assert(ids.includes('taviMendArc'),'The in-world needle gesture is missing');
assert((html.match(/class="stride-contact-ground"/g)||[]).length===5,'Five directional poses need ground contact art');
assert(css.includes('#tavi.walking[data-stride="0"]')&&css.includes('#tavi.walking[data-stride="3"]'),'Four unique gait frames required');
assert(game.includes('walkDistance+=travelled')&&game.includes('mendingUntil'),'Movement and Mending must be driven by game state');
for(const id of ['terraceMaterialStories','terraceDyerSilks','terraceBotanicalRelief','terraceGateEngraving','terraceLightShift']){
 assert(ids.includes(id),'Missing authored dimensional terrace illustration: '+id);
}
for(const gradient of ['terraceDyeSilk','terraceGlassPaper','terraceWarmBounce','terraceArchUnderside']){
 assert(html.includes('id="'+gradient+'"'),'Missing transparent material treatment: '+gradient);
}
assert(css.includes('#terraceMaterialStories *')&&css.includes('pointer-events:none!important'),
 'Decorative material overlays must not capture iPhone taps');
assert(game.includes('el.terraceLightShift.setAttribute('),'Light parallax must remain separate from physical stage');
const wingFrameIDs=[...html.matchAll(/class="morrow-wing-frame" data-wing-frame="([0-3])"/g)].map(m=>m[1]);
assert.deepEqual(wingFrameIDs,['0','1','2','3'],'Four alternate original bird wing drawings required');
for(const id of ['morrowGroundShadow','taviGroundShadow','actorGroundInk'])
 assert(ids.includes(id),'Missing grounded actor rendering: '+id);
assert(game.includes('function updateMorrowAnimation(now)')&&game.includes('morrowWingCycle'),
 'Wing animation must use the running world loop');
assert(game.includes('Math.hypot(state.x-oldX,state.y-oldY)>.01'),
 'A map boundary must not trigger fake walking');
assert(css.includes('#morrow[data-flap="3"]')&&css.includes('#morrowSprite{animation:birdBob'),
 'All flight frames and separate flying body motion required');
console.log('FoldFarer static smoke checks passed:',ids.length,'HTML element IDs; JS parsed; references verified.');