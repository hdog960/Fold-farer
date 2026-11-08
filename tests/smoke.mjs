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
assert(css.includes('#tavi.walking[data-stride="0"]')&&css.includes('#tavi.walking[data-stride="7"]'),'Eight painted gait frames required');
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

const gaitViews=['front','rear','side','quarter-front','quarter-rear'];
const gaitCels=[...html.matchAll(/class="tavi-walk-cel" data-cel="([0-7])" data-direction="([^"]+)"/g)];
assert(gaitCels.length===40,'Tavi requires 40 distinct illustrated walk poses');
for(const view of gaitViews){
 const cels=gaitCels.filter(x=>x[2]===view).map(x=>x[1]);
 assert.deepEqual(cels,['0','1','2','3','4','5','6','7'],'Missing direction-specific full shoe artwork for '+view);
}
assert((html.match(/class="tavi-atlas-left"/g)||[]).length===40,'Every frame requires a complete illustrated left shin/boot');
assert((html.match(/class="tavi-atlas-right"/g)||[]).length===40,'Every frame requires a complete illustrated right shin/boot');
assert(css.includes('#tavi.walking .tavi-foot{display:none!important}'),'The old leg-rotation system must not remain active during walking');
assert(game.includes('Math.floor(walkDistance/15)%8'),'Gait must advance from actual traveled distance, not an autoplay clock');
const bodyPoseNames=['front','rear','side','quarter-front','quarter-rear'];
const upperFrames=[...html.matchAll(/class="tavi-upper-cel" data-upper-frame="([0-7])" data-upper-view="([^"]+)"/g)];
assert(upperFrames.length===40,'The hero needs forty separate upper-body illustration frames');
for(const view of bodyPoseNames){
 const cells=upperFrames.filter(x=>x[2]===view).map(x=>x[1]);
 assert.deepEqual(cells,['0','1','2','3','4','5','6','7'],'Missing authored upper-body frames for '+view);
}
assert((html.match(/class="tavi-rest-torso"/g)||[]).length===5,'Original costume artwork must remain for standing and portrait');
assert((html.match(/class="tavi-upper-coat"/g)||[]).length===40,'Every cel requires its own paper-cut coat outline');
assert((html.match(/class="tavi-upper-arm tavi-upper-left"/g)||[]).length===40,'Left sleeve and hand must be redrawn on every beat');
assert((html.match(/class="tavi-upper-arm tavi-upper-right"/g)||[]).length===40,'Right sleeve and hand must be redrawn on every beat');
assert((html.match(/class="tavi-upper-scarf"/g)||[]).length===40,'Scarf tails must be fully illustrated on every beat');
assert((html.match(/class="tavi-upper-hair-details"/g)||[]).length===40,'Hair outlines require alternative artwork');
assert(css.includes('#tavi.walking .tavi-rest-torso')&&css.includes('#tavi.walking[data-stride="7"] .tavi-upper-cel'),
 'Remove static torso from walk and select the correct drawn upper-body frame');
const moods=[...html.matchAll(/class="tavi-face-expression" data-face-mood="([^"]+)"/g)].map(m=>m[1]);
assert(moods.length===12,'Expected four original facial expressions in three directional viewpoints');
for(const mood of ['curious','pleased','concerned','determined'])
 assert(moods.filter(x=>x===mood).length===3,'Missing directional expression: '+mood);
assert((html.match(/class="tavi-pivot-cel"/g)||[]).length===3,'Three hand-drawn pivot poses required');
assert(ids.includes('taviPivotArtwork'),'The actor must own the illustrated pivot');
assert(game.includes('function updateTaviActing(now)')&&game.includes('pivotUntil'),
 'Live gameplay must own all speaking/pivot time state');
assert(css.includes('#tavi.speaking[data-mood="curious"]')&&css.includes('#tavi.pivoting[data-pivot-phase="2"]'),
 'Expressions and pivots must be connected to the visible source art');

const fullTurn=[...html.matchAll(/class="tavi-turn-cel" data-turn-view="(front|rear)" data-turn-phase="([0-2])"/g)].map(m=>m[1]+':'+m[2]);
assert.deepEqual(fullTurn,['front:0','front:1','front:2','rear:0','rear:1','rear:2'],
 'Two complete 3-frame illustrated turning sequences required');
