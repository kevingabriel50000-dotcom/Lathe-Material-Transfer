const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../web/index.html'),'utf8');
const source=html.split('<script>')[1].split('const $=')[0];const ctx={};vm.createContext(ctx);vm.runInContext(source,ctx);
const base={mode:'fusion',reference:'stock',stock:2,allowance:.025,grab:-1,end:.0001,grip:1,target:3,epsilon:.0001};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
let r=ctx.calculate(base);near(r.grip,.975);near(r.pull,1.0001);near(r.front,2.9751);near(r.O,2);
r=ctx.calculate({...base,mode:'physical'});near(r.grab,-1.025);near(r.front,3);near(r.end,0);near(r.grip,1);
r=ctx.calculate({...base,mode:'physical',epsilon:0});near(r.front,3);near(r.end,0);
r=ctx.calculate({...base,mode:'physical',reference:'model'});near(r.O,1.975);near(r.grab,-1);near(r.end,.025);near(r.front,3);
r=ctx.calculate({...base,allowance:0});near(r.grip,1);near(r.front,3.0001);
assert.throws(()=>ctx.calculate({...base,grab:.5}));assert.throws(()=>ctx.calculate({...base,allowance:3}));assert.throws(()=>ctx.calculate({...base,end:-2}));assert.throws(()=>ctx.calculate({...base,stock:NaN}));
console.log('9 calculation and validation scenarios passed.');
const machine={...base,chuckDistance:20,mainJaw:1.5,subJaw:1};
const g=ctx.geometry(machine);near(g.home,17.5);
assert.equal(ctx.geometry({...machine,end:5}).scale,g.scale);
ctx.validateEnvelope(machine,ctx.calculate(machine),g);
assert.throws(()=>ctx.geometry({...machine,chuckDistance:0}));
assert.throws(()=>ctx.geometry({...machine,mainJaw:-1}));
ctx.validateEnvelope(machine,ctx.calculate({...machine,grab:-1.5}),g);
const deep={...machine,stock:10,grab:-5.525,end:-5};
ctx.validateEnvelope(deep,ctx.calculate(deep),ctx.geometry(deep));
assert.throws(()=>ctx.validateEnvelope({...deep,grab:-5.526},ctx.calculate({...deep,grab:-5.526}),ctx.geometry(deep)));
assert.throws(()=>ctx.validateEnvelope(machine,ctx.calculate({...machine,end:30}),g));
for(const reference of ['stock','model']){
 const v={...machine,reference,mode:'physical',target:3,grip:1,epsilon:0};
 const physical=ctx.calculate(v),planes=ctx.calculate({...v,mode:'fusion',grab:physical.grab,end:physical.end});
 near(planes.grip,1);near(planes.front,3);near(planes.O,physical.O);
}
console.log('Geometry, fixed scale, envelope and bidirectional calculation checks passed.');

const cutInput={...machine,returnMode:'material',cutZ:0,diameter:1,toolWidth:.118,toolRadius:.011,toolLength:.4,end:.5};
const cutResult=ctx.calculate(cutInput),cut=ctx.cutGeometry(cutInput,cutResult);
near(cut.left,2);near(cut.right,2.118);near(cut.clearance,.382);near(cut.partLength,1.357);
assert.throws(()=>ctx.cutGeometry({...cutInput,end:0},ctx.calculate({...cutInput,end:0})));
assert.throws(()=>ctx.cutGeometry({...cutInput,cutZ:-2},cutResult));
assert.throws(()=>ctx.cutGeometry({...cutInput,cutZ:5},cutResult));
assert.throws(()=>ctx.cutGeometry({...cutInput,toolWidth:.02},cutResult));
assert.throws(()=>ctx.cutGeometry({...cutInput,diameter:0},cutResult));
console.log('Cut-off kerf, part length, insert-to-jaw clearance and validation checks passed.');
