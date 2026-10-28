const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:1500,height:1100}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.APP_URL||'http://127.0.0.1:8765');
  for(const[id,value]of Object.entries({stock:'2',allowance:'.025',grab:'-1',end:'.5'}))await page.locator('#'+id).fill(value);
  await page.locator('#returnMode').selectOption('material');
  assert.equal(await page.locator('#cutPlane').count(),0);
  await page.locator('#view').scrollIntoViewIfNeeded();
  const box=await page.locator('#view').boundingBox(),point={x:Math.floor(box.x+box.width*.55),y:Math.floor(box.y+box.height*.55)};
  const worldPoint=()=>page.evaluate(p=>{const q=new DOMPoint(p.x,p.y).matrixTransform(document.getElementById('scene').getScreenCTM().inverse());return{x:q.x,y:q.y};},point);
  const before=await worldPoint();await page.mouse.move(point.x,point.y);await page.mouse.wheel(0,-250);await page.waitForFunction(()=>Number(document.getElementById('zoom').value)>1);
  const after=await worldPoint();assert.ok(Math.abs(after.x-before.x)<.001);assert.ok(Math.abs(after.y-before.y)<.001);
  assert.equal(await page.locator('#g54Plane').getAttribute('vector-effect'),'non-scaling-stroke');assert.ok(Number(await page.locator('#g54Plane').getAttribute('stroke-width'))<.65);
  await page.locator('#zoom').fill('3');const sliderPoint=await worldPoint();assert.ok(Math.abs(sliderPoint.x-before.x)<.001);assert.ok(Math.abs(sliderPoint.y-before.y)<.001);
  await page.clock.install();
  await page.getByRole('button',{name:'6. Cut-off',exact:true}).click();await page.clock.runFor(400);
  const traceLength=()=>page.locator('#cutPlane').evaluate(l=>Number(l.getAttribute('y2'))-Number(l.getAttribute('y1')));
  const length=await traceLength();assert.ok(length>0);await page.clock.runFor(600);assert.ok(await traceLength()>length);
  await page.clock.runFor(1000);await page.getByRole('button',{name:'7. Tool retracts',exact:true}).click();assert.equal(await page.locator('#cutPlane').count(),0);await page.clock.runFor(1000);
  await page.getByRole('button',{name:'8. Return with material',exact:true}).click();await page.clock.runFor(2300);
  assert.equal(await page.locator('#returnDistances').isVisible(),true);assert.equal(await page.locator('#returnResults tr').count(),1);assert.match(await page.locator('#returnResults').textContent(),/0.3820/);
  assert.match(await page.locator('#view').textContent(),/Model face · 1.9750/);
  const offset=()=>page.locator('#modelPlane').evaluate(l=>(Number(l.getAttribute('x1'))-Number(document.getElementById('g54Plane').getAttribute('x1'))));
  const oldOffset=await offset();assert.ok(oldOffset<0);
  await page.locator('#cutZ').fill('.1');await page.locator('#chuckDistance').fill('700');await page.getByRole('button',{name:'8. Return with material',exact:true}).click();await page.clock.runFor(2300);
  assert.match(await page.locator('#returnResults').textContent(),/0.2820/);assert.match(await page.locator('#view').textContent(),/Model face · 1.9750/);assert.equal(await page.locator('#subCutOut').textContent(),'0.2820″');const ends=await page.locator('#subPartDimension').evaluate(p=>({face:Number(p.dataset.face),jaw:Number(p.dataset.jaw)}));assert.ok(Math.abs(ends.jaw-ends.face-.282)<1e-9);assert.ok(Math.abs(Number(await page.locator('[data-part="piece"]').getAttribute('x'))-Number(await page.locator('#subPartCutPlane').getAttribute('x1')))<1e-9);
  await page.locator('#resetTrajectory').click();assert.equal(await page.locator('#state').textContent(),'Before grab');assert.equal(await page.locator('#progress').inputValue(),'0');assert.equal(await page.locator('#returnDistances').isVisible(),false);assert.equal(await page.locator('#cutPlane').count(),0);assert.equal(await page.locator('#zoom').inputValue(),'3');assert.equal(await page.locator('#stock').inputValue(),'2');
  for(const[id,value]of Object.entries({stock:'2',allowance:'.05',grab:'-.85',end:'.2',cutZ:'-1'}))await page.locator('#'+id).fill(value);
await page.getByRole('button',{name:'4. Pull',exact:true}).click();await page.clock.runFor(3400);assert.match(await page.locator('#view').textContent(),/Model face · 1.9500/);
await page.getByRole('button',{name:'8. Return with material',exact:true}).click();await page.clock.runFor(2300);assert.match(await page.locator('#view').textContent(),/Model face · 1.9500/);
const referenceOffset=await offset();assert.ok(Math.abs(referenceOffset+.05*800/(700/25.4+2))<1e-8);
assert.deepEqual(errors,[]);console.log('View checks passed: cursor-anchored zoom, thin strokes, cutting trace, next model face, jaw-to-part distance and timeline reset.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