assert(ids.includes('taviTurnAtlas'),'Missing in-world original full-body turning artwork');
const owlReactions=[...html.matchAll(/class="morrow-reaction-cel" data-reaction="([^"]+)" data-beak="([01])"/g)].map(m=>m[1]+':'+m[2]);
assert.deepEqual(owlReactions,['attentive:0','attentive:1','alarmed:0','alarmed:1','delighted:0','delighted:1'],
 'Three expressive owl faces need fully drawn alternate beak frames');
assert(css.includes('#tavi.turning #taviTurnAtlas')&&css.includes('#morrow.reacting .morrow-rest-face'),
 'Real art must replace, never overlap, resting source art');
assert(game.includes("el.tavi.classList.toggle('turning',!reduced)")&&game.includes("el.morrow.dataset.reaction=birdMood"),
 'World animation loop must drive both full-body turns and companion reactions');

const stairFaces=[...html.matchAll(/class="terrace-stair-fold" data-step="([1-6])"/g)].map(m=>m[1]);
assert.deepEqual(stairFaces,['1','2','3','4','5','6'],'North Terrace must have six fully built page-edge profiles');
for(const id of ['terraceStairFoldAssembly','terraceStairRakingLight',
                  'terraceCutPageFace','terraceStepUnderlip','terraceGrazingGold'])
 assert(ids.includes(id),'Missing original physical paper construction or light material: '+id);
assert(css.includes('#terraceStairFoldAssembly *')&&css.includes('pointer-events:none!important'),
 'All new detailed step edges must be non-interactive and leave gameplay untouched');
const riserInGround=html.indexOf('id="terraceStairFoldAssembly"');
const pavement=html.indexOf('id="terracePavingInlay"');
const stage=html.indexOf('id="terraceDepthStage"');
assert(riserInGround>0&&riserInGround<pavement&&pavement<stage,
 'Physical page cross-sections must paint on the stable ground BEHIND actors');

const newPaperLayers=['terracePaperArchitecture','terraceDyerPaperCore','terraceConservatoryPaperCore',
 'terraceNaturalMarginalia','terraceDyerHerbs','terraceConservatorySpores','terracePressedPetals',
 'terraceRoofStrata','terraceWallCavity','terraceContactGold','taviContactBounce','morrowContactBounce'];
for(const id of newPaperLayers)assert(ids.includes(id),'Missing 0.21 original in-world artwork: '+id);
assert(html.indexOf('id="terraceNaturalMarginalia"')<html.indexOf('id="terraceSideWalls"'),
 'Ground vegetation must be behind stage walls');
assert(html.indexOf('id="terraceSideWalls"')<html.indexOf('id="terracePaperArchitecture"')&&
       html.indexOf('id="terracePaperArchitecture"')<html.indexOf('id="terraceDepthStage"'),
 'Paper core architecture must live behind depth-sorted actors');
assert(css.includes('#terraceNaturalMarginalia *{pointer-events:none!important}'),
 'Plant decoration must never consume touch input');
assert(game.includes('distanceToLantern=Math.hypot(state.x-371')&&
       game.includes("el.taviContactBounce.setAttribute('opacity'")&&
       game.includes("el.morrowContactBounce.setAttribute('opacity'"),
 'New lighting must respond to physical world position in real gameplay');
assert(html.includes('id="taviGroundShadow"')&&html.includes('id="morrowGroundShadow"'),
 'World-space contact lighting must preserve both original foot anchors');
assert(sw.includes('foldfarer-shell-0.39'),'The existing Home Screen PWA must refresh 0.26.1 assets');


const backdropLayers=['terraceMountainCard','terraceShadowValley','terraceMidlandInk',
 'terraceSkyVellum','terraceDistantCards','terraceWeatherVellum','terraceMountainBack',
 'terraceValleyCard','terraceHillsideHamlet','terraceHillsideBellhouse',
 'terraceHillsideGlasshouse','terraceMidgroundCards','terraceLandscapeRetainingWall',
 'terraceWildCopse','terraceWillowSprig','terraceBookleafTree',
 'terraceCypressCluster','terraceValleyThread',
 'terraceLetterpressPlaque','terraceLetterpressTitle'];
for(const id of backdropLayers)assert(ids.includes(id),'Missing 0.22 hand-built scenic layer: '+id);
const farCard=html.indexOf('id="terraceDistantCards"'),midCard=html.indexOf('id="terraceMidgroundCards"');
const gateCard=html.indexOf('id="terraceGateBack"'),floorCard=html.indexOf('id="terraceGround"');
assert(farCard>0&&farCard<midCard&&midCard<gateCard&&gateCard<floorCard,
 'No distant or midground paint layer may cover the gate or true walk plane');
