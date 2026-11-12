// Genuine Chromium device emulation, not a claim of physical iPhone Safari QA.
// Run with a local static server at 127.0.0.1:8000; never mutate actual saves.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {chromium} from 'playwright';

const URL='http://127.0.0.1:8000/';
const SAVE='foldfarer.firstfold.0.1';
mkdirSync('qa-artifacts',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const sizes=[[667,375],[844,390],[932,430]];
const point=box=>({x:Math.round(box.x+box.width/2),y:Math.round(box.y+box.height/2)});
const messages=[];
try{
 for(const [width,height] of sizes){
  const context=await browser.newContext({
   viewport:{width,height},screen:{width,height},deviceScaleFactor:2,
   isMobile:true,hasTouch:true,reducedMotion:'reduce',
   serviceWorkers:'allow'
  });
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(URL,{waitUntil:'networkidle'});
  await page.evaluate(key=>localStorage.setItem(key,JSON.stringify({
   started:true,x:355,y:654,facing:1,direction:'down',area:'folio',
   threadSample:false,metMorrow:true,mended:false,letter:false,won:false
  })),SAVE);
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#start').click();
  assert.equal(await page.locator('#intro').isVisible(),false,'Intro did not close');
  const keys=['[data-move="left"]','[data-move="right"]',
              '[data-move="up"]','[data-move="down"]','#interact'];
  for(const selector of keys){
   const b=await page.locator(selector).boundingBox();
   assert(b&&b.width>=30&&b.height>=30,'Tiny/hidden touch control: '+selector);
   assert(b.x>=0&&b.y>=0&&b.x+b.width<=width+1&&b.y+b.height<=height+1,
    'Control clipped '+selector+' at '+width+'x'+height+': '+JSON.stringify(b));
  }
  const right=point(await page.locator('[data-move="right"]').boundingBox());
  const act=point(await page.locator('#interact').boundingBox());
  assert(act.x-right.x>80,'ACT encroaches on the left-thumb movement rail');
  const before=await page.locator('#tavi').getAttribute('transform');
  // Chromium's real touch-dispatch pipeline, not a fake click or keypress.
  const dev=await context.newCDPSession(page);
  const emit=(type,contacts)=>dev.send('Input.dispatchTouchEvent',{
   type,touchPoints:contacts.map(({id,x,y})=>({id,x,y,radiusX:4,radiusY:4,force:1}))
  });
  await emit('touchStart',[{id:1,...right}]);
  await page.waitForTimeout(230);
  const after=await page.locator('#tavi').getAttribute('transform');
  assert.notEqual(after,before,'Held right thumb did not move Tavi');
  assert(await page.locator('[data-move="right"]').evaluate(e=>e.classList.contains('active')),
   'Held movement finger has no active state');
  await emit('touchStart',[{id:1,...right},{id:2,...act}]);
  await page.waitForTimeout(60);
  await emit('touchEnd',[{id:1,...right}]);
  await page.locator('#dialogue').waitFor({state:'visible',timeout:5000});
  assert.equal(await page.locator('[data-move="right"]').evaluate(e=>e.classList.contains('active')),false,
   'Dialogue failed to release previously held movement');
  await emit('touchEnd',[]);
  const frozen=await page.locator('#tavi').getAttribute('transform');
  await page.waitForTimeout(120);
  assert.equal(await page.locator('#tavi').getAttribute('transform'),frozen,
   'Character drifted after ACT opened dialogue');
  for(let i=0;i<8&&await page.locator('#dialogue').isVisible();i++)await page.locator('#nextLine').click();
  assert.equal(await page.locator('#dialogue').isVisible(),false,'Dialogue did not close');
  await page.screenshot({path:'qa-artifacts/mobile-'+width+'x'+height+'.png'});
  // Close/reload and corrupt primary: the shadow checkpoint must preserve the
  // same story flags and coordinates without changing old save key or schema.
  await page.evaluate(key=>localStorage.setItem(key,'{damaged'),SAVE);
  await page.reload({waitUntil:'networkidle'});
  await page.locator('#start').click();
  const recovered=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE);
  assert(recovered.metMorrow===true&&recovered.area==='folio',
   'Browser reload failed to recover the original story checkpoint');
  // A real service worker must control this page before asserting offline mode.
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker?.controller),null,{timeout:12000});
  await context.setOffline(true);
  await page.reload({waitUntil:'domcontentloaded',timeout:16000});
  assert(await page.locator('#world').count()===1,'Offline reload lost the game scene');
  assert((await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE)).metMorrow,
   'Offline reload lost saved companion progress');
  await page.screenshot({path:'qa-artifacts/offline-'+width+'x'+height+'.png'});
  assert.equal(errors.length,0,'Chromium runtime errors: '+errors.join('; '));
  messages.push(width+'x'+height+': two-thumb movement+ACT, release, checkpoint recovery and offline reload PASS');
  await context.close();
 }
 console.log('FOLDFARER MOBILE QA:\n'+messages.join('\n'));
}finally{
 await browser.close();
}
