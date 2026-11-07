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
  await page.screenshot({path:'screenshots/02-dialogue-opening.png'});
  for(let i=0;i<4;i++)await page.locator('#nextLine').click();
  await page.locator('#dialogue').waitFor({state:'hidden'});
  await page.screenshot({path:'screenshots/03-folio-village.png'});

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

  const battlePage=await openedAt({started:true,x:1240,y:654,facing:1,metMorrow:true,mended:true,letter:true,won:false});
  console.log('STATE BEFORE BATTLE:',JSON.stringify(await battlePage.evaluate(()=>({
    save:localStorage.getItem('foldfarer.firstfold.0.1'),
    prompt:document.querySelector('#promptText').textContent,
    dialogueHidden:document.querySelector('#dialogue').classList.contains('hidden')
  }))));
  await battlePage.locator('#interact').click();
  await battlePage.locator('#battle').waitFor({state:'visible',timeout:5000});
  console.log('BATTLE SHOWN: Paper Scrapper, actual game UI');
  await battlePage.screenshot({path:'screenshots/05-foldline-combat.png'});
  await battlePage.close();

  if(errors.length)throw Error('Browser JS errors: '+errors.join(' | '));
  for(const file of ['01-title-screen.png','02-dialogue-opening.png','03-folio-village.png','04-repaired-bridge.png','05-foldline-combat.png']){
    console.log('CAPTURED',file,statSync('screenshots/'+file).size,'bytes');
  }
} finally {
  await browser.close();
}
