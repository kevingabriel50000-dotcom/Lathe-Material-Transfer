# Windows 11 portable packaging

This wrapper uses `../web/` directly as its source. There is no second copy to edit. Electron provides the application's own desktop window and the browser runtime, so the extracted program works offline without Node.js or a web server on the user's computer.

## Download a Windows build

Open the repository's **Actions → Windows portable**, select a successful run and download the **Lathe-Material-Transfer-v1.5-Windows-x64** artifact. Extract the downloaded archive and the application ZIP inside it. Keep all extracted application files together and run **Lathe Material Transfer.exe**.

The workflow runs an Electron smoke test on Windows before packaging. Artifacts expire after 90 days; run the workflow again from Actions when necessary. This does not create or change release tags.

## Build on Windows

Install Node.js 24, open a terminal in `windows/`, then run:

```powershell
npm ci
npm test
npm run package
```

The ZIP is written to `dist/Lathe-Material-Transfer-v1.5-Windows-x64.zip`. The extracted application folder contains the executable, Electron runtime files and the packaged web application. `npm start` opens a development window.

## Data and updates

On the first packaged launch, a `data/` folder is created beside the executable. Keep the application in a writable folder and preserve `data/` when replacing application files. Move the whole folder to carry its remembered inputs with it. Browser data is separate; use **Save case** and **Open saved case** to transfer JSON cases between web and desktop.

The desktop version does not update itself. Future changes to `web/` can be packaged again. Existing v1.3 and v1.5 bases stay available in GitHub.

The ZIP is for Windows x64. The executable is unsigned; Windows may show an unknown-publisher or SmartScreen prompt. Packaging on Linux is possible, but a successful Linux build alone does not verify Windows execution.
