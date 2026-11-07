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
  const gait=await page.locator('#tavi .tavi-foot.foot-left').first().evaluate(el=>getComputedStyle(el).animationName);
  if(!gait.includes('farerFootForward'))throw Error('Actual foot artwork did not articulate: '+gait);
  await page.screenshot({path:'screenshots/14-botanical-walk-cycle.png',animations:'allow'});
  console.log('BOTANICALS:',trees,'trees,',families,'families. GAIT:',gait);
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
  await mobilePage.screenshot({path:'screenshots/15-mobile-landscape-emulation.png'});
  await mobilePage.close();

  // Render both diagonal costumes from unobstructed locations. The main scene
  // has correctly depth-sorted notice boards; those should not conceal the
  // character in the art reference capture.
  const quarterBackPage=await openedAt({started:true,area:'folio',x:615,y:711,facing:1,direction:'down',metMorrow:true,mended:false,letter:false,won:false});
  await quarterBackPage.keyboard.down('ArrowUp');
  await quarterBackPage.keyboard.down('ArrowRight');
  await quarterBackPage.waitForTimeout(380);
  const backClass=await quarterBackPage.locator('#tavi').getAttribute('class');
  if(!backClass?.includes('dir-diag-up'))throw Error('Back 3/4 art is not active: '+backClass);
  const backPos=await quarterBackPage.locator('#tavi').getAttribute('transform');
  console.log('THREE QUARTER BACK:',backPos);
  await quarterBackPage.screenshot({path:'screenshots/09-tavi-three-quarter.png'});
  await quarterBackPage.keyboard.up('ArrowUp');
  await quarterBackPage.keyboard.up('ArrowRight');
  await quarterBackPage.close();

  const quarterFrontPage=await openedAt({started:true,area:'folio',x:607,y:594,facing:1,direction:'down',metMorrow:true,mended:false,letter:false,won:false});
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

  const tornPage=await openedAt({started:true,x:625,y:698,facing:1,direction:'down',metMorrow:true,mended:false,letter:false,won:false});
  if(await tornPage.locator('#bridgeFix').getAttribute('class')!=='bridge-closed')throw Error('Unmended physical bridge should be folded away');
  await tornPage.screenshot({path:'screenshots/12-paper-bridge-torn.png'});
  await tornPage.close();

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
  const followerPos=await followerPage.locator('#morrow').getAttribute('transform');
  console.log('MORROW FOLLOWS TAVI:',followerPos);
  await followerPage.screenshot({path:'screenshots/11-morrow-follows.png'});
  await followerPage.close();


  // North Terrace: actual browser-rendered second outdoor RPG walk plane.
  // The stage is playable at both far and near depths, not a panoramic mockup.
  const terraceNear=await openedAt({started:true,area:'terrace',x:720,y:702,facing:1,direction:'up',metMorrow:true,mended:false,threadSample:false,letter:false,won:false});
  if(await terraceNear.locator('#terraceScene').evaluate(e=>getComputedStyle(e).display)==='none')throw Error('North Terrace is hidden after loading its save');
  if(await terraceNear.locator('#folioScene').evaluate(e=>getComputedStyle(e).display)!=='none')throw Error('Folio should hide while terrace loads');
  if(await terraceNear.locator('#tavi').evaluate(e=>e.parentNode?.id)!=='terraceDepthStage')throw Error('Tavi is not in a real depth-sorted terrace scene');
  if(await terraceNear.locator('#morrow').evaluate(e=>e.parentNode?.id)!=='terraceDepthStage')throw Error('Morrow did not accompany Tavi into terrace');
  const depthBox=await terraceNear.locator('#terraceGround').evaluate(e=>{const b=e.getBBox();return {width:b.width,height:b.height}});
  if(depthBox.height<350||depthBox.width<1100)throw Error('Terrace does not span a substantial rendered walk plane '+JSON.stringify(depthBox));
  await terraceNear.screenshot({path:'screenshots/17-north-terrace-near.png'});
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
  if(!farActor?.includes('scale(-0.'))throw Error('Far terrace hero is not smaller and perspective-scaled: '+farActor);
  const zOrder=await terraceFar.locator('#terraceDepthStage').evaluate(stage=>[...stage.children].map(child=>child.id));
  if(zOrder.indexOf('tavi')>=zOrder.indexOf('terraceBell'))throw Error('Terrace near-side bell cannot occlude a hero walking far behind it');
  await terraceFar.screenshot({path:'screenshots/18-north-terrace-distant.png'});
  await terraceFar.close();

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
  for(const file of ['01-title-screen.png','02-dialogue-opening.png','03-folio-village.png','04-repaired-bridge.png','05-foldline-combat.png','06-depth-exploration.png','07-threads-workshop.png','08-mila-courier-dialogue.png','09-tavi-three-quarter.png','10-tavi-front-three-quarter.png','11-morrow-follows.png','12-paper-bridge-torn.png','13-foldline-strike-animation.png','14-botanical-walk-cycle.png','15-mobile-landscape-emulation.png','16-dimensional-folio-buildings.png','17-north-terrace-near.png','18-north-terrace-distant.png','19-north-terrace-mobile.png']){
    console.log('CAPTURED',file,statSync('screenshots/'+file).size,'bytes');
  }
} finally {
  await browser.close();
}
