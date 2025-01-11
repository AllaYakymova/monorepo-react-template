module.exports = {
    header: [
        '',
        '# Changelog',
        'All notable changes to this project will be documented in this file.',
        ''
    ].join('\n'),
    "types": [
        { "type": "feat", "section": "Features" },
        { "type": "fix", "section": "Bug Fixes" },
        { "type": "chore", "section": "Chores" },
        { "type": "test", "section": "Tests", "hidden": true },
        { "type": "build", "section": "Build System", "hidden": true },
        { "type": "ci", "hidden": true }
    ],
        "writerOpts": {
        "commitPartial": "- {{#if this.subject}}{{this.subject}}{{/if}}\n"
    }
}
