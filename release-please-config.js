module.exports = {
  repoUrl: "https://github.com/AllaYakymova/monorepo-react-template",
  packages: {
    // Пример пакета package-1
    'packages/front-end': {
      // Путь к changelog для пакета
      changelogPath: 'packages/front-end/CHANGELOG.md',
      // Тип релиза для этого пакета
      releaseType: 'node', // или другой тип (например, 'python', 'java')
      // versioning: {
      //   strategy: 'semver', // Стратегия версионирования (semantic versioning)
      //   initialVersion: '0.0.1', // Начальная версия, если пакету требуется
      // },
    },

    // Пример второго пакета package-2
    'packages/plugin-1': {
      changelogPath: 'packages/plugin-1/CHANGELOG.md',
      releaseType: 'node', // Настройка для другого пакета
      // versioning: {
      //   strategy: 'semver', // Стратегия версионирования (semantic versioning)
      //   initialVersion: '1.0.0', // Начальная версия, если пакету требуется
      // },
    },
    // Можете добавлять другие пакеты в том же формате
  },

  // Для корневого changelog
  changelogPath: 'CHANGELOG.md',
  // Опционально: можете указать шаблон для генерации версий
  // versioning: {
  // Настройте вашу стратегию версионирования (например, major, minor, patch)
  // strategy: 'semver', // или можно использовать другой подход
  // initialVersion: '0.1.1',
  // },
  plugins: [
    {
      type: "node-workspace"
    }
  ]
};