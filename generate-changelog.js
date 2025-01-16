const fs = require('fs');
const gitLogParser = require('git-log-parser');
const Handlebars = require('handlebars');
const path = require('path');
const { Stream } = require('stream');

const templateSource = fs.readFileSync('changelog_template.hbs', 'utf8');
const template = Handlebars.compile(templateSource);

const commitTypes = ['fix', 'feat', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'];

const TypeMapper = {
    feat: 'Features',
    fix: 'Fixes',
    docs: 'Documentation',
    style: 'Styles',
    chore: 'Modify'
}


// Парсинг логов Git
const parser = gitLogParser.parse({
    path: '',
    format: '%H,%s,%b',
}, {});

function parseCommits(groupedCommits, packageName, packagePath) {

    // Чтение package.json для получения версии
    const packageJson = JSON.parse(fs.readFileSync(`${packagePath}/package.json`, 'utf8'));
    console.log(packageJson)
    const version = packageJson.version;

    if (groupedCommits[packageName]) {
        console.log(`Generating changelog for ${packageName}...`);
        const changelogData = {
            scope: packageName,
            version: version,
            groupedCommits: groupedCommits[packageName],
            releaseDate: new Date().toISOString().split('T')[0]
        };

        const changelogContent = template(changelogData);
        const changelogPath = path.join(packagePath, 'CHANGELOG.md');

        fs.mkdirSync(path.dirname(changelogPath), { recursive: true });
        fs.writeFileSync(changelogPath, changelogContent);
    } else {
        console.log(`No commits found for ${packageName}.`);
    }
}
const commits = [];
parser.on('data', commit => {
    commits.push(commit);
});
parser.on('end', () => {
    const groupedCommits = {};
    commits.forEach(commit => {
        const message = commit.message ?? commit.subject
        const match = message.match(/^(\w+)\(([^\)]+)\):/) // (/^(\w+)\((\w+)\):/);
        console.log({ commit, match })
        if (match) {
            const type = match[1];
            const scope = match[2];
            console.log({ match, type })
            if (!groupedCommits[scope]) {
                groupedCommits[scope] = {};
            }
            if (!groupedCommits[scope][TypeMapper[type]]) {
                groupedCommits[scope][TypeMapper[type]] = [];
            }

            if (commitTypes.includes(type)) {
                console.log("TYPE: ", { type })
                groupedCommits[scope][TypeMapper[type]].push({
                    subject: message.replace(/^(\w+)\(([^\)]+)\):/, ''),
                    body: commit.body,
                    hash: commit.commit.short,
                });
            } else {
                console.log(`Unknown commit type: ${type} in commit ${commit.hash}`);
            }
        }
    });
   
    const packagesDir = 'packages';
    const folders = fs.readdirSync(packagesDir)
    folders.push('')

    folders.forEach(packageName => {
        if (!packageName) {
            parseCommits(groupedCommits, 'root', '.')
        } else {
            const packagePath = path.join(packagesDir, packageName);
            parseCommits(groupedCommits, packageName, packagePath)
        }
    });
});

parser.on('error', error => {
    console.error('Ошибка при парсинге логов:', error);
});
