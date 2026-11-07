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

  await page.evaluate(()=>{
    const save={
      started:true,x:785,y:654,facing:1,
      metMorrow:true,mended:true,letter:false,won:false
    };
    localStorage.setItem('foldfarer.firstfold.0.1',JSON.stringify(save));
  });
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#start').click();
  await page.locator('#intro').waitFor({state:'hidden'});
  await page.screenshot({path:'screenshots/04-repaired-bridge.png'});

  await page.evaluate(()=>{
    const save={
      started:true,x:1240,y:654,facing:1,
      metMorrow:true,mended:true,letter:true,won:false
    };
    localStorage.setItem('foldfarer.firstfold.0.1',JSON.stringify(save));
  });
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#start').click();
  console.log('STATE BEFORE BATTLE:',JSON.stringify(await page.evaluate(()=>({
    save:localStorage.getItem('foldfarer.firstfold.0.1'),
    prompt:document.querySelector('#promptText').textContent,
    dialogueHidden:document.querySelector('#dialogue').classList.contains('hidden')
  }))));
  await page.locator('#interact').click();
  console.log('STATE AFTER BATTLE CLICK:',JSON.stringify(await page.evaluate(()=>({
    prompt:document.querySelector('#promptText').textContent,
    dialogueHidden:document.querySelector('#dialogue').classList.contains('hidden'),
    dialogue:document.querySelector('#line').textContent,
    battleHidden:document.querySelector('#battle').classList.contains('hidden')
  }))));
  await page.screenshot({path:'screenshots/05-foldline-combat.png'});

  if(errors.length)throw Error('Browser JS errors: '+errors.join(' | '));
  for(const file of ['01-title-screen.png','02-dialogue-opening.png','03-folio-village.png','04-repaired-bridge.png','05-foldline-combat.png']){
    console.log('CAPTURED',file,statSync('screenshots/'+file).size,'bytes');
  }
} finally {
  await browser.close();
}
