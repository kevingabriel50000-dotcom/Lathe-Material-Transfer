const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const source=html.split('<script>')[1].split('const $=')[0];const ctx={};vm.createContext(ctx);vm.runInContext(source,ctx);
const base={mode:'fusion',reference:'stock',stock:2,allowance:.025,grab:-1,end:.0001,grip:1,target:3,epsilon:.0001};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
let r=ctx.calculate(base);near(r.grip,.975);near(r.pull,1.0001);near(r.front,2.9751);near(r.O,2);
r=ctx.calculate({...base,mode:'physical'});near(r.grab,-1.025);near(r.front,3.0001);near(r.grip,1);
r=ctx.calculate({...base,mode:'physical',epsilon:0});near(r.front,3);near(r.end,0);
r=ctx.calculate({...base,mode:'physical',reference:'model'});near(r.O,1.975);near(r.grab,-1);near(r.end,.025);near(r.front,3);
r=ctx.calculate({...base,allowance:0});near(r.grip,1);near(r.front,3.0001);
assert.throws(()=>ctx.calculate({...base,grab:.5}));assert.throws(()=>ctx.calculate({...base,allowance:3}));assert.throws(()=>ctx.calculate({...base,end:-2}));assert.throws(()=>ctx.calculate({...base,stock:NaN}));
console.log('9 calculation and validation scenarios passed.');
// Synthetic machine geometry; not a manufacturer specification.
const machine={...base,chuckDistance:20,mainJaw:1.5,subJaw:1};
const g=ctx.geometry(machine);near(g.home,17.5);
assert.equal(ctx.geometry({...machine,end:5}).scale,g.scale);
ctx.validateEnvelope(machine,ctx.calculate(machine),g);
assert.throws(()=>ctx.geometry({...machine,chuckDistance:0}));
assert.throws(()=>ctx.geometry({...machine,mainJaw:-1}));
assert.throws(()=>ctx.validateEnvelope(machine,ctx.calculate({...machine,grab:-1.5}),g));
assert.throws(()=>ctx.validateEnvelope(machine,ctx.calculate({...machine,end:30}),g));
for(const reference of ['stock','model']){
 const v={...machine,reference,mode:'physical',target:3,grip:1,epsilon:0};
 const physical=ctx.calculate(v),planes=ctx.calculate({...v,mode:'fusion',grab:physical.grab,end:physical.end});
 near(planes.grip,1);near(planes.front,3);near(planes.O,physical.O);
}
console.log('Geometry, fixed scale, envelope and bidirectional calculation checks passed.');
