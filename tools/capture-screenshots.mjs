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
    const heads=visible('.tavi-stride-head-cel31');
    const geo=leg.length===1?leg[0].getBBox():null;
    const body=upper.length===1?upper[0].getBBox():null;
    const head=heads.length===1?heads[0].getBBox():null;
    const unitedHeight=body&&head?
      Math.max(body.y+body.height,head.y+head.height)-Math.min(body.y,head.y):0;
    return {pose,stride,walking:el.classList.contains('walking'),
      legs:leg.map(x=>x.dataset.cel),upper:upper.map(x=>x.dataset.upperFrame),
      heads:heads.map(x=>x.dataset.headFrame),
      geometry:geo&&{w:geo.width,h:geo.height},
      body:body&&{w:body.width,h:body.height},
      head:head&&{w:head.width,h:head.height},
      unitedHeight};
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
  if(walkingPose.heads.length!==1||walkingPose.heads[0]!==walkingPose.stride)
    throw Error('Illustrated head is out of sync with actual running body: '+JSON.stringify(walkingPose));
  // 0.31 deliberately separates original animated head art from torso art.
  // Test anatomical UNION, not the old coat-only box (whose height is ~80).
  if(!walkingPose.geometry||walkingPose.geometry.w<48||walkingPose.geometry.h<35||
     !walkingPose.body||walkingPose.body.w<65||walkingPose.body.h<65||
     !walkingPose.head||walkingPose.head.w<35||walkingPose.head.h<40||
     walkingPose.unitedHeight<140)
    throw Error('Illustrated head, coat, and legs fail combined anatomical proportions: '+
      JSON.stringify(walkingPose));
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
    started:true,area:'folio',x:365,y:560,facing:1,direction:'down',
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

  // This is the genuine game rendered at its gameplay camera, with authored
  // folio cross sections beneath the dynamic actor layer. Not concept art.
  const construction=await terraceNear.locator('#terraceStairFoldAssembly').evaluate(el=>{
    const b=el.getBBox(),ground=document.getElementById('terraceGround'),
      stage=document.getElementById('terraceDepthStage');
    const sections=[...el.querySelectorAll('.terrace-stair-fold')].map(e=>{
      const bb=e.getBBox();
      return {id:e.dataset.step,w:bb.width,h:bb.height,events:getComputedStyle(e).pointerEvents};
    });
    return {w:b.width,h:b.height,groundParent:ground.contains(el),
      beforeStage:!!(el.compareDocumentPosition(stage)&Node.DOCUMENT_POSITION_FOLLOWING),
      events:getComputedStyle(el).pointerEvents,sections};
  });
  if(!construction.groundParent||!construction.beforeStage||construction.w<800||
     construction.h<330||construction.events!=='none'||construction.sections.length!==6||
     construction.sections.some((step,i)=>step.id!==String(i+1)||
                        step.w<200||step.h<7||step.events!=='none'))
    throw Error('Physical paper-step artwork missing/collapsed/interactive: '+JSON.stringify(construction));
  const rake=await terraceNear.locator('#terraceStairRakingLight').evaluate(el=>{
    const b=el.getBBox();return {w:b.width,h:b.height,events:getComputedStyle(el).pointerEvents};
  });
  if(rake.w<600||rake.h<300||rake.events!=='none')
    throw Error('Subtle sunlight does not cover the six step edges: '+JSON.stringify(rake));

  // 0.21 actual rendered architecture, herbs and BOTH world-anchored contact lights.
  // Validate paint order, visible bounds and pointer passthrough before capture.
  for(const id of ['terracePaperArchitecture','terraceDyerPaperCore',
                    'terraceConservatoryPaperCore','terraceNaturalMarginalia',
                    'terraceDyerHerbs','terraceConservatorySpores','terracePressedPetals']){
    const result=await terraceNear.locator('#'+id).evaluate(el=>{
      const b=el.getBBox();
      return {w:b.width,h:b.height,pointer:getComputedStyle(el).pointerEvents,
        beforeActors:!!(el.compareDocumentPosition(document.getElementById('terraceDepthStage'))&
                        Node.DOCUMENT_POSITION_FOLLOWING)};
    });
    if(result.w<25||result.h<9||result.pointer!=='none'||!result.beforeActors)
      throw Error('0.21 paper architecture/botanical layer failed: '+id+' '+JSON.stringify(result));
  }
  const lighting=await terraceNear.locator('#taviContactBounce').evaluate(el=>{
    const bird=document.getElementById('morrowContactBounce');
    const actor=document.getElementById('tavi');
    const birdActor=document.getElementById('morrow');
    return {hero:parseFloat(el.getAttribute('opacity')||'0'),
      bird:parseFloat(bird.getAttribute('opacity')||'0'),
      heroParent:actor.contains(el),birdParent:birdActor.contains(bird)};
  });
  if(!lighting.heroParent||!lighting.birdParent||lighting.hero<.2||lighting.bird<.1)
    throw Error('Ground-contact illumination is missing from running character artwork: '+JSON.stringify(lighting));

  // 0.22: capture the ACTUAL running scene, not concept art.
  // The two cards must be independently authored, behind gate and actor,
  // not block touch, and shift by different subpixel amounts in the same tick.
  const vista=await terraceNear.locator('#terraceDistantCards').evaluate(far=>{
    const mid=document.getElementById('terraceMidgroundCards');
    const gate=document.getElementById('terraceGateBack');
    const title=document.getElementById('terraceLetterpressTitle');
    const groups=['terraceMountainBack','terraceValleyCard','terraceHillsideHamlet',
      'terraceLandscapeRetainingWall','terraceWildCopse'];
    const bounds=groups.map(id=>{
      const el=document.getElementById(id),b=el.getBBox();
      return {id,w:b.width,h:b.height,events:getComputedStyle(el).pointerEvents};
    });
    const offset=e=>{
      const tr=e.getAttribute('transform')||'';
      const xy=/translate\((-?[0-9.]+) (-?[0-9.]+)\)/.exec(tr);
      return xy?{x:Number(xy[1]),y:Number(xy[2])}:{x:0,y:0};
    };
    const plaque=document.getElementById('terraceLetterpressPlaque').getBBox();
    const label=title.getBBox();
    return {order:!!(far.compareDocumentPosition(mid)&Node.DOCUMENT_POSITION_FOLLOWING) &&
      !!(mid.compareDocumentPosition(gate)&Node.DOCUMENT_POSITION_FOLLOWING),
      farEvents:getComputedStyle(far).pointerEvents,
      midEvents:getComputedStyle(mid).pointerEvents,
      farOffset:offset(far),midOffset:offset(mid),bounds,
      labelWithinPlaque:label.x>plaque.x+3&&label.x+label.width<plaque.x+plaque.width-3,
      titleSize:parseFloat(getComputedStyle(title).fontSize)};
  });
  if(!vista.order||vista.farEvents!=='none'||vista.midEvents!=='none'||
      vista.bounds.some(x=>x.w<100||x.h<40||x.events!=='none')||
      !vista.labelWithinPlaque||vista.titleSize>20)
    throw Error('0.22 landscape painting/plaque regression: '+JSON.stringify(vista));
  // Perspective changes scenery only. Distant and nearer paper cards cannot
  // be the same transform even after settle; the walk plane stays immobile.
  const landscapeOld=await terraceNear.locator('#terraceGround').getAttribute('transform');
  await terraceNear.waitForTimeout(340);
  const parallax=await terraceNear.locator('#terraceDistantCards').evaluate(far=>{
    const a=/translate\((-?[0-9.]+) (-?[0-9.]+)\)/.exec(far.getAttribute('transform')||'');
    const b=/translate\((-?[0-9.]+) (-?[0-9.]+)\)/.exec(document.getElementById('terraceMidgroundCards').getAttribute('transform')||'');
    return {far:a&&a.slice(1).map(Number),mid:b&&b.slice(1).map(Number)};
  });
  if(!parallax.far||!parallax.mid||
      Math.abs(parallax.far[1]-parallax.mid[1])<.5||
      await terraceNear.locator('#terraceGround').getAttribute('transform')!==landscapeOld)
    throw Error('Independent two-layer parallax displaced real floor or failed: '+JSON.stringify(parallax));

  // 0.23: real browser confirms independently authored Dyer and Conservatory
  // architecture physically visible in gameplay, behind active characters
  // and never stealing tap or accessible buttons.
  const shopfrontQA=await terraceNear.locator('#terraceCraftedShopfronts').evaluate(root=>{
    const ids=['terraceDyeTower','terraceDyerRecess','terraceDyerSign','terraceDyerSilkCurtain',
      'terraceConservatoryCupola','terraceVellumBay','terraceHerbariumPlaque','terraceVellumSpecimens'];
    const rectangles=ids.map(id=>{
      const e=document.getElementById(id),b=e.getBBox();
      return {id,w:b.width,h:b.height,x:b.x,y:b.y,events:getComputedStyle(e).pointerEvents};
    });
    const stage=document.getElementById('terraceDepthStage');
    const plaque=document.getElementById('terraceHerbariumPlaque').getBBox();
    const sign=document.getElementById('terraceDyerSign').getBBox();
    const properOrder=!!(root.compareDocumentPosition(stage)&Node.DOCUMENT_POSITION_FOLLOWING);
    const nearLeft=rectangles.find(a=>a.id==='terraceDyeTower');
    const nearRight=rectangles.find(a=>a.id==='terraceConservatoryCupola');
    return {rootEvents:getComputedStyle(root).pointerEvents,
      properOrder,rectangles,signFits:sign.x>=0&&sign.x+sign.width<300,
      plaqueFits:plaque.x>1150&&plaque.x+plaque.width<1450,
      twoDifferentSilhouettes:nearLeft.w!==nearRight.w||nearLeft.h!==nearRight.h,
      distinctParents:document.getElementById('terraceDyerIdentity')!==document.getElementById('terraceConservatoryIdentity')};
  });
  if(shopfrontQA.rootEvents!=='none'||!shopfrontQA.properOrder||
      !shopfrontQA.signFits||!shopfrontQA.plaqueFits||
      !shopfrontQA.twoDifferentSilhouettes||!shopfrontQA.distinctParents||
      shopfrontQA.rectangles.some(b=>b.w<65||b.h<26||b.events!=='none')){
    throw Error('0.23 distinct shop architecture missing, occluded, or intercepting touch: '+JSON.stringify(shopfrontQA));
  }

  // A genuine in-world label can be present but covered by iPhone controls.
  // Compare rendered screen-space bounds, not untransformed SVG paths.
  const signRect=await terraceNear.locator('#terraceDyerSign').boundingBox();
  const dpadRect=await terraceNear.locator('.dpad').boundingBox();
  const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*
                        Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
  if(!signRect||!dpadRect||overlap(signRect,dpadRect)>1)
    throw Error('0.23.1 shop sign still obscured by landscape movement pad: '+
      JSON.stringify({signRect,dpadRect}));
  const savedPose=await terraceNear.locator('#tavi').getAttribute('transform');
  const rectBefore=await terraceNear.locator('#terraceCraftedShopfronts').evaluate(el=>{const b=el.getBBox();return {x:b.x,width:b.width};});

  // 0.24 is checked in real Chromium at the actual world camera.
  const inlayQA=await terraceNear.locator('#terraceBookbinderWalkway').evaluate(root=>{
    const stage=document.getElementById('terraceDepthStage');
    const pave=document.getElementById('terracePavingInlay');
    const rect=id=>{const b=document.getElementById(id).getBBox();return {x:b.x,y:b.y,w:b.width,h:b.height}};
    return {
      pointer:getComputedStyle(root).pointerEvents,
      behindActors:!!(root.compareDocumentPosition(stage)&Node.DOCUMENT_POSITION_FOLLOWING),
      afterPavement:!!(pave.compareDocumentPosition(root)&Node.DOCUMENT_POSITION_FOLLOWING),
      seal:rect('terraceMenderInlay'),
      shadows:rect('terraceLongCastShadows'),
      footings:rect('terraceGateCardFooting'),
      sutures:rect('terraceBindingSutures')};
  });
  if(inlayQA.pointer!=='none'||!inlayQA.behindActors||!inlayQA.afterPavement||
     inlayQA.seal.w<140||inlayQA.seal.h<35||inlayQA.shadows.w<700||
     inlayQA.shadows.h<120||inlayQA.footings.w<300||
     inlayQA.sutures.w<400){
    throw Error('0.24 grounded cut-paper art invisible or in wrong depth layer: '+
      JSON.stringify(inlayQA));
  }
  const treeLeafBox=await terraceNear.locator('#terraceRibbonTree .terrace-leaf-sway').boundingBox();
  const conservatoryBox=await terraceNear.locator('#terraceVellumBay').boundingBox();
  const intersectionArea=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*
    Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
  const treeCover=treeLeafBox&&conservatoryBox?
    intersectionArea(treeLeafBox,conservatoryBox)/(conservatoryBox.width*conservatoryBox.height):1;
  if(!treeLeafBox||!conservatoryBox||treeCover>.11){
    throw Error('0.24 windswept tree still obscures the botanical architecture: '+
      JSON.stringify({treeLeafBox,conservatoryBox,treeCover}));
  }

  const kioskBox=await terraceNear.locator('#terraceKiosk').boundingBox();
  const kioskCover=treeLeafBox&&kioskBox?
    intersectionArea(treeLeafBox,kioskBox)/(kioskBox.width*kioskBox.height):1;
  if(!kioskBox||kioskCover>.075){
    throw Error('0.24.1 tree canopy obscures the archive kiosk: '+
      JSON.stringify({treeLeafBox,kioskBox,kioskCover}));
  }
  const groundPose=await terraceNear.locator('#terraceBookbinderWalkway').getAttribute('transform');
  const trunkPose=await terraceNear.locator('#terraceRibbonTree').getAttribute('transform');
  await terraceNear.waitForTimeout(220);
  if(groundPose!==await terraceNear.locator('#terraceBookbinderWalkway').getAttribute('transform')||
     trunkPose!==await terraceNear.locator('#terraceRibbonTree').getAttribute('transform')){
    throw Error('0.24 parallax must not move fixed scenery or tree collision anchor');
  }
  console.log('0.24 COMPOSITION:',JSON.stringify({treeCover,inlayQA}));

  // First Fold 0.25: real Chromium verifies ALL independently painted coat
  // facings are present, character world-coordinate shadows remain outside
  // the animated body, and lighting is derived from actual terrace position.
  // The screenshot runner starts in Reduced Motion by design. Verify normal
  // body-only bounce explicitly, then restore reduced-motion rendering.
  await terraceNear.emulateMedia({reducedMotion:'no-preference'});
  const actorsQA=await terraceNear.locator('#tavi').evaluate(actor=>{
    const bird=document.getElementById('morrow');
    const rimGroups=[...actor.querySelectorAll('.tavi-cardstock-coat-edges')];
    const numByPose={};
    for(const e of rimGroups)numByPose[e.getAttribute('data-coat-view')]=(numByPose[e.getAttribute('data-coat-view')]||0)+1;
    const getBox=id=>{const b=document.getElementById(id).getBBox();return {width:b.width,height:b.height,x:b.x,y:b.y}};
    const bshadow=document.getElementById('morrowGroundShadow');
    const tshadow=document.getElementById('taviGroundShadow');
    const tflip=document.getElementById('taviFlip');
    const msprite=document.getElementById('morrowSprite');
    actor.classList.add('walking');
    const rootAnimation=getComputedStyle(actor).animationName;
    const bodyAnimation=getComputedStyle(tflip).animationName;
    actor.classList.remove('walking');
    return {numByPose,rootAnimation,bodyAnimation,
      taviMaterial:actor.style.getPropertyValue('--paper-rim-strength'),
      morrowMaterial:bird.style.getPropertyValue('--paper-rim-strength'),
      taviShadowSibling:tshadow.parentNode===tflip.parentNode,
      morrowShadowSibling:bshadow.parentNode===msprite.parentNode,
      taviShadow:getBox('taviFootOcclusion'),
      birdPaper:getBox('morrowCardstockFeathers'),
      taviPaper:getBox('taviGroundShadow'),
      birdPaperOpacity:getComputedStyle(document.getElementById('morrowCardstockFeathers')).opacity};
  });
  if(['front','rear','side','quarter-front','quarter-rear'].some(x=>actorsQA.numByPose[x]!==8)||
     actorsQA.rootAnimation!=='none'||!actorsQA.bodyAnimation.includes('farerBodyStride')||
     !actorsQA.taviShadowSibling||!actorsQA.morrowShadowSibling||
     actorsQA.taviShadow.width<55||actorsQA.birdPaper.height<85||
     actorsQA.taviPaper.width<100||
     Number(actorsQA.taviMaterial)<.5||Number(actorsQA.morrowMaterial)<.5){
    throw Error('0.25 characters are not physically integrated on real gameplay floor: '+JSON.stringify(actorsQA));
  }
  await terraceNear.emulateMedia({reducedMotion:'reduce'});
  const reducedMotionQA=await terraceNear.locator('#tavi').evaluate(actor=>{
    actor.classList.add('walking');
    const animation=getComputedStyle(document.getElementById('taviFlip')).animationName;
    actor.classList.remove('walking');
    return animation;
  });
  if(reducedMotionQA!=='none')
    throw Error('0.25 must disable body bob in Reduced Motion: '+reducedMotionQA);
  // Snapshot is captured from game renderer after all actual movement and
  // stage depth ordering have run, never from standalone concept artwork.

  // 0.26: verify ALL real animation frames, the genuinely moving bird wing
  // cels and sculpted rear-hair dimensions in the browser's active scene.
  // This rejects an attractive but unused overlay or concept art.
  const paintQA=await terraceNear.locator('#tavi').evaluate(actor=>{
    const frames=[...actor.querySelectorAll('.tavi-upper-cel')];
    const perView={};let correctlyPainted=0;
    for(const cel of frames){
      const view=cel.getAttribute('data-upper-view');
      const paths=[...cel.querySelectorAll(':scope > .tavi-upper-coat > path')];
      const a=paths.filter(path=>(path.getAttribute('fill')||'').startsWith('url('));
      const good=a.length>=2 &&
        a[0].getAttribute('fill')==='url(#farerCoatShell-'+view+')' &&
        a[1].getAttribute('fill')==='url(#farerCoatPanel-'+view+')';
      if(good)correctlyPainted++;
      perView[view]=(perView[view]||0)+(good?1:0);
    }
    const bird=document.getElementById('morrow');
    const wingFrames=[...bird.querySelectorAll('.morrow-wing-frame')];
    const wingsCorrect=wingFrames.length===4&&wingFrames.every(w=>{
      const l=w.querySelector('.inkwing-left > path'),r=w.querySelector('.inkwing-right > path');
      return l?.getAttribute('fill')==='url(#morrowWingInkLeft)' &&
             r?.getAttribute('fill')==='url(#morrowWingInkRight)';
    });
    const hair=document.getElementById('taviRearHairCut'),gate=document.getElementById('terraceArchEdgeRelief');
    const hb=hair.getBBox(),gb=gate.getBBox();
    return {frames:frames.length,correctlyPainted,perView,wingsCorrect,
      hair:{w:hb.width,h:hb.height},gate:{w:gb.width,h:gb.height,
        pointer:getComputedStyle(gate).pointerEvents},
      hairInTavi:actor.contains(hair),wingsInMorrow:bird.contains(wingFrames[0]),
      worldAnchor:actor.getAttribute('transform')};
  });
  if(paintQA.frames!==40||paintQA.correctlyPainted!==40||
    ['front','rear','side','quarter-front','quarter-rear'].some(v=>paintQA.perView[v]!==8)||
    !paintQA.wingsCorrect||!paintQA.hairInTavi||!paintQA.wingsInMorrow||
    paintQA.hair.w<55||paintQA.hair.h<72||
    paintQA.gate.w<260||paintQA.gate.h<180||paintQA.gate.pointer!=='none')
    throw Error('0.26 watercolor material atlas failed in actual running game: '+JSON.stringify(paintQA));
  console.log('0.26 REAL CHARACTER MATERIALS:',JSON.stringify(paintQA));

  // 0.26.1 release-check the corrected hair geometry and authored shading
  // directly within the playable back-facing character.
  const crownQA=await terraceNear.locator('#taviRearHairCut').evaluate(hair=>{
    const tavi=document.getElementById('tavi');
    const group=tavi.querySelector('.farer-hair-volume[data-hair-view="rear"]');
    const r=hair.getBBox(),strands=[...group.querySelectorAll('path')];
    return {bounds:{width:r.width,height:r.height,x:r.x,y:r.y},
      containedByActor:tavi.contains(hair),grad:hair.getAttribute('fill'),
      strandCount:strands.length,
      maxStroke:Math.max(...strands.map(p=>Number(p.getAttribute('stroke-width')))),
      noTouch:getComputedStyle(group).pointerEvents};
  });
  if(!crownQA.containedByActor||crownQA.grad!=='url(#farerHairRear)'||
    crownQA.bounds.width<65||crownQA.bounds.height<75||
    crownQA.strandCount!==3||crownQA.maxStroke>3.3||crownQA.noTouch!=='none')
    throw Error('0.26.1 sculpted hair silhouette is not legible/grounded: '+JSON.stringify(crownQA));
  console.log('0.26.1 CORRECTED ORIGINAL REAR HAIR:',JSON.stringify(crownQA));

  // 0.27: these objects must be real stationary world props in the existing
  // painter-sorted stage, with measurable physical dimensions and zero touch
  // interception; visual screenshot is from actual game renderer.
  const propsQA=await terraceNear.locator('#terraceDepthStage').evaluate(stage=>{
    const measure=id=>{
      const e=document.getElementById(id),b=e.getBBox();
      return {id,x:b.x,y:b.y,w:b.width,h:b.height,
        pointer:getComputedStyle(e).pointerEvents,
        inStage:stage.contains(e)};
    };
    return {
      bell:measure('terraceBell'),
      kiosk:measure('terraceKiosk'),
      bellPieces:['terraceBellFoldedPlinth','terraceBellPavilion','terraceBellHanging'].map(measure),
      kioskPieces:['terraceFolioKioskBase','terraceFolioKioskHinges',
        'terraceFolioKioskCanopy','terraceFolioKioskPages'].map(measure),
      treeBranch:measure('terraceTreeBranchConstruction'),
      bellAnchor:document.getElementById('terraceBell').getAttribute('transform'),
      kioskAnchor:document.getElementById('terraceKiosk').getAttribute('transform')
    };
  });
  if(propsQA.bellAnchor!=='translate(719 484)'||propsQA.kioskAnchor!=='translate(1022 660)'||
      propsQA.bell.w<135||propsQA.bell.w>225||propsQA.bell.h<160||propsQA.bell.h>245||
      propsQA.kiosk.w<180||propsQA.kiosk.w>280||propsQA.kiosk.h<160||propsQA.kiosk.h>250||
      propsQA.bellPieces.some(p=>p.w<55||p.h<22||p.pointer!=='none'||!p.inStage)||
      propsQA.kioskPieces.some(p=>p.w<55||p.h<25||p.pointer!=='none'||!p.inStage)||
      propsQA.treeBranch.h<120||!propsQA.treeBranch.inStage){
    throw Error('0.27 architectural prop regression: '+JSON.stringify(propsQA));
  }
  const stablePlayer=await terraceNear.locator('#tavi').getAttribute('transform');
  await terraceNear.waitForTimeout(210);
  if(stablePlayer!==await terraceNear.locator('#tavi').getAttribute('transform'))
    throw Error('0.27 art displaced real player physical anchor');
  console.log('0.27 BUILT PAPER WORLD:',JSON.stringify(propsQA));

  // 0.28: ensure all four authored art layers exist as measurable parts of the
  // real running SVG stage and remain unable to steal iPhone touch controls.
  const botanicalQA=await terraceNear.locator('#terraceScene').evaluate(scene=>{
    const ids=['terraceAtmosphericWatercolor28','terraceDyerSilkRelief28',
      'terraceConservatoryBotanicalEtching28','terraceLeafClusterStructure28'];
    return ids.map(id=>{
      const el=document.getElementById(id),b=el.getBBox();
      return {id,w:b.width,h:b.height,events:getComputedStyle(el).pointerEvents,
        inScene:scene.contains(el)};
    });
  });
  if(botanicalQA.some(a=>!a.inScene||a.events!=='none'||a.w<90||a.h<65))
    throw Error('0.28 actual illustrated scene missing/unusable: '+JSON.stringify(botanicalQA));
  if(await terraceNear.locator('#tavi').getAttribute('transform')!==stablePlayer)
    throw Error('0.28 art displaced the playable hero');
  console.log('0.28 REAL BOTANICAL ILLUSTRATION:',JSON.stringify(botanicalQA));

  // 0.29 original architectural geometry QA in the running game.
  const relief29=await terraceNear.evaluate(()=>{
    const ids=['terraceDyeTower','terraceConservatoryCupola','terraceBuiltRoofProfiles29',
      'terraceDyerMultiPlyRoof29','terraceConservatoryCurledEaves29',
      'taviRearIllustratedSilhouette29'];
    const scene=document.getElementById('terraceScene'), actor=document.getElementById('tavi');
    const root=document.getElementById('terracePaperArchitecture');
    return ids.map(id=>{
      const el=document.getElementById(id),bounds=el.getBBox();
      return {id,w:bounds.width,h:bounds.height,events:getComputedStyle(el).pointerEvents,
       inWorld:id.startsWith('tavi')?actor.contains(el):scene.contains(el),
       structural:id==='terraceBuiltRoofProfiles29'?root.contains(el):true};
    });
  });
  if(relief29.some(item=>!item.inWorld||!item.structural||item.events!=='none'||
    item.w<35||item.h<19))
    throw Error('0.29 structural art visibility/depth/touch check failed: '+JSON.stringify(relief29));
  if(relief29[0].w<125||relief29[0].h<200||relief29[1].w<115||relief29[1].h<180||
    relief29[2].w<1250||relief29[2].h<200)
    throw Error('0.29 reconstructed architecture has collapsed or invisible size: '+JSON.stringify(relief29));
  if(await terraceNear.locator('#tavi').getAttribute('transform')!==stablePlayer)
    throw Error('0.29 art moved the player or broke ground anchoring');
  console.log('0.29 ORIGINAL REBUILT PAPER ARCHITECTURE:',JSON.stringify(relief29));

  // 0.30 inspect each actual field head and every authored turn head in the
  // running game, including parent relationships and the displayed transform.
  const proportion30=await terraceNear.locator('#tavi').evaluate(actor=>{
    const heads=[...actor.querySelectorAll('.tavi-proportioned-head30')];
    const turns=[...actor.querySelectorAll('.tavi-turn-head30')];
    const expressions=[...actor.querySelectorAll('.tavi-expression-atlas')];
    const measure=e=>{
      const b=e.getBBox(), transform=e.getAttribute('transform');
      return {w:b.width,h:b.height,transform,events:getComputedStyle(e).pointerEvents};
    };
    const field=heads.map(e=>({view:e.dataset.proportionView,...measure(e)}));
    return {field,turns:turns.map(e=>({...measure(e),name:e.dataset.turnHead})),
      expressions:expressions.map(e=>({...measure(e),view:e.dataset.faceView})),
      actorTransform:actor.getAttribute('transform'),
      walkingUpper:actor.querySelectorAll('.tavi-upper-cel').length,
      walkingLegs:actor.querySelectorAll('.tavi-walk-cel').length};
  });
  if(proportion30.field.length!==5||proportion30.turns.length!==6||
    proportion30.expressions.length!==3||
    proportion30.walkingUpper!==40||proportion30.walkingLegs!==40||
    proportion30.field.some(x=>x.transform!=='translate(0 -12) scale(.88)'||
      x.events!=='none'||x.w<35||x.h<45)||
    proportion30.turns.some(x=>x.transform!=='translate(0 -12) scale(.88)'||
      x.events!=='none'||x.w<25||x.h<30)||
    proportion30.expressions.some(x=>x.transform!=='translate(0 -12) scale(.88)'||
      x.events!=='none')||
    proportion30.actorTransform!==stablePlayer)
      throw Error('0.30 in-engine character proportion/animation integrity failed: '+
        JSON.stringify(proportion30));
  console.log('0.30 ACTUAL CHARACTER PROPORTIONS:',JSON.stringify(proportion30));

  // 0.31: Render the real direction-specific eight-frame head atlas alongside
  // the existing independently painted upper and lower walking sprite cels.
  await terraceNear.emulateMedia({reducedMotion:'no-preference'});
  const headAudit31=await terraceNear.locator('#tavi').evaluate(actor=>{
    const oldClass=actor.getAttribute('class'),oldStride=actor.dataset.stride;
    const views=[
      ['front','taviFrontArt','dir-down'],
      ['rear','taviBackArt','dir-up'],
      ['side','taviSideArt','dir-side'],
      ['quarter-front','taviFrontQuarterArt','dir-diag-down'],
      ['quarter-rear','taviBackQuarterArt','dir-diag-up']
    ];
    const errors=[],data=[];
    try{
      for(const [view,poseId,dirClass] of views){
        const pose=document.getElementById(poseId);
        const frames=[...pose.querySelectorAll('.tavi-stride-head-cel31')];
        if(frames.length!==8)errors.push(view+' has '+frames.length+' head cels');
        for(let n=0;n<8;n++){
          actor.classList.remove('dir-up','dir-down','dir-side','dir-diag-down','dir-diag-up',
            'turning','pivoting');
          actor.classList.add(dirClass,'walking');
          actor.dataset.stride=String(n);
          const visible=selector=>[...pose.querySelectorAll(selector)]
            .filter(el=>getComputedStyle(el).display!=='none');
          const heads=visible('.tavi-stride-head-cel31');
          const torso=visible('.tavi-upper-cel');
          const legs=visible('.tavi-walk-cel');
          const oldHead=pose.querySelector('.tavi-proportioned-head30');
          const measured=heads[0]?.getBBox();
          if(heads.length!==1||heads[0]?.dataset.headFrame!==String(n)||
             torso.length!==1||torso[0]?.dataset.upperFrame!==String(n)||
             legs.length!==1||legs[0]?.dataset.cel!==String(n)||
             getComputedStyle(oldHead).display!=='none'||
             !measured||measured.width<35||measured.height<40||
             getComputedStyle(heads[0]).pointerEvents!=='none')
            errors.push(view+'/'+n+' failed aligned triple-cel rendering');
          if(n===0||n===4)data.push({view,stride:n,w:measured?.width,h:measured?.height});
        }
      }
    }finally{
      actor.setAttribute('class',oldClass);
      actor.dataset.stride=oldStride;
    }
    return {errors,data,total:actor.querySelectorAll('.tavi-stride-head-cel31').length,
      upper:actor.querySelectorAll('.tavi-upper-cel').length,
      lower:actor.querySelectorAll('.tavi-walk-cel').length};
  });
  if(headAudit31.errors.length||headAudit31.total!==40||
     headAudit31.upper!==40||headAudit31.lower!==40)
     throw Error('0.31 walk head/torso/leg registration failed: '+JSON.stringify(headAudit31));
  console.log('0.31 GENUINE ANIMATED CHARACTER HEAD ATLAS:',JSON.stringify(headAudit31));
  const moving31=await openedAt({started:true,area:'terrace',x:720,y:701,facing:1,
    direction:'up',metMorrow:true,mended:false,threadSample:false,letter:false,won:false});
  await moving31.emulateMedia({reducedMotion:'no-preference'});
  await moving31.keyboard.down('ArrowRight');
  // Capture only after the real paper-turn cels release their canvas.
  // Slow/loaded browsers must never create an empty head screenshot.
  await moving31.waitForFunction(()=>{
    const actor=document.getElementById('tavi');
    if(!actor.classList.contains('walking')||actor.classList.contains('turning'))return false;
    const shown=[...actor.querySelectorAll('.tavi-stride-head-cel31')]
      .filter(x=>getComputedStyle(x).display!=='none'&&
        getComputedStyle(x.parentElement.parentElement).display!=='none');
    return shown.length===1&&shown[0].dataset.headFrame===actor.dataset.stride;
  },null,{timeout:3500});
  const walking31=await moving31.locator('#tavi').evaluate(actor=>{
    const shown=[...actor.querySelectorAll('.tavi-stride-head-cel31')]
      .filter(x=>getComputedStyle(x).display!=='none'&&
        getComputedStyle(x.parentElement.parentElement).display!=='none');
    return {walking:actor.classList.contains('walking'),stride:actor.dataset.stride,
      headPaint:shown.map(x=>x.dataset.headView+'-'+x.dataset.headFrame)};
  });
  if(!walking31.walking||!walking31.headPaint.length)
    throw Error('0.31 moving screenshot must capture a real animated walk: '+JSON.stringify(walking31));
  await moving31.screenshot({path:'screenshots/47-tavi-live-eight-phase-walk.png',animations:'allow'});
  await moving31.keyboard.up('ArrowRight');
  await moving31.close();

  // 0.32: verify these layers are ACTUALLY within each moving coat and not
  // a separate static sticker drawn over the world or the character.
  const paperCoat32=await terraceNear.locator('#tavi').evaluate(actor=>{
    const oldClass=actor.getAttribute('class'),oldStride=actor.dataset.stride;
    const views=[['front','taviFrontArt','dir-down'],['rear','taviBackArt','dir-up'],
      ['side','taviSideArt','dir-side'],['quarter-front','taviFrontQuarterArt','dir-diag-down'],
      ['quarter-rear','taviBackQuarterArt','dir-diag-up']];
    const errors=[],measurements=[];
    try{
      for(const [view,poseId,dirClass] of views){
        const pose=document.getElementById(poseId);
        for(let n=0;n<8;n++){
          actor.classList.remove('dir-up','dir-down','dir-side','dir-diag-down','dir-diag-up',
            'turning','pivoting'); actor.classList.add(dirClass,'walking');
          actor.dataset.stride=String(n);
          const visible=[...pose.querySelectorAll('.tavi-upper-cel')]
            .filter(x=>getComputedStyle(x).display!=='none');
          const upper=visible[0],paint=upper?.querySelector('.tavi-painted-costume32');
          const wash=upper?.querySelector('.tavi-pigment-foundation32');
          const coat=upper?.querySelector('.tavi-upper-coat');
          const clip=document.getElementById('taviCostumeCut32-'+view+'-'+n);
          const silhouette=coat?.querySelector('path[fill^="url(#farerCoatShell-"]');
          const sourceBounds=silhouette?.getBBox(),inkBounds=paint?.getBBox();
          const clipPath=clip?.querySelector('path');
          if(visible.length!==1||upper?.dataset.upperFrame!==String(n)||
            !paint||!wash||!clipPath||!silhouette||
            clipPath.getAttribute('d')!==silhouette.getAttribute('d')||
            paint.dataset.paintPose!==view+'-'+n||
            !sourceBounds||sourceBounds.width<43||sourceBounds.height<58||
            !inkBounds||inkBounds.width<33||inkBounds.height<38||
            getComputedStyle(paint).pointerEvents!=='none'||
            getComputedStyle(wash).pointerEvents!=='none')
            errors.push(view+'/'+n+' misregistered, clipped, or unpainted');
          if(n===0||n===4)measurements.push({view,n,
            coatW:sourceBounds?.width,coatH:sourceBounds?.height,inkW:inkBounds?.width});
        }
      }
    }finally{actor.setAttribute('class',oldClass);actor.dataset.stride=oldStride}
    return {errors,measurements,numberOfPaintCels:actor.querySelectorAll('.tavi-painted-costume32').length,
      originalHeadCels:actor.querySelectorAll('.tavi-stride-head-cel31').length,
      originalUpperCels:actor.querySelectorAll('.tavi-upper-cel').length};
  });
  if(paperCoat32.errors.length||paperCoat32.numberOfPaintCels!==40||
     paperCoat32.originalHeadCels!==40||paperCoat32.originalUpperCels!==40)
     throw Error('0.32 physical in-game coat paint/geometry failed: '+JSON.stringify(paperCoat32));
  console.log('0.32 ACTUAL 40 COSTUME MATERIALS:',JSON.stringify(paperCoat32));
  const moving32=await openedAt({started:true,area:'terrace',x:720,y:701,facing:1,
    direction:'up',metMorrow:true,mended:false,threadSample:false,letter:false,won:false});
  await moving32.emulateMedia({reducedMotion:'no-preference'});
  await moving32.keyboard.down('ArrowRight');
  // Only a fully selected gait frame is a valid costume screenshot.
  await moving32.waitForFunction(()=>{
    const actor=document.getElementById('tavi');
    if(!actor.classList.contains('walking')||actor.classList.contains('turning'))return false;
    const shown=[...actor.querySelectorAll('.tavi-upper-cel')]
      .filter(x=>getComputedStyle(x).display!=='none'&&
        getComputedStyle(x.parentElement.parentElement).display!=='none');
    const paint=shown[0]?.querySelector('.tavi-painted-costume32');
    return shown.length===1&&shown[0].dataset.upperFrame===actor.dataset.stride&&
      !!paint&&getComputedStyle(paint).pointerEvents==='none';
  },null,{timeout:3500});
  const actualCoat32=await moving32.locator('#tavi').evaluate(actor=>{
    const visible=[...actor.querySelectorAll('.tavi-upper-cel')]
      .filter(el=>getComputedStyle(el).display!=='none'&&
        getComputedStyle(el.parentElement.parentElement).display!=='none');
    const paint=visible[0]?.querySelector('.tavi-painted-costume32');
    return {moving:actor.classList.contains('walking'),stride:actor.dataset.stride,
      frame:visible[0]?.dataset.upperFrame,coatPaint:paint?.dataset.paintPose};
  });
  if(!actualCoat32.moving||actualCoat32.stride!==actualCoat32.frame||
     !actualCoat32.coatPaint)
    throw Error('0.32 screenshot must show real in-motion costume art: '+JSON.stringify(actualCoat32));
  await moving32.screenshot({path:'screenshots/48-tavi-costume-painted-in-motion.png',animations:'allow'});
  await moving32.locator('#tavi').screenshot({path:'screenshots/49-tavi-costume-real-game-closeup.png',
    animations:'allow'});
  await moving32.keyboard.up('ArrowRight');
  await moving32.close();

  // 0.33: inspect the ORIGINAL physical actor's five facings across rest and
  // eight walking cels. New hand contours must be part of the visible arm art.
  const anatomy33=await terraceNear.locator('#tavi').evaluate(actor=>{
    const views=[['front','taviFrontArt','dir-down'],['rear','taviBackArt','dir-up'],
      ['side','taviSideArt','dir-side'],['quarter-front','taviFrontQuarterArt','dir-diag-down'],
      ['quarter-rear','taviBackQuarterArt','dir-diag-up']];
    const priorClass=actor.getAttribute('class'),priorStride=actor.dataset.stride;
    const mistakes=[],summary=[];
    try{
      for(const [view,poseId,cls] of views){
        actor.classList.remove('dir-up','dir-down','dir-side','dir-diag-up','dir-diag-down',
          'walking','pivoting','turning');actor.classList.add(cls);
        const pose=document.getElementById(poseId),rest=pose.querySelector('.tavi-rest-torso');
        const hands=[...rest.querySelectorAll('.tavi-inked-hand33')];
        if(hands.length!==2||hands.some(el=>el.getBBox().width<10||el.getBBox().height<9||
          getComputedStyle(el).pointerEvents!=='none'))
          mistakes.push('idle '+view+' hands missing');
        if(['front','side','quarter-front'].includes(view)){
          const face=pose.querySelector('.tavi-proportioned-head30 .tavi-sculpted-face33');
          const box=face?.getBBox();
          if(!face||!box||box.width<45||box.height<65)
            mistakes.push('idle '+view+' face silhouette invalid');
        }
        for(let n=0;n<8;n++){
          actor.classList.add('walking');actor.dataset.stride=String(n);
          const showing=[...pose.querySelectorAll('.tavi-upper-cel')]
            .filter(el=>getComputedStyle(el).display!=='none');
          const arms=showing[0]?.querySelectorAll('.tavi-inked-hand33');
          const head=[...pose.querySelectorAll('.tavi-stride-head-cel31')]
            .filter(el=>getComputedStyle(el).display!=='none');
          if(showing.length!==1||showing[0]?.dataset.upperFrame!==String(n)||
             arms?.length!==2||
             [...(arms||[])].some(x=>x.dataset.handFrame!==String(n)||
                x.dataset.handView!==view||x.getBBox().width<10||
                getComputedStyle(x).pointerEvents!=='none')||
             head.length!==1||head[0]?.dataset.headFrame!==String(n))
            mistakes.push('gait anatomy misaligned '+view+'/'+n);
          actor.classList.remove('walking');
        }
        summary.push({view,idleHands:hands.length,walkingCels:pose.querySelectorAll('.tavi-upper-cel').length});
      }
    }finally{actor.setAttribute('class',priorClass);actor.dataset.stride=priorStride}
    return {mistakes,summary,shapedHands:actor.querySelectorAll('.tavi-inked-hand33').length,
      sculptedFaces:actor.querySelectorAll('.tavi-sculpted-face33').length};
  });
  if(anatomy33.mistakes.length||anatomy33.shapedHands!==102||
     anatomy33.sculptedFaces!==27)
    throw Error('0.33 real actor anatomy not fully integrated: '+JSON.stringify(anatomy33));
  console.log('0.33 SCULPTED IN-GAME CHARACTER:',JSON.stringify(anatomy33));
  const face33=await openedAt({started:true,area:'terrace',x:720,y:702,facing:1,direction:'down',
    metMorrow:true,mended:false,threadSample:false,letter:false,won:false});
  await face33.emulateMedia({reducedMotion:'reduce'});
  const current=await face33.locator('#tavi').evaluate(actor=>{
    const pose=document.getElementById('taviFrontArt');
    return {direction:actor.classList.contains('dir-down'),
      idleHands:pose.querySelectorAll('.tavi-rest-torso .tavi-inked-hand33').length,
      face:!!pose.querySelector('.tavi-proportioned-head30 .tavi-sculpted-face33')};
  });
  if(!current.direction||current.idleHands!==2||!current.face)
    throw Error('0.33 creator close-up must render actual front-view sculpted Tavi: '+
      JSON.stringify(current));
  await face33.screenshot({path:'screenshots/50-tavi-anatomy-in-real-terrace.png'});
  await face33.locator('#tavi').screenshot({path:'screenshots/51-tavi-anatomy-original-actor-closeup.png'});

  // 0.34: validate physically painted hair and collars across 5x8 live stride
  // selection and all six authored turns, not conceptual art or DOM counts alone.
  const cutPaper34=await terraceNear.locator('#tavi').evaluate(actor=>{
    const views=[['front','taviFrontArt','dir-down'],['rear','taviBackArt','dir-up'],
      ['side','taviSideArt','dir-side'],['quarter-front','taviFrontQuarterArt','dir-diag-down'],
      ['quarter-rear','taviBackQuarterArt','dir-diag-up']];
    const priorClass=actor.getAttribute('class'),priorStride=actor.dataset.stride;
    const errors=[],dimensions=[];
    const good=el=>{
      if(!el||getComputedStyle(el).pointerEvents!=='none')return false;
      const bb=el.getBBox();
      return bb.width>=38&&bb.height>=14;
    };
    try{
      for(const [view,poseId,cls] of views){
        actor.classList.remove('dir-up','dir-down','dir-side','dir-diag-up','dir-diag-down',
          'walking','pivoting','turning');
        actor.classList.add(cls);
        const pose=document.getElementById(poseId);
        const head=pose.querySelector('.tavi-proportioned-head30');
        const coat=pose.querySelector('.tavi-rest-torso');
        const idleHair=head?.querySelector('.tavi-cardstock-hair34');
        const idleCollar=coat?.querySelector('.tavi-woven-collar34');
        if(!good(idleHair)||!good(idleCollar))errors.push('Idle '+view+' incomplete');
        for(let frame=0;frame<8;frame++){
          actor.classList.add('walking'); actor.dataset.stride=String(frame);
          const heads=[...pose.querySelectorAll('.tavi-stride-head-cel31')]
            .filter(x=>getComputedStyle(x).display!=='none');
          const upper=[...pose.querySelectorAll('.tavi-upper-cel')]
            .filter(x=>getComputedStyle(x).display!=='none');
          const hair=heads[0]?.querySelector('.tavi-cardstock-hair34');
          const collar=upper[0]?.querySelector('.tavi-woven-collar34');
          if(heads.length!==1||upper.length!==1||heads[0].dataset.headFrame!==String(frame)||
             upper[0].dataset.upperFrame!==String(frame)||
             hair?.dataset.hair34!==view+'-'+frame||
             collar?.dataset.collar34!==view+'-'+frame||
             !good(hair)||!good(collar))
             errors.push('Missing 0.34 registered illustrated frames '+view+'/'+frame);
          if(frame===0||frame===4){
            const b=hair?.getBBox();dimensions.push({view,frame,hairW:b?.width,hairH:b?.height});
          }
          actor.classList.remove('walking');
        }
      }
      const turns=[...actor.querySelectorAll('.tavi-turn-head30')];
      if(turns.length!==6||turns.some(t=>!good(t.querySelector('.tavi-cardstock-hair34'))))
         errors.push('Actual authored full-body turns missing matching paper hair');
    }finally{actor.setAttribute('class',priorClass);actor.dataset.stride=priorStride}
    return {errors,dimensions,hairCount:actor.querySelectorAll('.tavi-cardstock-hair34').length,
      collarCount:actor.querySelectorAll('.tavi-woven-collar34').length,
      upperCount:actor.querySelectorAll('.tavi-upper-cel').length};
  });
  if(cutPaper34.errors.length||cutPaper34.hairCount!==51||
     cutPaper34.collarCount!==45||cutPaper34.upperCount!==40)
    throw Error('0.34 actual playable paper-hair and collar art regressed: '+JSON.stringify(cutPaper34));
  console.log('0.34 GENUINE PAPER CHARACTER ART:',JSON.stringify(cutPaper34));
  await face33.screenshot({path:'screenshots/52-tavi-cut-paper-hair-in-game.png'});
  await face33.locator('#tavi').screenshot({path:'screenshots/53-tavi-hair-and-collar-closeup.png'});


  // 0.35 original companion paper engineering — verify the genuine animated
  // world actor, all eight feathered wings and all seven parchment-eye faces.
  const realBird35=await terraceNear.locator('#morrowSprite').evaluate(bird=>{
    const errors=[],wing=[];
    const cut=bird.querySelector('#morrowOriginalCardBody35');
    const crown=bird.querySelector('#morrowFeatherCrown35');
    const breast=bird.querySelector('#morrowIllustratedBreast35');
    const tail=bird.querySelector('#morrowInkedTail35');
    const eyes=[...bird.querySelectorAll('.morrow-cut-face35')];
    const wingframes=[...bird.querySelectorAll('.morrow-wing-frame')];
    for(const el of [cut,crown,breast,tail]){
      const b=el?.getBBox();
      if(!b||b.width<30||b.height<18)errors.push('Collapsed companion body component');
    }
    if(eyes.length!==14||eyes.some(e=>e.getBBox().width<15||e.getBBox().height<24))
      errors.push('Morrow original expression face illustration missing');
    for(let frame=0;frame<4;frame++){
      const stage=wingframes.find(w=>w.dataset.wingFrame===String(frame));
      const panels=[...(stage?.querySelectorAll('.morrow-physical-wing-relief35')||[])];
      if(panels.length!==2)errors.push('Wing frame '+frame+' missing both original feather planes');
      for(const side of ['left','right']){
        const relief=panels.find(p=>p.dataset.featherSide===side);
        const bounds=relief?.getBBox();
        const touches=getComputedStyle(relief).pointerEvents;
        if(!bounds||bounds.width<20||bounds.height<18||touches!=='none')
          errors.push('Wing relief not physical/touch-transparent '+frame+'/'+side);
        wing.push({frame,side,w:bounds?.width,h:bounds?.height});
      }
    }
    return {errors,wing,body:cut?.getBBox().width,eyes:eyes.length,
      root:bird.closest('#morrow')?.getAttribute('transform')};
  });
  if(realBird35.errors.length||realBird35.wing.length!==8||
     realBird35.eyes!==14||!realBird35.root)
    throw Error('0.35 companion original paper anatomy regression: '+JSON.stringify(realBird35));
  console.log('0.35 ACTUAL Morrow cut-card illustration:',JSON.stringify(realBird35));
  await face33.screenshot({path:'screenshots/54-morrow-illustrated-north-terrace.png'});
  await face33.locator('#morrow').screenshot({
    path:'screenshots/55-morrow-illustrated-companion-closeup.png'});

  await face33.close();
  await terraceNear.emulateMedia({reducedMotion:'reduce'});

  await terraceNear.screenshot({path:'screenshots/46-tavi-proportion-audit.png'});

  await terraceNear.screenshot({path:'screenshots/45-terrace-constructed-roofs.png'});

  await terraceNear.screenshot({path:'screenshots/44-terrace-illustrated-botanicals.png'});

  await terraceNear.screenshot({path:'screenshots/43-terrace-archive-papercraft.png'});
  await terraceNear.screenshot({path:'screenshots/42-terrace-refined-hair-and-watercolor.png'});
  await terraceNear.screenshot({path:'screenshots/41-terrace-watercolor-characters-and-arch.png'});
  await terraceNear.screenshot({path:'screenshots/40-terrace-character-cardstock-contact.png'});
  await terraceNear.screenshot({path:'screenshots/39-terrace-engraving-and-shadow.png'});
  await terraceNear.screenshot({path:'screenshots/38-terrace-distinct-shopfronts.png'});
  if(await terraceNear.locator('#tavi').getAttribute('transform')!==savedPose)
    throw Error('0.23 shopfront rendering changed the game character position');
  const rectAfter=await terraceNear.locator('#terraceCraftedShopfronts').evaluate(el=>{const b=el.getBBox();return {x:b.x,width:b.width};});
  if(Math.abs(rectAfter.x-rectBefore.x)>.01||Math.abs(rectAfter.width-rectBefore.width)>.01)
    throw Error('0.23 painted architecture unexpectedly moved relative to collision world');
  await terraceNear.screenshot({path:'screenshots/37-terrace-illustrated-valley.png'});
  await terraceNear.screenshot({path:'screenshots/36-terrace-architectural-contact-light.png'});
  await terraceNear.screenshot({path:'screenshots/35-terrace-folded-step-construction.png'});
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
