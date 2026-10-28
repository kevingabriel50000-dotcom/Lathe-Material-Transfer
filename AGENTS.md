# User preferences

Do not add code comments or explanatory text, tutorials, tooltips, or calculation explanations inside the application unless the user explicitly requests them. Keep functional labels, values, and necessary validation errors. Answer requested explanations in the conversation.

The user approved v1.5 as the current base program and explicitly retained the previous v1.3 base. The user explicitly authorized replacing the v1.5 base with the Model front reset correction and relocated bar-diameter field. Preserve v1.3 unchanged; preserve the updated v1.5 base unless the user explicitly requests replacing it again. The current development version is v1.5, named by the user. Keep it at v1.5 until the user explicitly authorizes another version change. Do not create additional version tags or releases without their instruction.

Project layout: `web/` contains the shared application. The root `index.html` only redirects the existing web address. `windows/` contains desktop packaging; `.stage/`, `node_modules/`, `dist/` and `data/` there are generated/local files. Edit the shared UI in `web/`, not a staged desktop copy. Windows packaging must not change approved version tags.
