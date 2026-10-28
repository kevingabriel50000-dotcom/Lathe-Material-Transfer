const {app,BrowserWindow,dialog}=require('electron');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');

const dataDirectory=process.env.LATHE_DATA_DIR||path.join(app.isPackaged?path.dirname(app.getPath('exe')):path.resolve(__dirname,'..'),'data');
try{fs.mkdirSync(dataDirectory,{recursive:true});app.setPath('userData',dataDirectory);}catch(error){dialog.showErrorBox('Lathe Material Transfer','Cannot write application data. Move the portable folder to a writable location.');app.exit(1);}

let window;
if(!app.requestSingleInstanceLock()){app.quit();}else{
 app.on('second-instance',()=>{if(window){if(window.isMinimized())window.restore();window.show();window.focus();}});
 app.whenReady().then(()=>{
  window=new BrowserWindow({width:1440,height:960,minWidth:820,minHeight:600,show:false,autoHideMenuBar:true,backgroundColor:'#0c1320',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
  window.setMenu(null);
  const htmlPath=path.join(__dirname,'web','index.html'),applicationURL=pathToFileURL(htmlPath).href;
  window.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  window.webContents.on('will-navigate',(event,url)=>{if(url!==applicationURL)event.preventDefault();});
  window.webContents.on('will-attach-webview',event=>event.preventDefault());
  window.webContents.session.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
  window.webContents.session.setPermissionCheckHandler(()=>false);
  window.webContents.session.on('will-download',(_event,item)=>{item.setSaveDialogOptions({defaultPath:path.join(app.getPath('documents'),path.basename(item.getFilename())),filters:[{name:'JSON case',extensions:['json']}],properties:['showOverwriteConfirmation']});});
  window.once('ready-to-show',()=>window.show());
  window.on('closed',()=>{window=null;});
  window.loadFile(htmlPath).catch(error=>{dialog.showErrorBox('Lathe Material Transfer',error.message);app.quit();});
 }).catch(error=>{dialog.showErrorBox('Lathe Material Transfer',error.message);app.exit(1);});
 app.on('window-all-closed',()=>app.quit());
}
