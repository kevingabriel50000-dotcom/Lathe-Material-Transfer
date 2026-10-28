const {_electron:electron}=require('playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');

(async()=>{
 const dataDirectory=fs.mkdtempSync(path.join(os.tmpdir(),'lathe-desktop-'));
 let application;
 try{
  const launchArgs=[path.resolve(__dirname,'..','.stage')];
  if(process.platform==='linux')launchArgs.unshift('--no-sandbox');
  const launch=()=>electron.launch({args:launchArgs,env:{...process.env,LATHE_DATA_DIR:dataDirectory},timeout:30000});
  application=await launch();
  let page=await application.firstWindow();
  await page.waitForLoadState();
  assert.match(await page.title(),/v1.5/);
  assert.equal(await page.evaluate(()=>typeof require),'undefined');
  for(const[id,value]of Object.entries({stock:'2',allowance:'.05',grab:'-.85',end:'.2'}))await page.locator('#'+id).fill(value);
  assert.equal(await page.locator('#gripOut').textContent(),'0.8000″');
  assert.equal(await page.locator('#pullOut').textContent(),'1.0500″');
  assert.equal(await page.locator('#frontOut').textContent(),'3.0000″');
  await page.locator('#returnMode').selectOption('material');
  await page.locator('#cutZ').fill('-1');
  await page.clock.install();
  await page.getByRole('button',{name:'8. Return with material',exact:true}).click();
  await page.clock.runFor(2300);
  assert.equal(await page.locator('#subCutOut').textContent(),'1.0820″');
  const saved=JSON.parse(await page.evaluate(()=>localStorage.getItem('lathe-transfer-v1.1')));
  await page.locator('#reset').click();
  await page.locator('#load').setInputFiles({name:'case.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
  await page.waitForFunction(()=>document.getElementById('stock').value==='2');
  assert.equal(await page.locator('#frontOut').textContent(),'3.0000″');
  const downloadPath=path.join(dataDirectory,'export.json');
  await application.evaluate(({session},target)=>{session.defaultSession.once('will-download',(_event,item)=>item.setSavePath(target));},downloadPath);
  await page.locator('#save').click();
  for(let attempt=0;attempt<100&&!fs.existsSync(downloadPath);attempt++)await new Promise(resolve=>setTimeout(resolve,50));
  assert.equal(JSON.parse(fs.readFileSync(downloadPath,'utf8')).parameters.stock,2);
  await application.close();application=null;
  application=await launch();page=await application.firstWindow();await page.waitForLoadState();
  assert.equal(await page.locator('#stock').inputValue(),'2');
  assert.equal(await page.locator('#frontOut').textContent(),'3.0000″');
  console.log('Desktop smoke passed: isolated renderer, transfer, cut-off distance, JSON import/export and persisted data.');
 }finally{if(application)await application.close();fs.rmSync(dataDirectory,{recursive:true,force:true,maxRetries:5,retryDelay:200});}
})().catch(error=>{console.error(error);process.exit(1);});
