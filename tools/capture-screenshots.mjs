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
  await page.screenshot({path:'screenshots/03-folio-village.png'});
  const before=await page.locator('#tavi').getAttribute('transform');
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(450);
  await page.keyboard.up('ArrowUp');
  const after=await page.locator('#tavi').getAttribute('transform');
  if(before===after || !(await page.locator('#tavi').getAttribute('class')).includes('dir-up')){
    throw Error('2.5D depth movement or back-facing artwork not active');
  }
  await page.screenshot({path:'screenshots/06-depth-exploration.png'});
  console.log('DEPTH TEST:',before,'->',after);

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

  const bridgePage=await openedAt({started:true,x:785,y:654,facing:1,metMorrow:true,mended:true,letter:false,won:false});
  if(await bridgePage.locator('#bridgeFix').getAttribute('class')!=='bridge-open')throw Error('Mended bridge not visible');
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

  const atelierPage=await openedAt({started:true,area:'atelier',x:720,y:711,facing:1,direction:'up',metMorrow:true,mended:false,threadSample:false,letter:false,won:false});
  if(await atelierPage.locator('#atelierScene').evaluate(e=>getComputedStyle(e).display)==='none')throw Error('Workshop not visible');
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
  await battlePage.close();

  if(errors.length)throw Error('Browser JS errors: '+errors.join(' | '));
  for(const file of ['01-title-screen.png','02-dialogue-opening.png','03-folio-village.png','04-repaired-bridge.png','05-foldline-combat.png','06-depth-exploration.png','07-threads-workshop.png','08-mila-courier-dialogue.png']){
    console.log('CAPTURED',file,statSync('screenshots/'+file).size,'bytes');
  }
} finally {
  await browser.close();
}
