const fs = require('node:fs');
const path = require('node:path');
const workspaces = require('../package.json').workspaces; // workspaces shoud list all packages
for (const workspace of workspaces) {
    const changelogPath = path.join(__dirname, '..', workspace, 'CHANGELOG.md');
    if (!fs.existsSync(changelogPath)) continue;
    let changelog = fs.readFileSync(changelogPath, 'utf8');
    changelog = changelog
        .replace(/^### Major Changes/gm, '### 💥 Breaking Changes')
        .replace(/^### Minor Changes/gm, '### ✨ Features')
        .replace(/^### Patch Changes/gm, '### 🐛 Issues/Bugs')
        // Remove empty sections
        .replace(/\n### ([^\n]+)\n\n###/g, '\n###');
    fs.writeFileSync(changelogPath, changelog);
}

// edditional here https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/scripts/release/format-changelog.js