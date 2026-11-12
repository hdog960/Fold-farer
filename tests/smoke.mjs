import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),game=read('game.js'),css=read('styles.css'),sw=read('sw.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
// All historical art gates require an advanced offline shell, not a frozen version.
const shellVersion=sw.match(/const CACHE = 'foldfarer-shell-0\.(\d+)'/);
assert(shellVersion && Number(shellVersion[1])>=50,'Installed Home Screen cache must be at least 0.50');
new Script(game,{filename:'game.js'});
new Script(sw,{filename:'sw.js'});
// Mobile perf: avoid invalidating detailed actor SVGs for identical paint
// values, unchanged directional pose and stationary ground-contact shadows.
for(const name of ['setPaintProperty','setPaintOpacity','setDirectionClass'])
 assert(game.includes('function '+name+'('),'Missing cached actor rendering: '+name);
assert(game.includes("setPaintProperty(el.morrow,'--morrow-flight-bank'") &&
       game.includes("setPaintOpacity(el.taviContactBounce") &&
       game.includes("setDirectionClass(el.tavi,state.direction)"),
       'The character frame loop must not issue unchanged SVG paint writes');
assert(game.includes("const touchScenery=!!window.matchMedia?.('(pointer: coarse)').matches;"),'Touch devices must not pan giant scenic cards per frame');
assert(game.includes('lastBackdropTransforms')&&game.includes('setSceneryTransform'),'SVG scenery updates must be cached');
assert(css.includes('@media (pointer: coarse)')&&css.includes('#world { filter:none!important; }'),'Handheld rendering budget missing');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate id attributes');
for(const id of ['terraceBookbindersQuarter','terraceQuarterBackCard','terraceQuarterBindery','terraceQuarterScriptorium','terraceQuarterBellTower','terraceQuarterRibbonWalk'])
  assert(ids.includes(id),'Missing authored North Terrace bookbinders quarter layer: '+id);
const quarter=html.slice(html.indexOf('id="terraceBookbindersQuarter"'),html.indexOf('id="terraceQuarterRibbonWalk"'));
assert((quarter.match(/<path /g)||[]).length>=38,'Terrace quarter lost its dimensional individual cardstock planes');
assert(html.indexOf('id="terraceBookbindersQuarter"')>html.indexOf('id="terraceDistantCards"'),'Quarter must remain in distant parallax scenery');
assert(html.indexOf('id="terraceBookbindersQuarter"')<html.indexOf('id="terraceDepthStage"'),'Quarter must not obscure traversing characters');

// The ink orchard must be constructed from four separate, multi-plane tree
// illustrations in the parallax midground, not overlaid on the player stage.
for(const id of ['terraceInkOrchard','terraceInkTree1','terraceInkTree2','terraceInkTree3','terraceInkTree4'])
  assert(ids.includes(id),'Missing authored North Terrace ink orchard element: '+id);
const orchard=html.slice(html.indexOf('id="terraceInkOrchard"'),html.indexOf('id="terraceLandscapeRetainingWall"'));
assert((orchard.match(/<path /g)||[]).length>=37,'Ink orchard lost its distinct canopy, trunk, branch and stitching planes');
assert(html.indexOf('id="terraceMidgroundCards"')<html.indexOf('id="terraceInkOrchard"') && html.indexOf('id="terraceInkOrchard"')<html.indexOf('id="terraceDepthStage"'),'Ink orchard must remain in background parallax behind playable actors');

// Suspended paper viaduct is an actual layered architectural landmark,
// not a foreground decal that would cover player movement.
assert(ids.includes('terraceQuarterThreadViaduct'),'Missing suspended North Terrace cardstock viaduct');
const viaduct=html.slice(html.indexOf('id="terraceQuarterThreadViaduct"'),html.indexOf('id="terraceQuarterWorkshopRow"'));
assert((viaduct.match(/<path /g)||[]).length>=20,'Viaduct lost its authored suspension, arches or deck faces');
assert(html.indexOf('id="terraceQuarterBackCard"')<html.indexOf('id="terraceQuarterThreadViaduct"'),'Viaduct must sit in front of distant back card');
assert(html.indexOf('id="terraceQuarterThreadViaduct"')<html.indexOf('id="terraceQuarterWorkshopRow"'),'Workshop facades must occlude distant viaduct');
assert(html.indexOf('id="terraceQuarterThreadViaduct"')<html.indexOf('id="terraceDepthStage"'),'Viaduct must not cover traversing actors');

// The new workshops are complete dimensional structures, not decorative strokes.
for(const id of ['terraceQuarterWorkshopRow','terraceQuarterPaperMill','terraceQuarterInkHouse','terraceQuarterHangingSign'])
  assert(ids.includes(id),'Missing authored bookbinders workshop layer: '+id);
const workshop=html.slice(html.indexOf('id="terraceQuarterWorkshopRow"'),html.indexOf('id="terraceQuarterBindery"'));
assert((workshop.match(/<path /g)||[]).length>=28,'Bookbinders workshop row lost dimensional faces, roof planes or windows');
assert(html.indexOf('id="terraceQuarterWorkshopRow"')>html.indexOf('id="terraceDistantCards"'),'Workshops must belong to the distant card');
assert(html.indexOf('id="terraceQuarterWorkshopRow"')<html.indexOf('id="terraceDepthStage"'),'Workshops must stay behind traversing actors');
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
// The art refresh must occur both after real translation (including tap-to-walk
// before Morrow joins) and after a blocked directional turn. Do not freeze this
// assertion to the older exact branch text: the facing correction intentionally
// broadens the condition without removing the original movement behavior.
assert(/else if\s*\(modal==='field'\s*&&\s*\(fieldMotion\s*\|\|\s*priorArtFacing!==state\.direction\+'\:'\+state\.facing\)\)\s*updateCharacter\(\)/.test(game),
 'Field art must refresh on movement and blocked facing changes without a companion');
assert(game.includes('tapStallFrames>=12') && game.includes('distanceAfter>=distanceBefore-.1'),
 'Tap-to-walk must stop sliding when a reachable-looking destination is blocked by scenery');
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
assert(/const CACHE = 'foldfarer-shell-0\.(?:[5-9]\d|\d{3,})'/.test(sw),
 'The Home Screen service-worker cache must advance beyond 0.49 after new artwork');


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
assert((shellVersion && Number(shellVersion[1])>=50),'Mobile must fetch the new 0.27 build');


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
assert((shellVersion && Number(shellVersion[1])>=50),'0.27 assets must invalidate earlier Home Screen cache');


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
assert((shellVersion && Number(shellVersion[1])>=50),'PWA must refresh the 0.25 art assets');


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
assert((shellVersion && Number(shellVersion[1])>=50),'Existing iPhone Home Screen cache must refresh 0.26 artwork');


assert(html.includes('id="taviRearHairCut" d="M-34-146Q-42-165-31-180'),
 '0.26.1 must use the corrected, asymmetrical rear hair silhouette');
assert(!html.includes('M-30-144Q-10-120 12-142l20 2') &&
 !html.includes('M-19-168Q-11-194 12-187'),
 'Do not reintroduce harsh looping hair lines that obscured the actual character silhouette');
assert((html.match(/data-hair-view="rear"/g)||[]).length===1 &&
 (html.match(/<g class="farer-hair-volume"/g)||[]).length===5,
 'Keep one carefully illustrated hair texture per authentic facing, no duplicated overlays');
assert((shellVersion && Number(shellVersion[1])>=50),'0.26.1 needs a fresh installed Home Screen cache');


const materialPropIds=['terraceBellCopper','terraceBellHollow','terraceBookRoof',
 'terraceBookSpine','terraceBookLeaves','terraceTreeBark',
 'terraceBellFoldedPlinth','terraceBellPavilion','terraceBellHanging',
 'terraceFolioKioskBase','terraceFolioKioskHinges',
 'terraceFolioKioskCanopy','terraceFolioKioskPages',
 'terraceKioskPaperTabs','terraceTreeBranchConstruction'];
for(const id of materialPropIds)
 assert(ids.includes(id),'0.27 original in-world papercraft geometry missing: '+id);
assert(html.includes('id="terraceBell" transform="translate(719 484)"') &&
 html.includes('id="terraceKiosk" transform="translate(1022 660)"') &&
 html.includes('id="terraceRibbonTree" transform="translate(1177 591)"'),
 '0.27 art must not move bell, kiosk, or tree collision/interact anchors');
assert(html.includes('class="terrace-leaf-sway" transform="translate(-62 -38) scale(.78)"'),
 'Tree sightline must preserve the previously approved visibility checks');
assert(css.includes('#terraceBell *')&&css.includes('#terraceKiosk *')&&
 css.includes('#terraceTreeBranchConstruction *'),
 'World art must remain touch-transparent on iPhone');
assert(html.indexOf('id="terraceBellFoldedPlinth"')<html.indexOf('id="terraceBellPavilion"') &&
 html.indexOf('id="terraceBellPavilion"')<html.indexOf('id="terraceBellHanging"'),
 'Bell must have real independent physical layers rather than flat stickers');
assert((shellVersion && Number(shellVersion[1])>=50),'PWA must invalidate earlier 0.26.1 offline shell');

// 0.28 original artwork is integrated into the live terrace, not a detached mockup.
for(const id of ['terraceAtmosphericWatercolor28','terraceDyerSilkRelief28',
 'terraceConservatoryBotanicalEtching28','terraceLeafClusterStructure28'])
 assert(ids.includes(id),'Missing original in-engine terrace art: '+id);
const terraceStart=html.indexOf('id="terraceScene"');
const terraceEnd=html.indexOf('id="tapMarker"');
for(const id of ['terraceAtmosphericWatercolor28','terraceDyerSilkRelief28',
 'terraceConservatoryBotanicalEtching28','terraceLeafClusterStructure28']){
 const at=html.indexOf('id="'+id+'"');
 assert(at>terraceStart && at<terraceEnd,'Art must inhabit the real world scene: '+id);
}
assert(html.includes('class="terrace-leaf-sway" transform="translate(-62 -38) scale(.78)"'),
 'Paper crown must keep original animated transform and visibility constraint');
assert((shellVersion && Number(shellVersion[1])>=50),'Updated iPhone PWA shell required for 0.28');
// 0.29: replaced core physical structure, not merely 2D sticker details.
for(const id of ['terraceDyerMultiPlyRoof29','terraceConservatoryCurledEaves29',
 'terraceBuiltRoofProfiles29','taviRearIllustratedSilhouette29'])
 assert(ids.includes(id),'0.29 structural illustration missing: '+id);
for(const id of ['terraceDyeTower','terraceConservatoryCupola'])
 assert(html.includes('id="'+id+'" pointer-events="none"'),
 '0.29 architectural silhouette must be a physical touch-transparent SVG group: '+id);
const roof29=html.indexOf('id="terraceBuiltRoofProfiles29"');
assert(roof29>html.indexOf('id="terracePaperArchitecture"') &&
 roof29<html.indexOf('id="terraceCraftedShopfronts"'),
 '0.29 paper structure must underlie the actual window/roof front faces');
assert(html.indexOf('id="taviRearIllustratedSilhouette29"')>
 html.indexOf('id="taviRearHairCut"') &&
 html.indexOf('id="taviRearIllustratedSilhouette29"')<
 html.indexOf('data-upper-atlas="rear"'),
 '0.29 cut-card hair volumes must stay inside rear-facing actor art and beneath walk atlas');
assert(html.includes('id="terraceBell" transform="translate(719 484)"') &&
 html.includes('id="terraceKiosk" transform="translate(1022 660)"') &&
 html.includes('id="terraceRibbonTree" transform="translate(1177 591)"'),
 'New illustrations cannot move existing interactive roots');
assert((shellVersion && Number(shellVersion[1])>=50),'0.29 PWA refresh cache not bumped');
// 0.30: real, aligned head anatomy across idle, walking, expression and turns.
assert((html.match(/class="tavi-proportioned-head30"/g)||[]).length===5,
 'All 5 authentic field head drawings must share corrected proportions');
assert((html.match(/class="tavi-turn-head30"/g)||[]).length===6,
 'All 6 fully authored turn heads must retain matched proportions');
assert((html.match(/data-proportion-view="/g)||[]).length===5,
 'Corrected field facings cannot repeat or omit a direction');
for(const view of ['front','rear','side','quarter-front','quarter-rear'])
 assert(html.includes('data-proportion-view="'+view+'"'),
 'Missing distinct illustrated proportion head '+view);
for(const view of ['front','side','quarter-front'])
 assert(html.includes('data-face-view="'+view+'" pointer-events="none" transform="translate(0 -12) scale(.88)"'),
 'Expression drawings must remain registered to actual face anatomy '+view);
assert((html.match(/class="tavi-upper-cel"/g)||[]).length===40 &&
 (html.match(/class="tavi-walk-cel"/g)||[]).length===40,
 'Changing body ratios must NOT lose authored 5-direction walking cels');
assert(css.includes('#tavi .tavi-upper-atlas .tavi-upper-hair-details') &&
 css.includes('scale(.88)!important'), 'Hair details must follow corrected head in all upper atlas frames');
assert((shellVersion && Number(shellVersion[1])>=50),'0.30 Home Screen shell revision missing');
// 0.31: 40 new authentic head/face/hair walk cels synchronized with the old atlas.
assert((html.match(/class="tavi-stride-head-cel31"/g)||[]).length===40,
  'A complete set of 40 illustrated head walking frames is required');
assert((html.match(/class="tavi-stride-head-atlas31"/g)||[]).length===5,
  'Every field facing needs its own distinct head-motion atlas');
assert((html.match(/class="tavi-proportioned-head30"/g)||[]).length===5,
  'Original five static, ratio-correct heads must remain for portraits/idle');
assert((html.match(/class="farer-hair-volume"/g)||[]).length===5,
  'The 5 original physical hair silhouette groups must remain singular');
for(const view of ['front','rear','side','quarter-front','quarter-rear'])
  for(let n=0;n<8;n++){
    assert(html.includes('data-head-view="'+view+'" data-head-frame="'+n+'"'),
     'Missing in-motion head sprite '+view+'/'+n);
    assert(html.includes('data-drawn-frame="'+view+'-'+n+'"'),
     'Head pose must be a separate physical drawn cel '+view+'/'+n);
    assert(html.includes('data-frame-ink="'+view+'-'+n+'"'),
     'Anatomical frame needs independently authored moving hair ink '+view+'/'+n);
  }
assert((html.match(/class="tavi-walk-cel"/g)||[]).length===40&&
       (html.match(/class="tavi-upper-cel"/g)||[]).length===40,
       'Head improvements cannot remove existing full-body authentic gait frames');
assert(css.includes('#tavi.walking .tavi-proportioned-head30{display:none!important}')&&
       css.includes('#tavi.walking .tavi-upper-atlas .tavi-upper-hair-details{display:none!important}'),
       'Render only one head, avoid duplicated hair-outline artifacts');
assert((shellVersion && Number(shellVersion[1])>=50),'Installed iPhone 0.31 update must bust old cache');
// 0.32: every existing gait frame now has shaped material and a cut-edge clipping path.
for(const view of ['front','rear','side','quarter-front','quarter-rear']){
  for(let n=0;n<8;n++){
    const pose=view+'-'+n;
    assert(html.includes('class="tavi-painted-costume32" data-paint-pose="'+pose+'"'),
      'Missing detailed, individually inked costume layer '+pose);
    assert(html.includes('id="taviCostumeCut32-'+pose+'" clipPathUnits="userSpaceOnUse"'),
      'Missing coat silhouette clipping '+pose);
    assert(html.includes('class="tavi-pigment-foundation32" data-paint-view="'+view+
      '" data-paint-frame="'+n+'"'),'Missing color-washed paper layer '+pose);
  }
}
assert((html.match(/class="tavi-painted-costume32"/g)||[]).length===40 &&
       (html.match(/class="tavi-pigment-foundation32"/g)||[]).length===40 &&
       (html.match(/<clipPath id="taviCostumeCut32-/g)||[]).length===40,
       'Exactly 40 unique painted paper costume/source clip groups are required');
for(const id of ['taviCoatGlaze32','taviPaperFibers32'])
  assert(ids.includes(id),'Material gradient or paper fiber texture unavailable '+id);
assert((html.match(/class="tavi-upper-cel"/g)||[]).length===40 &&
       (html.match(/class="tavi-stride-head-cel31"/g)||[]).length===40 &&
       (html.match(/class="tavi-walk-cel"/g)||[]).length===40,
       'Costume refinement must retain all independently drawn frames');
assert((shellVersion && Number(shellVersion[1])>=50),'0.32 offline install cache version must advance');
// 0.33 verifies the actual anatomy art, not decorative portrait overlays.
const taviHands=[...html.matchAll(/class="tavi-inked-hand33"/g)];
assert(taviHands.length===102,
 'A total of 80 walking, 10 idle, and 12 turn hands must use inked contour source art');
assert((html.match(/class="tavi-hand-silhouette33"/g)||[]).length===102,
 'Every hand source must be a real authored irregular palm/thumb contour');
for(const view of ['front','rear','side','quarter-front','quarter-rear']){
 for(let frame=0;frame<8;frame++){
  for(const side of ['left','right'])assert(
   html.includes('data-hand-view="'+view+'" data-hand-frame="'+frame+
     '" data-hand-side="'+side+'"'),
   'Missing individually registered finger art '+view+'/'+frame+'/'+side);
 }
 for(const side of ['left','right'])assert(
  html.includes('data-idle-hand-view="'+view+'" data-idle-hand-side="'+side+'"'),
  'Missing physical idle palm '+view+'/'+side);
}
assert((html.match(/data-turn-hand="true"/g)||[]).length===12,
 'Six full-body turning drawings must not flash old circular fists');
for(const view of ['front','side','quarter-front']){
 assert((html.match(new RegExp('data-sculpted-view="'+view+'"','g'))||[]).length===9,
  'Each forward direction needs a coherent original idle face and eight animated contour faces: '+view);
}
assert((html.match(/class="tavi-sculpted-face33"/g)||[]).length===27 &&
       (html.match(/class="tavi-profile-nose33"/g)||[]).length===18 &&
       (html.match(/class="tavi-turn-visage33"/g)||[]).length===3,
 'Front, side, quarter and in-between turning facial anatomy needs original painted face shapes');
for(const id of ['taviSkinIllustration33','taviCheekWash33'])
 assert(ids.includes(id),'Missing original face wash gradient '+id);
assert((html.match(/class="tavi-walk-cel"/g)||[]).length===40 &&
       (html.match(/class="tavi-upper-cel"/g)||[]).length===40 &&
       (html.match(/class="tavi-stride-head-cel31"/g)||[]).length===40 &&
       (html.match(/class="tavi-turn-head30"/g)||[]).length===6,
 'Anatomical redraw must not remove existing physical gait/turn art');
assert((shellVersion && Number(shellVersion[1])>=50),'New painted anatomy must refresh iPhone Home Screen offline shell');
// 0.34 — original 51 directional hair structures + 45 proper collar structures.
assert((html.match(/class="tavi-cardstock-hair34"/g)||[]).length===51,
 'New source hair art must inhabit every resting, walking and turn pose');
assert((html.match(/class="tavi-woven-collar34"/g)||[]).length===45,
 'Every standing and walking coat must have its own dimensional paper collar');
for(const view of ['front','rear','side','quarter-front','quarter-rear']){
 assert(html.includes('data-hair34="'+view+'-idle"') &&
        html.includes('data-collar34="'+view+'-idle"'),
        'Missing original idle character coiffure and neckline: '+view);
 for(let frame=0;frame<8;frame++){
  assert(html.includes('data-hair34="'+view+'-'+frame+'"') &&
         html.includes('data-collar34="'+view+'-'+frame+'"'),
         'Hair and collar must be authored in the actual same gait cel: '+view+'/'+frame);
 }
}
for(const view of ['front','rear'])
 for(let frame=0;frame<3;frame++)
  assert(html.includes('data-turn-hair34="'+view+'-'+frame+'"'),
   'Turning sequence cannot revert to featureless hair helmet: '+view+'/'+frame);
assert((html.match(/class="tavi-stride-head-cel31"/g)||[]).length===40 &&
       (html.match(/class="tavi-upper-cel"/g)||[]).length===40 &&
       (html.match(/class="tavi-walk-cel"/g)||[]).length===40 &&
       (html.match(/class="tavi-turn-head30"/g)||[]).length===6,
       'Original stride/turn atlas required; never remove movement cels');
assert(html.includes('id="taviRearHairCut" d="M-34-146Q-42-165-31-180'),
       'Original approved rear haircut anchor must survive');
assert((shellVersion && Number(shellVersion[1])>=50),'0.34 installed Home Screen shell not refreshed');
// 0.35 — actual physical paper-feather source artwork, not a detached image.
for(const id of ['morrowOriginalCardBody35','morrowBodyCardstock35',
 'morrowIllustratedBreast35','morrowFeatherCrown35','morrowInkedTail35',
 'morrowEyeParchment35','morrowFeatherStock35','morrowBreastWash35',
 'morrowBeakOchre35','morrowRestBeak35'])
 assert(ids.includes(id),'Missing source companion paper construction: '+id);
assert((html.match(/class="morrow-physical-wing-relief35"/g)||[]).length===8,
 'Four genuine wing movement poses need two individually shaped inner feather sheets');
for(let frame=0;frame<4;frame++)
 for(const side of ['left','right'])
  assert(html.includes('data-feather-frame="'+frame+'" data-feather-side="'+side+'"'),
   'Missing direction-registered original wing feathers '+frame+'/'+side);
assert((html.match(/class="morrow-cut-face35"/g)||[]).length===14,
 'Seven idle/reaction faces need fourteen organic painted eye-paper cuts');
assert((html.match(/class="morrow-reaction-cel"/g)||[]).length===6 &&
       (html.match(/class="morrow-wing-frame"/g)||[]).length===4,
       'The original reactive bird facial and flapping animation frame counts must survive');
assert((html.match(/fill="url\(#morrowWingInk(?:Left|Right)\)"/g)||[]).length===8,
       'Keep all eight independently illustrated base wings beneath their new cut-paper feathers');
assert(html.includes('id="morrowGroundShadow"')&&html.includes('id="morrowReactionAtlas"'),
       'Morrow floor anchoring, expressions, and save integration must remain intact');
assert((shellVersion && Number(shellVersion[1])>=50),
       '0.35 iPhone Home Screen needs new offline cache');
// 0.36: organic bird anatomy and two different painted woodland silhouettes.
for(const id of ['morrowSweptCrown36','terraceHandcutOrchard36',
 'terraceOrchardLeft36','terraceOrchardRight36'])
 assert(ids.includes(id),'New illustrated physical source absent: '+id);
assert((html.match(/class="morrow-feather-eye36"/g)||[]).length===14,
 'Seven resting/reaction faces must each have two actual paper-feather eye masks');
for(const view of ['rest','attentive-0','attentive-1','alarmed-0','alarmed-1',
 'delighted-0','delighted-1'])
 for(const side of ['left','right'])
  assert(html.includes('data-eye36="'+view+'-'+side+'"'),
   'Original moving character expression mask missing: '+view+' '+side);
assert((html.match(/class="morrow-cut-face35"/g)||[]).length===14 &&
       (html.match(/class="morrow-reaction-cel"/g)||[]).length===6 &&
       (html.match(/class="morrow-wing-frame"/g)||[]).length===4 &&
       (html.match(/class="morrow-physical-wing-relief35"/g)||[]).length===8,
       'No original expressive face or physical wing art may disappear');
assert(html.includes('id="terraceMidgroundCards"') &&
       html.indexOf('id="terraceHandcutOrchard36"')>
           html.indexOf('id="terraceMidgroundCards"') &&
       html.indexOf('id="terraceHandcutOrchard36"')<
           html.indexOf('id="terraceValleyThread"'),
       'Orchard must remain an illustrated backdrop, not a character-overlapping overlay');
assert((shellVersion && Number(shellVersion[1])>=50),
 '0.36 iPhone install must invalidate old cached scene');
// 0.37: source-grounded North Terrace art, physical painted woodland and reduced-motion.
for(const id of ['terraceEscarpmentBase37','terraceEscarpmentPages37','terraceEscarpmentWildEdges37',
 'terraceLeftLeafPlies37','terraceRightLeafPlies37'])
 assert(ids.includes(id),'Source-painted page bank or botanical tree missing '+id);
const art37=html.slice(html.indexOf('id="terraceLandscapeRetainingWall"'),html.indexOf('id="terraceValleyThread"'));
assert((art37.match(/<path\b/g)||[]).length>=35,'New bank and crowns must be authored cut-paper, not overlay shapes');
assert((art37.match(/class="terrace-painted-foliage37/g)||[]).length===2,'Both original tree source plies needed');
assert(css.includes('@keyframes terraceLeafHinge37')&&css.includes('animation:none!important;transform:none!important'),
 'Leaf hinge must respect reduced-motion');
assert((shellVersion && Number(shellVersion[1])>=50),'Installed Home Screen cache not updated');
// Wing cel selection must see current-frame follower velocity, not last frame's.
const frameBody=game.slice(game.indexOf('function frame(now){'),game.indexOf('\nsync();',game.indexOf('function frame(now){')));
assert(frameBody.indexOf('updateCompanion(dt)')>=0 &&
       frameBody.indexOf('updateCompanion(dt)')<frameBody.indexOf('updateMorrowAnimation(now)'),
       'Morrow wing cadence must sample the current companion motion frame');
// A blocked step may change the intended facing even when collision prevents
// world translation. Directional art must be redrawn on that frame.
assert(frameBody.includes("const priorArtFacing=state.direction+':'+state.facing;") &&
       frameBody.includes("fieldMotion||priorArtFacing!==state.direction+':'+state.facing"),
       'Tavi must turn toward blocked movement rather than freeze in the prior art view');
console.log('FoldFarer static smoke checks passed:',ids.length,'HTML element IDs; JS parsed; references verified.');
// Physical D-pad input must cancel any queued tap destination before movement.
assert(game.includes('if(moving&&moveTarget)cancelTap();'),'Manual controls must override tap navigation');

// Even sub-second journeys must be saved on the first idle frame.
assert(game.includes('unsavedWalk=true;') && game.includes('if(unsavedWalk&&!fieldMotion){save();lastSavedAt=now;unsavedWalk=false;}'), 'Short walks must persist when movement ends');