assert(css.includes('#terraceMidgroundCards *{pointer-events:none!important}'),
 'Scenery must never steal tap-to-walk or interaction input');
assert(game.includes("terraceMidRidges:$('terraceMidgroundCards')")&&
 game.includes("backdrop.terraceX*.43")&&game.includes("backdrop.terraceY*.55"),
 'Independent physical depth layers require separate deterministic parallax');
assert(!html.includes('M-10 302 122 176 228 229 350 134'),
 'Generic zig-zag mountain card must be replaced, not covered with a decal');
assert(sw.includes('foldfarer-shell-0.39'),'Mobile must fetch the new 0.26.1 build');


const identityIds=['terraceDyeEnamel','terraceDyeCavity','terraceHerbVellum','terraceHerbRib',
 'terraceCraftedShopfronts','terraceDyerIdentity','terraceDyeTower','terraceDyerRecess',
 'terraceDyerSign','terraceDyerSilkCurtain','terraceConservatoryIdentity',
 'terraceConservatoryCupola','terraceVellumBay','terraceHerbariumPlaque','terraceVellumSpecimens'];
for(const id of identityIds)assert(ids.includes(id),'0.23 identity artwork missing: '+id);
const shopLayer=html.indexOf('id="terraceCraftedShopfronts"');
assert(shopLayer>html.indexOf('id="terraceMaterialStories"')&&
 shopLayer<html.indexOf('id="terraceLightShift"')&&
 shopLayer<html.indexOf('id="terraceDepthStage"'),
 'Structural shopfronts must paint after old building texture, but behind active actors');
assert(css.includes('#terraceCraftedShopfronts *{pointer-events:none!important}'),
 'No artwork may intercept tap-to-walk or accessible act button');
assert(css.includes('@keyframes terraceFabricBreathe')&&
 css.includes('@media(prefers-reduced-motion:reduce)'),
 'Moving paper ornaments must preserve reduced-motion compatibility');
