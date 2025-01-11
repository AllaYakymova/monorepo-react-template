module.exports = {
    // header: [
    //     '',
    //     '# Changelog',
    //     'All notable changes to this project will be documented in this file.',
    //     ''
    // ].join('\n'),
    // "types": [
    //     { "type": "feat", "section": "Features" },
    //     { "type": "fix", "section": "Bug Fixes" },
    //     { "type": "chore", "section": "Chores" },
    //     { "type": "test", "section": "Tests", "hidden": true },
    //     { "type": "build", "section": "Build System", "hidden": true },
    //     { "type": "ci", "hidden": true }
    // ],
    writerOpts: {
        // Определение групп для типов коммитов
        groupBy: 'type', // Группировка коммитов по типу (feat, fix, etc.)
        commitGroupsSort: 'title', // Сортировка групп в CHANGELOG
        commitsSort: ['scope', 'subject'], // Сортировка коммитов внутри группы
        noteGroupsSort: 'title', // Сортировка заметок (breaking changes и т.д.)
        commitPartial: "- {{#if this.subject}}{{this.subject}}{{/if}}\n",
        // Шаблон для каждой записи коммита
        // commitPartial: `- {{#if this.scope}}**{{this.scope}}:** {{/if}}{{this.subject}}\n`,

        // Определение, как каждая группа будет названа
        groupTitleMap: {
            feat: '✨ Features', // Тип 'feat' будет назван 'Features'
            fix: '🐛 Bug Fixes', // Тип 'fix' будет назван 'Bug Fixes'
            chore: '🛠 Maintenance', // Тип 'chore' будет назван 'Maintenance'
            refactor: '🔧 Code Refactoring', // Тип 'refactor' будет назван 'Code Refactoring'
            perf: '⚡ Performance Improvements', // Тип 'perf' будет назван 'Performance Improvements'
            test: '🧪 Tests', // Тип 'test' будет назван 'Tests'
            docs: '📖 Documentation', // Тип 'docs' будет назван 'Documentation'
            style: '🎨 Styles', // Тип 'style' будет назван 'Styles'
            ci: '🔄 CI/CD', // Тип 'ci' будет назван 'CI/CD'
        },

        // Шаблон для групп в CHANGELOG.md
        groupByPartial: `### {{title}}\n\n{{commits}}\n`,

        // Переопределение заголовка версии
        // headerPartial: '',
    },
}
