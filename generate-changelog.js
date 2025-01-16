const fs = require('fs');
const gitLogParser = require('git-log-parser');
const Handlebars = require('handlebars');
const path = require('path');

// Настройка шаблона
const templateSource = fs.readFileSync('changelog_template.hbs', 'utf8');
const template = Handlebars.compile(templateSource);

// Парсинг логов Git
const parser = gitLogParser();

parser.on('commit', commit => {
    // Группировка коммитов по scope
    const groupedCommits = groupedCommits || {};
    const match = commit.message.match(/^(\w+)\((\w+)\):/);
    if (match) {
        const type = match[1];
        const scope = match[2];
        if (!groupedCommits[scope]) {
            groupedCommits[scope] = {};
        }
        if (!groupedCommits[scope][type]) {
            groupedCommits[scope][type] = [];
        }
        groupedCommits[scope][type].push({
            subject: commit.message.replace(/^(\w+)\(\w+\): /, ''),
            hash: commit.hash,
        });
    }
});

parser.on('end', () => {
    // Генерация changelog для каждого scope
    const packagesDir = 'packages';
    fs.readdirSync(packagesDir).forEach(packageName => {
        const packagePath = path.join(packagesDir, packageName);
        if (fs.statSync(packagePath).isDirectory()) {
            if (groupedCommits[packageName]) {
                console.log(`Generating changelog for ${packageName}...`);
                const changelogData = {
                    scope: packageName,
                    groupedCommits: groupedCommits[packageName],
                };

                const changelogContent = template(changelogData);
                const changelogPath = path.join(packagePath, 'CHANGELOG.md');
                fs.mkdirSync(path.dirname(changelogPath), { recursive: true });
                fs.writeFileSync(changelogPath, changelogContent);
            } else {
                console.log(`No commits found for ${packageName}.`);
            }
        }
    });
});

parser.on('error', error => {
    console.error('Ошибка при парсинге логов:', error);
});

parser.parse({
    path: '.',
    format: '%H,%s,%b',
});