assert((html.match(/class="terrace-silk-ribbon/g)||[]).length===3&&
 (html.match(/class="terrace-botanical-hanger/g)||[]).length===3,
 'Six individually hung silk/botanical shapes must be present');
assert(html.includes('>INK DYER</text>')&&html.includes('>HERBARIUM</text>'),
 'Each building needs a readable, distinct shop identity');


assert(html.includes('id="terraceDyerSign" transform="translate(171 -115)"'),
 'Dyer sign must clear the iPhone movement controls, not sit below them');
assert(html.includes('M60 563v28m131-36 13 43'),
 'Moved sign requires its illustrated physical hanging mount');

const cohesionIds=['terraceFolioPewter','terraceEtchedInk','terraceCastInk',
 'terraceRibbonLeaves','terraceBookbinderWalkway','terraceLongCastShadows',
 'terraceGateCardFooting','terraceMenderInlay','terraceBindingSutures'];
for(const id of cohesionIds)assert(ids.includes(id),'0.24 grounded environmental art missing: '+id);
assert(html.indexOf('id="terracePavingInlay"')<html.indexOf('id="terraceBookbinderWalkway"')&&
 html.indexOf('id="terraceBookbinderWalkway"')<html.indexOf('id="terraceNaturalMarginalia"')&&
 html.indexOf('id="terraceBookbinderWalkway"')<html.indexOf('id="terraceDepthStage"'),
 'Story engraving and cast shadows must be stationary and behind characters');
assert(html.includes('class="terrace-leaf-sway" transform="translate(-62 -38) scale(.78)"'),
 'Tree foliage should stop hiding the conservatory display');
assert(html.includes('id="terraceRibbonTree" transform="translate(1177 591)"'),
 'Ribbon tree physics must not be moved merely for canopy clearance');
assert(css.includes('#terraceBookbinderWalkway *')&&
 css.includes('pointer-events:none!important'),
 'Painted ground shadows must not steal tapping');
assert(sw.includes('foldfarer-shell-0.39'),'0.26.1 assets must invalidate earlier Home Screen cache');


const upperPoseViews=['front','rear','side','quarter-front','quarter-rear'];
const authoredCoatRims=(html.match(/class="tavi-cardstock-coat-edges"/g)||[]).length;
assert(authoredCoatRims===40,'0.25 must have original drawn cardstock edges in ALL 40 upper-body cels');
for(const view of upperPoseViews){
 const n=(html.match(new RegExp('data-coat-view="'+view+'"','g'))||[]).length;
 assert(n===8,'Missing original garment rim for '+view+': '+n+'/8');
}
for(const id of ['farerCoatBindLight','morrowFeatherBindLight','morrowCardstockFeathers',
 'taviFootOcclusion','morrowFeatherOcclusion'])
 assert(ids.includes(id),'0.25 paper character material missing: '+id);
assert(css.includes('#tavi.walking{animation:none!important;translate:0 0!important}') &&
 css.includes('#tavi.walking #taviFlip{animation:farerBodyStride') &&
 css.includes('#taviGroundShadow,#morrowGroundShadow{animation:none!important'),
 'World-positioned shadows must not bounce when character bodies animate');
assert(html.indexOf('id="taviGroundShadow"')<html.indexOf('id="taviFlip"') &&
 html.indexOf('id="morrowGroundShadow"')<html.indexOf('id="morrowSprite"'),
 'Stationary ground shadow must be sibling before animated sprite, not its child');
assert(game.includes("el.tavi.style.setProperty('--paper-rim-strength'") &&
 game.includes("el.morrow.style.setProperty('--paper-rim-strength'"),
 'Actor fabric reflections must change with physical scene lighting');
assert(sw.includes('foldfarer-shell-0.39'),'PWA must refresh the 0.25 art assets');


const watercolorViews=['front','rear','side','quarter-front','quarter-rear'];
const coatedCels=[...html.matchAll(/<g class="tavi-upper-cel" data-upper-frame="([0-7])" data-upper-view="([^"]+)" aria-hidden="true">\s*<g class="tavi-upper-coat">\s*<path[^>]*fill="url\(#farerCoatShell-([^\)]+)\)"[^>]*\/>\s*<path[^>]*fill="url\(#farerCoatPanel-([^\)]+)\)"/g)];
assert(coatedCels.length===40,'All 40 original moving coat cels must use two real painted material surfaces');
for(const view of watercolorViews){
 assert(coatedCels.filter(m=>m[2]===view&&m[3]===view&&m[4]===view).length===8,
  'Incorrect character material on original '+view+' walking frames');
 assert(ids.includes('farerCoatShell-'+view)&&ids.includes('farerCoatPanel-'+view),
  'Watercolor cardstock gradient missing on '+view);
 assert(html.includes('data-hair-view="'+view+'"'),'Hand-inked hair contour missing in '+view);
}
assert((html.match(/class="tavi-upper-scarf"/g)||[]).length===40 &&
 (html.match(/fill="url\(#farerScarfCloth\)"/g)||[]).length===80,
 'All 40 original animated scarf shapes must share hand-washed cloth material');
assert((html.match(/fill="url\(#morrowWingInk(?:Left|Right)\)"/g)||[]).length===8,
 'All eight real animated Morrow wing silhouettes must use watercolor paper materials');
for(const id of ['taviRearHairCut','terraceArchEdgeRelief','farerHairFront',
 'farerHairRear','morrowBodyInk','morrowChestInk','terraceArchWatercolor'])
 assert(ids.includes(id),'0.26 physical character/gateway art missing: '+id);
assert(html.indexOf('id="terraceArchEdgeRelief"')<html.indexOf('id="terraceGround"'),
 'The dimensional arch must stay behind the true walk plane and characters');
assert(css.includes('#tavi .farer-hair-volume *')&&
 css.includes('#terraceArchEdgeRelief *{pointer-events:none!important}'),
 'Paper details must never intercept touch-to-walk');
assert(sw.includes('foldfarer-shell-0.39'),'Existing iPhone Home Screen cache must refresh 0.26 artwork');


assert(html.includes('id="taviRearHairCut" d="M-34-146Q-42-165-31-180'),
 '0.26.1 must use the corrected, asymmetrical rear hair silhouette');
assert(!html.includes('M-30-144Q-10-120 12-142l20 2') &&
 !html.includes('M-19-168Q-11-194 12-187'),
 'Do not reintroduce harsh looping hair lines that obscured the actual character silhouette');
assert((html.match(/data-hair-view="rear"/g)||[]).length===1 &&
 (html.match(/<g class="farer-hair-volume"/g)||[]).length===5,
 'Keep one carefully illustrated hair texture per authentic facing, no duplicated overlays');
assert(sw.includes('foldfarer-shell-0.39'),'0.26.1 needs a fresh installed Home Screen cache');

console.log('FoldFarer static smoke checks passed:',ids.length,'HTML element IDs; JS parsed; references verified.');