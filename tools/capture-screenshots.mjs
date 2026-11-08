import { chromium } from 'playwright';
import { mkdirSync, statSync } from 'node:fs';

mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const errors=[];
page.on('pageerror', error => errors.push(error.message));

try {
  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle' });
  await page.locator('#intro').waitFor({state:'visible'});
  await page.screenshot({path:'screenshots/01-title-screen.png'});
  
  await page.locator('#start').click();
  await page.locator('#dialogue').waitFor({state:'visible'});
  const firstPortrait=await page.locator('#portraitBadge').getAttribute('class');
  if(!firstPortrait?.includes('portrait-with-art'))throw Error('Real actor portrait did not attach to dialogue');
  if(await page.locator('#portraitUse').getAttribute('href')!=='#taviSprite')throw Error('Tavi portrait still uses a moving world transform');
  await page.screenshot({path:'screenshots/02-dialogue-opening.png'});
  for(let i=0;i<4;i++)await page.locator('#nextLine').click();
  await page.locator('#dialogue').waitFor({state:'hidden'});
  const trees=await page.locator('#paperBotanicalGarden > .paper-canopy').count();
  if(trees!==11)throw Error('Expected eleven authored garden trees, found '+trees);
  const families=await page.locator('#paperBotanicalGarden > .paper-canopy').evaluateAll(els=>new Set(els.map(e=>[...e.classList].find(x=>x.startsWith('tree-family-')))).size);
  if(families!==5)throw Error('Expected five distinct botanical silhouettes, found '+families);
  for(const id of ['folioBindingHouse','threadsTailorHouse','postboundHouse','edgePaperHouse']){
    const box=await page.locator('#'+id).evaluate(el=>{const b=el.getBBox();return {width:b.width,height:b.height}});
    if(box.width<55||box.height<50)throw Error('Physical paper building failed render check: '+id+' '+JSON.stringify(box));
  }
  await page.screenshot({path:'screenshots/03-folio-village.png'});
  await page.locator('#world').screenshot({path:'screenshots/16-dimensional-folio-buildings.png'});
  // Verify live character rendering before Morrow joins, not merely save state.
  await page.emulateMedia({reducedMotion:'no-preference'});
  const initialTransform=await page.locator('#tavi').getAttribute('transform');
  const gardenTarget=await page.locator('#world').evaluate(svg=>{
    const point=svg.createSVGPoint();point.x=462;point.y=706;
    const screen=point.matrixTransform(svg.getScreenCTM());
    return {x:screen.x,y:screen.y};
  });
  await page.mouse.click(gardenTarget.x,gardenTarget.y);
  await page.waitForTimeout(210);
  const walkingTransform=await page.locator('#tavi').getAttribute('transform');
  if(walkingTransform===initialTransform)throw Error('Ground tap moved no visible character before recruitment');
  if(!await page.locator('#tavi').evaluate(el=>el.classList.contains('walking')))throw Error('Tap movement did not activate character gait');
  // A single renderer instant must determine the pose, both animated
  // outlines and contact dimensions; multiple waits can race the 60 Hz loop.
  const walkingPose=await page.locator('#tavi').evaluate(el=>{
    const directionClass=el.getAttribute('class')||'';
    const pose=directionClass.includes('dir-diag-down')?'taviFrontQuarterArt':
      directionClass.includes('dir-diag-up')?'taviBackQuarterArt':
      directionClass.includes('dir-up')?'taviBackArt':
      directionClass.includes('dir-side')?'taviSideArt':'taviFrontArt';
    const view=document.getElementById(pose);
    const stride=el.dataset.stride;
    const visible=sel=>[...view.querySelectorAll(sel)]
      .filter(e=>getComputedStyle(e).display!=='none');
    const leg=visible('.tavi-walk-cel');
    const upper=visible('.tavi-upper-cel');
    const geo=leg.length===1?leg[0].getBBox():null;
    const body=upper.length===1?upper[0].getBBox():null;
    return {pose,stride,walking:el.classList.contains('walking'),
      legs:leg.map(x=>x.dataset.cel),upper:upper.map(x=>x.dataset.upperFrame),
      geometry:geo&&{w:geo.width,h:geo.height},
      body:body&&{w:body.width,h:body.height}};
  });
  if(!walkingPose.walking||!['0','1','2','3','4','5','6','7'].includes(walkingPose.stride))
    throw Error('World movement did not choose an illustrated stride: '+JSON.stringify(walkingPose));
  if(await page.locator('#tavi .stride-contact-ground').count()!==5)
    throw Error('Some Tavi directional contact illustrations are missing');
  if(await page.locator('#tavi .tavi-walk-cel').count()!==40)
    throw Error('The forty source walking poses are incomplete');
  if(await page.locator('#tavi .tavi-upper-cel').count()!==40)
    throw Error('The forty source upper-body poses are incomplete');
  if(walkingPose.legs.length!==1||walkingPose.legs[0]!==walkingPose.stride)
    throw Error('Painted leg frame is not synchronous: '+JSON.stringify(walkingPose));
  if(walkingPose.upper.length!==1||walkingPose.upper[0]!==walkingPose.stride)
    throw Error('Painted coat frame is not synchronous: '+JSON.stringify(walkingPose));
  if(!walkingPose.geometry||walkingPose.geometry.w<48||walkingPose.geometry.h<35||
     !walkingPose.body||walkingPose.body.w<65||walkingPose.body.h<120)
    throw Error('One or more limbs or coat panels have collapsed: '+JSON.stringify(walkingPose));
  await page.screenshot({path:'screenshots/28-tavi-paper-costume-side-walk.png',animations:'allow'});
  await page.screenshot({path:'screenshots/25-tavi-eight-frame-walk.png',animations:'allow'});
  await page.screenshot({path:'screenshots/14-botanical-walk-cycle.png',animations:'allow'});
  console.log('BOTANICALS:',trees,'trees,',families,'families. GAIT:',walkingPose.stride);
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(230);
  await page.keyboard.up('ArrowLeft');
  await page.emulateMedia({reducedMotion:'reduce'});
  const before=await page.locator('#tavi').getAttribute('transform');
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(450);
  await page.keyboard.up('ArrowUp');
  const after=await page.locator('#tavi').getAttribute('transform');
  if(before===after || !(await page.locator('#tavi').getAttribute('class')).includes('dir-up')){
    throw Error('2.5D depth movement or back-facing artwork not active');
  }
  await page.screenshot({path:'screenshots/06-depth-exploration.png'});


  // Load a separate real browser page for each saved scene; simply writing
  // localStorage before reload is undone by the game's pagehide autosave.
  const openedAt = async (save) => {
    const p=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
    p.on('pageerror',err=>errors.push(err.message));
    await p.addInitScript(payload=>localStorage.setItem('foldfarer.firstfold.0.1',JSON.stringify(payload)),save);
    await p.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
    await p.locator('#start').click();
    await p.locator('#intro').waitFor({state:'hidden'});
    return p;
  };


  // Landscape iPhone-sized Chromium emulation, not a physical Apple device.
  const mobilePage=await browser.newPage({
    viewport:{width:844,height:390},screen:{width:844,height:390},
    deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'
  });
  mobilePage.on('pageerror',err=>errors.push('mobile: '+err.message));
  await mobilePage.addInitScript(()=>localStorage.setItem('foldfarer.firstfold.0.1',JSON.stringify({
    started:true,x:356,y:654,facing:1,direction:'down',area:'folio',
    metMorrow:true,mended:false,threadSample:false,letter:false,won:false
  })));
  await mobilePage.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
  await mobilePage.locator('#start').click();
  await mobilePage.locator('#intro').waitFor({state:'hidden'});
  const mark=await mobilePage.locator('.logo-mini').boundingBox();
  const goal=await mobilePage.locator('.objective').boundingBox();
  if(!mark||!goal||!(mark.x+mark.width<goal.x)){
    throw Error('Mobile objective still overlaps title/logo: '+JSON.stringify({mark,goal}));
  }
  for(const selector of ['[data-move="left"]','[data-move="right"]','[data-move="up"]','[data-move="down"]','#interact']){
    const box=await mobilePage.locator(selector).boundingBox();
    if(!box||box.x<0||box.y<0||box.x+box.width>844||box.y+box.height>390){
      throw Error('Landscape touch target clipped in 844×390 browser emulation: '+selector+' '+JSON.stringify(box));
    }
  }

  if(await mobilePage.locator('#morrow').getAttribute('data-flap')!=='0')
    throw Error('Reduced motion must retain the unanimated authored wing frame');
  const contactShadow=await mobilePage.locator('#taviGroundShadow').evaluate(el=>{
    const b=el.getBBox();return {width:b.width,hit:getComputedStyle(el).pointerEvents};
  });
  if(contactShadow.width<80||contactShadow.hit!=='none')
    throw Error('Tavi shadow is absent or blocks touch: '+JSON.stringify(contactShadow));
  await mobilePage.screenshot({path:'screenshots/15-mobile-landscape-emulation.png'});
  await mobilePage.close();

  // Render both diagonal costumes from unobstructed locations. The main scene
  // has correctly depth-sorted notice boards; those should not conceal the
  // character in the art reference capture.
  const quarterBackPage=await openedAt({started:true,area:'folio',x:615,y:711,facing:1,direction:'down',metMorrow:true,mended:false,letter:false,won:false});
  await quarterBackPage.emulateMedia({reducedMotion:'no-preference'});
  await quarterBackPage.keyboard.down('ArrowUp');
  await quarterBackPage.keyboard.down('ArrowRight');
  await quarterBackPage.waitForTimeout(380);
  const backClass=await quarterBackPage.locator('#tavi').getAttribute('class');
  if(!backClass?.includes('dir-diag-up'))throw Error('Back 3/4 art is not active: '+backClass);
  const backPos=await quarterBackPage.locator('#tavi').getAttribute('transform');
  console.log('THREE QUARTER BACK:',backPos);
  // Read active frame and drawn geometries synchronously: with live keyboard
  // input the world loop may advance between two Playwright await calls.
  const backPose=await quarterBackPage.locator('#tavi').evaluate(el=>{
    const stride=el.dataset.stride;
    const frame=(sel)=>[...el.querySelectorAll(sel)]
      .filter(e=>getComputedStyle(e).display!=='none').map(e=>e.dataset.cel??e.dataset.upperFrame);
    return {stride,walking:el.classList.contains('walking'),
      legs:frame('#taviBackQuarterArt .tavi-walk-cel'),
      upper:frame('#taviBackQuarterArt .tavi-upper-cel')};
  });
  if(!backPose.walking||backPose.legs.length!==1||backPose.legs[0]!==backPose.stride)
    throw Error('Three-quarter rear Tavi lacks a synchronized leg frame: '+JSON.stringify(backPose));
  if(backPose.upper.length!==1||backPose.upper[0]!==backPose.stride)
    throw Error('Three-quarter rear Tavi lacks synchronized upper-body art: '+JSON.stringify(backPose));
  await quarterBackPage.screenshot({path:'screenshots/30-tavi-paper-costume-rear-quarter-walk.png',animations:'allow'});
  await quarterBackPage.screenshot({path:'screenshots/26-tavi-eight-frame-rear-quarter-walk.png'});
  await quarterBackPage.screenshot({path:'screenshots/09-tavi-three-quarter.png'});
  await quarterBackPage.keyboard.up('ArrowUp');
  await quarterBackPage.keyboard.up('ArrowRight');
  await quarterBackPage.waitForTimeout(110);
  const idleCostume=await quarterBackPage.locator('#tavi').evaluate(el=>{
    const pose=document.getElementById('taviBackQuarterArt');
    return {
      walking:el.classList.contains('walking'),
      animated:[...pose.querySelectorAll('.tavi-upper-cel')].filter(x=>getComputedStyle(x).display!=='none').length,
      idle:getComputedStyle(pose.querySelector('.tavi-rest-torso')).display,
      idleScarf:getComputedStyle(pose.querySelector('.tavi-rest-scarf')).display,
      feet:getComputedStyle(pose.querySelector('.tavi-foot')).display
    };
  });
  if(idleCostume.walking||idleCostume.animated||idleCostume.idle==='none'||
     idleCostume.idleScarf==='none'||idleCostume.feet==='none')
    throw Error('Standing Tavi failed to recover original source art after walking: '+JSON.stringify(idleCostume));
  await quarterBackPage.close();

  const quarterFrontPage=await openedAt({started:true,area:'folio',x:607,y:594,facing:1,direction:'down',metMorrow:true,mended:false,letter:false,won:false});
  await quarterFrontPage.emulateMedia({reducedMotion:'no-preference'});
  await quarterFrontPage.keyboard.down('ArrowDown');
  await quarterFrontPage.keyboard.down('ArrowRight');
  await quarterFrontPage.waitForTimeout(380);
  const frontClass=await quarterFrontPage.locator('#tavi').getAttribute('class');
  if(!frontClass?.includes('dir-diag-down'))throw Error('Front 3/4 art is not active: '+frontClass);
  console.log('THREE QUARTER FRONT:',await quarterFrontPage.locator('#tavi').getAttribute('transform'));
  await quarterFrontPage.screenshot({path:'screenshots/10-tavi-front-three-quarter.png'});
  await quarterFrontPage.keyboard.up('ArrowDown');
  await quarterFrontPage.keyboard.up('ArrowRight');
  await quarterFrontPage.close();


  // Separate real forward-walking acceptance image: a normal-motion browser
  // navigates Tavi toward the camera, while the old standstill SVG stays
  // dormant. No concept art or screenshot compositing is involved.
  const taviForwardPage=await openedAt({
    started:true,area:'folio',x:850,y:605,direction:'down',
    facing:1,metMorrow:true,mended:true,letter:false,won:false
  });
  await taviForwardPage.emulateMedia({reducedMotion:'no-preference'});
  await taviForwardPage.keyboard.down('ArrowDown');
  await taviForwardPage.waitForTimeout(230);
  const frontPose=await taviForwardPage.locator('#tavi').evaluate(el=>{
    const stride=el.dataset.stride;
    const frames=selector=>[...el.querySelectorAll(selector)]
      .filter(e=>getComputedStyle(e).display!=='none')
      .map(e=>e.dataset.cel??e.dataset.upperFrame);
    return {stride,walking:el.classList.contains('walking'),
      legs:frames('#taviFrontArt .tavi-walk-cel'),
      upper:frames('#taviFrontArt .tavi-upper-cel')};
  });
  if(!frontPose.walking||frontPose.legs.length!==1||frontPose.legs[0]!==frontPose.stride)
    throw Error('Forward gait must render one synchronized painted leg frame: '+JSON.stringify(frontPose));
  if(frontPose.upper.length!==1||frontPose.upper[0]!==frontPose.stride)
    throw Error('Forward Tavi must render synchronized upper-body art: '+JSON.stringify(frontPose));
  await taviForwardPage.screenshot({path:'screenshots/29-tavi-paper-costume-front-walk.png',animations:'allow'});
  await taviForwardPage.screenshot({path:'screenshots/27-tavi-front-walk-atlas.png',animations:'allow'});
  await taviForwardPage.keyboard.up('ArrowDown');
  await taviForwardPage.close();

  const tornPage=await openedAt({started:true,x:625,y:698,facing:1,direction:'down',metMorrow:true,mended:false,letter:false,won:false});
  if(await tornPage.locator('#bridgeFix').getAttribute('class')!=='bridge-closed')throw Error('Unmended physical bridge should be folded away');
  await tornPage.screenshot({path:'screenshots/12-paper-bridge-torn.png'});
  await tornPage.close();


  // Browser acceptance: the real bridge interaction must draw Tavi's needle
  // inside the playable scene (not a standalone illustration), persist its
  // repaired checkpoint immediately, then return movement control.
  const mendPage=await openedAt({started:true,x:625,y:698,facing:1,direction:'down',metMorrow:true,mended:false,letter:false,won:false});
  // All other review captures deliberately prefer reduced motion; this scene
  // must opt into motion to evaluate the actual sewing performance.
  await mendPage.emulateMedia({reducedMotion:'no-preference'});
  await mendPage.locator('#interact').click();
  await mendPage.locator('#dialogue').waitFor({state:'visible'});
  for(let line=0;line<3;line++)await mendPage.locator('#nextLine').click();
  if(!(await mendPage.locator('#tavi').evaluate(el=>el.classList.contains('mending'))))throw Error('Tavi repair did not animate in the real world');
  const persist=await mendPage.evaluate(()=>JSON.parse(localStorage.getItem('foldfarer.firstfold.0.1')||'{}'));
  if(!persist.mended)throw Error('Repair is not saved before animation completes');
  const gesture=await mendPage.locator('#taviMendArc').evaluate(el=>{
    const b=el.getBBox();return {width:b.width,height:b.height,opacity:getComputedStyle(el).opacity};
  });
  if(gesture.width<45||gesture.height<65||Number(gesture.opacity)<.5)throw Error('Needle and stitch artwork failed to render: '+JSON.stringify(gesture));
  await mendPage.waitForTimeout(200);
  await mendPage.screenshot({path:'screenshots/22-live-needle-mending.png',animations:'allow'});
  await mendPage.waitForTimeout(900);
  if(await mendPage.locator('#tavi').evaluate(el=>el.classList.contains('mending')))throw Error('Needle flourish did not release control');
  await mendPage.close();

  const bridgePage=await openedAt({started:true,x:625,y:698,facing:1,direction:'down',metMorrow:true,mended:true,letter:false,won:false});
  if(await bridgePage.locator('#bridgeFix').getAttribute('class')!=='bridge-open')throw Error('Mended bridge not visible');
  if(await bridgePage.locator('#riverCutout').count()!==1)throw Error('Layered paper river cutout missing');
  if(await bridgePage.locator('#seamLight').evaluate(e=>e.classList.contains('hidden-seam'))!==true)throw Error('Bridge repair did not dim the open seam');
  await bridgePage.waitForTimeout(1350);
  await bridgePage.screenshot({path:'screenshots/04-repaired-bridge.png'});
  await bridgePage.close();

  const milaPage=await openedAt({started:true,x:1024,y:643,facing:1,metMorrow:true,mended:true,letter:false,won:false});
  await milaPage.locator('#interact').click();
  await milaPage.locator('#dialogue').waitFor({state:'visible'});
  const milaPortraitSource=await milaPage.locator('#portraitUse').getAttribute('href');
  // The first line is Mila, whose face must come from the world sprite.
  if(milaPortraitSource!=='#mila')throw Error('Mila dialogue portrait not linked to actor artwork');
  await milaPage.screenshot({path:'screenshots/08-mila-courier-dialogue.png'});
  await milaPage.close();

  const followerPage=await openedAt({started:true,x:628,y:705,facing:1,direction:'down',metMorrow:true,mended:false,letter:false,won:false});
  await followerPage.keyboard.down('ArrowUp');await followerPage.keyboard.down('ArrowRight');
  await followerPage.waitForTimeout(480);
  await followerPage.keyboard.up('ArrowUp');await followerPage.keyboard.up('ArrowRight');
  if(!await followerPage.locator('#morrow').evaluate(e=>e.classList.contains('following')))throw Error('Companion not following');

  await followerPage.emulateMedia({reducedMotion:'no-preference'});
  if(await followerPage.locator('#morrow .morrow-wing-frame').count()!==4)
    throw Error('Morrow lacks four authored wing frames');
  await followerPage.waitForFunction(
    ()=>document.getElementById('morrow')?.dataset.flap==='2',null,{timeout:3500}
  );
  const wingState=await followerPage.locator('#morrow').evaluate(el=>{
    const visible=[...el.querySelectorAll('.morrow-wing-frame')]
      .filter(w=>getComputedStyle(w).display!=='none');
    return {state:el.dataset.flap,frames:visible.map(w=>w.getAttribute('data-wing-frame'))};
  });
  if(wingState.frames.length!==1||wingState.state!==wingState.frames[0])
    throw Error('Wing images are overlapping or missing: '+JSON.stringify(wingState));
  const shadow=await followerPage.locator('#morrowGroundShadow').evaluate(el=>{
    const b=el.getBBox();return {width:b.width,height:b.height};
  });
  if(shadow.width<80||shadow.height<15)throw Error('Morrow lacks an anchored ground shadow');
  await followerPage.screenshot({path:'screenshots/24-morrow-illustrated-wing-flight.png',animations:'allow'});
  const followerPos=await followerPage.locator('#morrow').getAttribute('transform');
  console.log('MORROW FOLLOWS TAVI:',followerPos);
  await followerPage.screenshot({path:'screenshots/11-morrow-follows.png'});
  await followerPage.close();


  // North Terrace: actual browser-rendered second outdoor RPG walk plane.
  // The stage is playable at both far and near depths, not a panoramic mockup.

  // The art acceptance images must come directly from a running scene.
  const actingPage=await openedAt({
    started:true,area:'terrace',x:719,y:550,facing:1,direction:'down',
    metMorrow:true,mended:false,threadSample:false,letter:false,won:false
  });
  await actingPage.emulateMedia({reducedMotion:'no-preference'});
  await actingPage.locator('#interact').click();
  await actingPage.locator('#dialogue').waitFor({state:'visible'});
  const face=await actingPage.locator('#tavi').evaluate(el=>{
    const view=document.getElementById('taviFrontArt');
    const shown=[...view.querySelectorAll('.tavi-face-expression')]
      .filter(n=>getComputedStyle(n).display!=='none')
      .map(n=>n.dataset.faceMood);
    return {talking:el.classList.contains('speaking'),mood:el.dataset.mood,shown};
  });
  if(!face.talking||face.mood!=='curious'||face.shown.length!==1||face.shown[0]!=='curious')
    throw Error('Live terrace dialogue lacks its authored curious expression: '+JSON.stringify(face));
  await actingPage.screenshot({path:'screenshots/31-tavi-live-curious-dialogue.png',animations:'allow'});
  await actingPage.locator('#nextLine').click();
  await actingPage.locator('#nextLine').click();
  if(await actingPage.locator('#tavi').evaluate(el=>el.classList.contains('speaking')))
    throw Error('Tavi did not restore idle face when his dialogue ended');
  await actingPage.close();

  const pivotPage=await openedAt({
    started:true,area:'folio',x:850,y:678,facing:1,direction:'down',
    metMorrow:true,mended:true,letter:false,won:false
  });
  await pivotPage.emulateMedia({reducedMotion:'no-preference'});
  await pivotPage.keyboard.down('ArrowRight');
  await pivotPage.waitForTimeout(190);
  await pivotPage.keyboard.up('ArrowRight');
  await pivotPage.keyboard.down('ArrowUp');
  await pivotPage.waitForTimeout(74);
  const turn=await pivotPage.locator('#tavi').evaluate(el=>{
    const art=document.getElementById('taviPivotArtwork');
    const shown=[...art.querySelectorAll('.tavi-pivot-cel')]
       .filter(n=>getComputedStyle(n).display!=='none')
       .map(n=>n.dataset.pivotCel);
    return {turning:el.classList.contains('pivoting'),phase:el.dataset.pivotPhase,shown,
      pointer:getComputedStyle(art).pointerEvents};
  });
  if(!turn.turning||turn.shown.length!==1||turn.shown[0]!==turn.phase||turn.pointer!=='none')
    throw Error('Illustrated turn poses did not render on the playable character: '+JSON.stringify(turn));
  const bodyTurn=await pivotPage.locator('#tavi').evaluate(el=>{
    const group=document.getElementById('taviTurnAtlas');
    const visible=[...group.querySelectorAll('.tavi-turn-cel')]
      .filter(node=>getComputedStyle(node).display!=='none');
    const bounds=visible.length===1?visible[0].getBBox():null;
    return {turning:el.classList.contains('turning'),phase:el.dataset.turnPhase,
      view:el.dataset.turnView,shown:visible.map(n=>n.dataset.turnView+':'+n.dataset.turnPhase),
      width:bounds?.width,height:bounds?.height,hit:getComputedStyle(group).pointerEvents};
  });
  if(!bodyTurn.turning||bodyTurn.shown.length!==1||
     bodyTurn.shown[0]!==bodyTurn.view+':'+bodyTurn.phase||
     bodyTurn.width<65||bodyTurn.height<145||bodyTurn.hit!=='none')
    throw Error('Full-body turn is not one drawn, foot-anchored pose: '+JSON.stringify(bodyTurn));
  await pivotPage.screenshot({path:'screenshots/33-tavi-fullbody-direction-turn.png',animations:'allow'});
  await pivotPage.screenshot({path:'screenshots/32-tavi-paper-pivot-turn.png',animations:'allow'});
  await pivotPage.waitForTimeout(180);
  if(await pivotPage.locator('#tavi').evaluate(el=>el.classList.contains('pivoting')||el.classList.contains('turning')))
    throw Error('Full-body turn persisted after its intended three frames');
  await pivotPage.keyboard.up('ArrowUp');
  await pivotPage.close();


  const morrowActing=await openedAt({
    started:true,area:'folio',x:370,y:620,facing:1,direction:'down',
    metMorrow:true,mended:false,letter:false,won:false
  });
  await morrowActing.emulateMedia({reducedMotion:'no-preference'});
  await morrowActing.locator('#interact').click();
  await morrowActing.locator('#dialogue').waitFor({state:'visible'});
  if((await morrowActing.locator('#speaker').textContent())?.trim()!=='Morrow')
    throw Error('Morrow interaction test selected a competing physical prop');
  const owl=await morrowActing.locator('#morrow').evaluate(el=>{
    const atlas=document.getElementById('morrowReactionAtlas');
    const visible=[...atlas.querySelectorAll('.morrow-reaction-cel')]
       .filter(n=>getComputedStyle(n).display!=='none');
    return {reacting:el.classList.contains('reacting'),reaction:el.dataset.reaction,
      beak:el.dataset.beak,shown:visible.map(n=>n.dataset.reaction+':'+n.dataset.beak),
      resting:getComputedStyle(el.querySelector('.morrow-rest-face')).display};
  });
  if(!owl.reacting||owl.shown.length!==1||owl.shown[0]!==owl.reaction+':'+owl.beak||
      owl.resting!=='none')throw Error('Morrow expression must replace old face: '+JSON.stringify(owl));
  const birdVisibility=await morrowActing.evaluate(()=>{
    const bird=document.getElementById('morrow').getBoundingClientRect();
    const dialog=document.getElementById('dialogue').getBoundingClientRect();
    return {birdBottom:bird.bottom,dialogTop:dialog.top};
  });
  if(birdVisibility.birdBottom>birdVisibility.dialogTop+12)
    throw Error('Character acting is hidden by the dialogue panel: '+JSON.stringify(birdVisibility));
  await morrowActing.screenshot({path:'screenshots/34-morrow-live-dialogue-reaction.png',animations:'allow'});
  await morrowActing.locator('#nextLine').click();
  if(await morrowActing.locator('#morrow').evaluate(el=>el.classList.contains('reacting')))
    throw Error('Morrow did not release facial acting on dialogue close');
  await morrowActing.close();

  const terraceNear=await openedAt({started:true,area:'terrace',x:720,y:702,facing:1,direction:'up',metMorrow:true,mended:false,threadSample:false,letter:false,won:false});
  if(await terraceNear.locator('#terraceScene').evaluate(e=>getComputedStyle(e).display)==='none')throw Error('North Terrace is hidden after loading its save');
  if(await terraceNear.locator('#folioScene').evaluate(e=>getComputedStyle(e).display)!=='none')throw Error('Folio should hide while terrace loads');
  if(await terraceNear.locator('#tavi').evaluate(e=>e.parentNode?.id)!=='terraceDepthStage')throw Error('Tavi is not in a real depth-sorted terrace scene');
  if(await terraceNear.locator('#morrow').evaluate(e=>e.parentNode?.id)!=='terraceDepthStage')throw Error('Morrow did not accompany Tavi into terrace');

  // This is a screenshot of the working scene with new painted materials,
  // not an exported concept still. Require each group to render in-browser.
  for(const id of ['terraceDyerSilks','terraceBotanicalRelief','terraceGateEngraving','terraceLightShift']){
    const result=await terraceNear.locator('#'+id).evaluate(el=>{
      const b=el.getBBox(),st=getComputedStyle(el);
      return {w:b.width,h:b.height,display:st.display,pointer:st.pointerEvents};
    });
    if(result.w<85||result.h<55||result.display==='none'||result.pointer!=='none'){
      throw Error('Terrace art layer failed rendering/non-blocking check: '+id+' '+JSON.stringify(result));
    }
  }
  await terraceNear.screenshot({path:'screenshots/23-terrace-material-light.png'});
  const depthBox=await terraceNear.locator('#terraceGround').evaluate(e=>{const b=e.getBBox();return {width:b.width,height:b.height}});
  if(depthBox.height<350||depthBox.width<1100)throw Error('Terrace does not span a substantial rendered walk plane '+JSON.stringify(depthBox));
  const nearFootPoint=await terraceNear.locator('#world').evaluate(svg=>{
    const p=svg.createSVGPoint();p.x=720;p.y=702;
    const q=p.matrixTransform(svg.getScreenCTM());return {x:q.x,y:q.y};
  });
  const nearHeroBounds=await terraceNear.locator('#tavi').boundingBox();
  if(!nearHeroBounds||Math.abs(nearHeroBounds.y+nearHeroBounds.height-nearFootPoint.y)>55){
    throw Error('Near hero detached from actual floor '+JSON.stringify({nearHeroBounds,nearFootPoint}));
  }
  const details=['terracePavingInlay','terraceFacadeFinish','inkDyersNook','vellumConservatory','terraceDyersBench','terraceLetterCabinet'];
  for(const id of details){
    const bbox=await terraceNear.locator('#'+id).evaluate(el=>{const b=el.getBBox();return {width:b.width,height:b.height}});
    if(bbox.width<36||bbox.height<24)throw Error('North Terrace original paper sculpture did not render: '+id+' '+JSON.stringify(bbox));
  }
  const ordered=await terraceNear.locator('#terraceDepthStage').evaluate(el=>[...el.children].map(c=>c.id));
  if(!ordered.includes('terraceDyersBench')||!ordered.includes('terraceLetterCabinet')){
    throw Error('New terrace props do not participate in actor occlusion');
  }
  if(ordered.indexOf('tavi')<ordered.indexOf('terraceDyersBench')||ordered.indexOf('tavi')<ordered.indexOf('terraceLetterCabinet')){
    throw Error('Near hero should render in front of far paper furnishings');
  }
  await terraceNear.screenshot({path:'screenshots/17-north-terrace-near.png'});
  await terraceNear.locator('#world').screenshot({path:'screenshots/20-terrace-facade-art.png'});
  const beforeTap=await terraceNear.locator('#tavi').getAttribute('transform');
  const tapCoords=await terraceNear.locator('#world').evaluate(svg=>{
    const point=svg.createSVGPoint();point.x=872;point.y=704;
    const screen=point.matrixTransform(svg.getScreenCTM());return {x:screen.x,y:screen.y};
  });
  await terraceNear.mouse.click(tapCoords.x,tapCoords.y);
  await terraceNear.waitForTimeout(225);
  if(await terraceNear.locator('#tavi').getAttribute('transform')===beforeTap){
    throw Error('Tap-to-walk not activating in the new 2D terrace scene');
  }
  const initialTerracePose=await terraceNear.locator('#tavi').getAttribute('transform');
  await terraceNear.keyboard.down('ArrowUp');
  await terraceNear.waitForTimeout(490);
  await terraceNear.keyboard.up('ArrowUp');
  const walkedTerracePose=await terraceNear.locator('#tavi').getAttribute('transform');
  if(initialTerracePose===walkedTerracePose)throw Error('Terrace was not traversable toward the distant gate');
  console.log('TERRACE TWO-AXIS MOVEMENT:',initialTerracePose,'to',walkedTerracePose);
  await terraceNear.close();

  const terraceFar=await openedAt({started:true,area:'terrace',x:920,y:440,facing:-1,direction:'down',metMorrow:true,mended:false,threadSample:false,letter:false,won:false});
  const farActor=await terraceFar.locator('#tavi').getAttribute('transform');
  if(!/scale\(0\.[0-9]+\)/.test(farActor))throw Error('Far terrace hero is not smaller and perspective-scaled: '+farActor);
  if(await terraceFar.locator('#taviFlip').getAttribute('transform')!=='scale(-1 1)')throw Error('Facing left did not mirror the local art');
  const farHeroBox=await terraceFar.locator('#tavi').boundingBox();
  const projectedFoot=await terraceFar.locator('#world').evaluate(svg=>{
    const p=svg.createSVGPoint();p.x=920;p.y=440;
    const z=p.matrixTransform(svg.getScreenCTM());return {x:z.x,y:z.y};
  });
  const actorFoot={x:farHeroBox?.x+farHeroBox?.width/2,y:farHeroBox?.y+farHeroBox?.height};
  if(!farHeroBox||farHeroBox.width<16||farHeroBox.height<30||
     Math.abs(actorFoot.x-projectedFoot.x)>65||Math.abs(actorFoot.y-projectedFoot.y)>55){
    throw Error('Far hero visual position diverged from game physics '+JSON.stringify({farHeroBox,actorFoot,projectedFoot}));
  }
  console.log('FAR HERO FOOT ANCHOR:',JSON.stringify({actorFoot,projectedFoot}));
  const zOrder=await terraceFar.locator('#terraceDepthStage').evaluate(stage=>[...stage.children].map(child=>child.id));
  if(zOrder.indexOf('tavi')>=zOrder.indexOf('terraceBell'))throw Error('Terrace near-side bell cannot occlude a hero walking far behind it');
  await terraceFar.screenshot({path:'screenshots/18-north-terrace-distant.png'});
  await terraceFar.close();


  const terraceOcclusion=await openedAt({started:true,area:'terrace',x:956,y:513,facing:1,direction:'down',metMorrow:true,mended:false,threadSample:false,letter:false,won:false});
  const rearOrder=await terraceOcclusion.locator('#terraceDepthStage').evaluate(el=>[...el.children].map(c=>c.id));
  if(rearOrder.indexOf('tavi')>rearOrder.indexOf('terraceLetterCabinet'))throw Error('Distant hero should walk BEHIND letter cabinet');
  const cabinetBounds=await terraceOcclusion.locator('#terraceLetterCabinet').boundingBox();
  if(!cabinetBounds||cabinetBounds.width<40)throw Error('Letter cabinet world actor is invisible');
  await terraceOcclusion.screenshot({path:'screenshots/21-terrace-foreground-occlusion.png'});
  await terraceOcclusion.close();

  // Prove physical collision in the actual browser, not merely via a source
  // string. Tavi must stop at the visible furniture feet and be free to pass
  // around them on an adjacent walkable corridor.
  const testVerticalFoot=async(x,y,expectedBlocked,label)=>{
    const p=await openedAt({started:true,area:'terrace',x,y,facing:1,direction:'up',metMorrow:true,mended:false,threadSample:false,letter:false,won:false});
    await p.keyboard.down('ArrowUp');
    await p.waitForTimeout(680);
    await p.keyboard.up('ArrowUp');
    const raw=await p.locator('#tavi').getAttribute('transform');
    const val=Number(/translate\(([-.0-9]+) ([-.0-9]+)\)/.exec(raw)?.[2]);
    if(!Number.isFinite(val))throw Error('Could not read true rendered foot position for '+label);
    if(expectedBlocked&&val<574)throw Error('Tavi walked through physical '+label+' at y='+val);
    if(!expectedBlocked&&val>545)throw Error('Invisible collision blocked a clear lane around '+label+' at y='+val);
    console.log('TERRACE COLLISION:',label,'start',y,'end',val,'blocked',expectedBlocked);
    await p.close();
  };
  await testVerticalFoot(502,610,true,'dyer bench');
  await testVerticalFoot(954,600,true,'lost-letter cabinet');
  await testVerticalFoot(425,610,false,'dyer bench bypass');

  const terraceMobile=await browser.newPage({
    viewport:{width:844,height:390},screen:{width:844,height:390},deviceScaleFactor:2,
    isMobile:true,hasTouch:true,reducedMotion:'reduce'
  });
  terraceMobile.on('pageerror',error=>errors.push('terrace mobile: '+error.message));
  await terraceMobile.addInitScript(()=>localStorage.setItem('foldfarer.firstfold.0.1',JSON.stringify({
    started:true,x:720,y:700,area:'terrace',facing:1,direction:'down',
    metMorrow:true,mended:false,threadSample:false,letter:false,won:false
  })));
  await terraceMobile.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
  await terraceMobile.locator('#start').click();
  await terraceMobile.locator('#intro').waitFor({state:'hidden'});
  if(await terraceMobile.locator('#terraceScene').evaluate(e=>getComputedStyle(e).display)==='none')throw Error('North Terrace failed iPhone-size browser render');
  if(!await terraceMobile.locator('#prompt').evaluate(e=>e.classList.contains('terrace-prompt')))throw Error('North Terrace HUD did not switch to mobile-safe position');
  const mobileGoal=await terraceMobile.locator('.objective').boundingBox();
  const mobileLogo=await terraceMobile.locator('.logo-mini').boundingBox();
  if(!mobileGoal||!mobileLogo||mobileLogo.x+mobileLogo.width>=mobileGoal.x)throw Error('Terrace mobile objective overlaps game logo');
  await terraceMobile.screenshot({path:'screenshots/19-north-terrace-mobile.png'});
  await terraceMobile.close();

  const atelierPage=await openedAt({started:true,area:'atelier',x:720,y:711,facing:1,direction:'up',metMorrow:true,mended:false,threadSample:false,letter:false,won:false});
  if(await atelierPage.locator('#atelierScene').evaluate(e=>getComputedStyle(e).display)==='none')throw Error('Workshop not visible');
  if(await atelierPage.locator('#morrow').evaluate(e=>e.parentNode?.id)!=='atelierDepthStage')throw Error('Morrow failed to join the indoor stage');
  await atelierPage.screenshot({path:'screenshots/07-threads-workshop.png'});
  await atelierPage.close();

  const battlePage=await openedAt({started:true,x:1240,y:654,facing:1,metMorrow:true,mended:true,letter:true,won:false});
  console.log('STATE BEFORE BATTLE:',JSON.stringify(await battlePage.evaluate(()=>({
    save:localStorage.getItem('foldfarer.firstfold.0.1'),
    prompt:document.querySelector('#promptText').textContent,
    dialogueHidden:document.querySelector('#dialogue').classList.contains('hidden')
  }))));
  await battlePage.locator('#interact').click();
  await battlePage.locator('#battle').waitFor({state:'visible',timeout:5000});
  console.log('BATTLE SHOWN: Paper Scrapper, actual game UI');
  const gameActors=await battlePage.locator('.battle-sprite use').count();
  if(gameActors!==2)throw Error('Real in-world art was not used for both combatants');
  if(await battlePage.locator('#battleTaviArt use').getAttribute('href')!=='#taviSprite')throw Error('Combat Tavi should use a stable local-coordinate sprite');
  const actualPortraitBounds=await battlePage.locator('#battleTaviArt use').evaluate(el=>{const r=el.getBBox();return {x:r.x,y:r.y,width:r.width,height:r.height}});
  if(actualPortraitBounds.x>120||actualPortraitBounds.x< -150||actualPortraitBounds.width<20)throw Error('Tavi actual combat art is outside its viewBox '+JSON.stringify(actualPortraitBounds));
  console.log('BATTLE LOCAL SPRITE BOUNDS:',JSON.stringify(actualPortraitBounds));
  await battlePage.screenshot({path:'screenshots/05-foldline-combat.png'});
  // Switch only this art audit to normal motion so the rendered game effect is
  // visible mid-sweep; all other screenshots use reduced motion for stability.
  await battlePage.emulateMedia({reducedMotion:'no-preference'});
  await battlePage.locator('[data-battle="attack"]').click();
  await battlePage.waitForTimeout(425);
  await battlePage.locator('#timingTap').click();
  if(!await battlePage.locator('#battle').evaluate(e=>e.classList.contains('fx-attack')))throw Error('Needle Strike did not set the animated in-world VFX');
  const actualAnimation=await battlePage.locator('#needleSlash').evaluate(e=>getComputedStyle(e).animationName);
  if(!actualAnimation.includes('paperNeedleSweep'))throw Error('Needle Strike physical sweep was not animated: '+actualAnimation);
  await battlePage.waitForTimeout(160);
  await battlePage.screenshot({path:'screenshots/13-foldline-strike-animation.png',animations:'allow'});
  console.log('FOLDLINE VISUAL CHECK:',actualAnimation);
  await battlePage.close();

  if(errors.length)throw Error('Browser JS errors: '+errors.join(' | '));
  for(const file of ['01-title-screen.png','02-dialogue-opening.png','03-folio-village.png','04-repaired-bridge.png','05-foldline-combat.png','06-depth-exploration.png','07-threads-workshop.png','08-mila-courier-dialogue.png','09-tavi-three-quarter.png','10-tavi-front-three-quarter.png','11-morrow-follows.png','12-paper-bridge-torn.png','13-foldline-strike-animation.png','14-botanical-walk-cycle.png','15-mobile-landscape-emulation.png','16-dimensional-folio-buildings.png','17-north-terrace-near.png','18-north-terrace-distant.png','19-north-terrace-mobile.png','20-terrace-facade-art.png','21-terrace-foreground-occlusion.png']){
    console.log('CAPTURED',file,statSync('screenshots/'+file).size,'bytes');
  }
} finally {
  await browser.close();
}
