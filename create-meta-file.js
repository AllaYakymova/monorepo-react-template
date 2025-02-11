const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");


// Функция для безопасного выполнения команды
const safeExecSync = (command) => {
    try {
        return execSync(command).toString().trim();
    } catch (error) {
        return "unknown"; // Возвращаем "unknown", если команда не выполнена
    }
};

// Функция для парсинга изменённых пакетов и типов изменений
const parsePackagesFromChangeset = (changesetContent) => {
    const yamlPart = changesetContent.split("---")[1]; // Извлекаем содержимое между `---`
    if (!yamlPart) {
        return []; // Возвращаем пустой массив, если YAML не найден
    }

    return yamlPart
        .trim()
        .split("\n")
        .filter(line => line.includes(":")) // Учитываем только строки с `package: type`
        .map(line => {
            const [name, type] = line.replace(/"/g, "").split(":").map(s => s.trim());
            return { name, type };
        });
};


// Функция для извлечения номера issue из названия ветки
const extractIssueNumberFromBranch = () => {
    const branchName = process.env.GITHUB_HEAD_REF || safeExecSync("git rev-parse --abbrev-ref HEAD");

    const match = branchName.match(/issue-(\d+)/); // regex for searching "issue-<number>"
    const issue_number = match && match[1] // "unknown"; // return issue number or "unknown", if no match detected
    return [issue_number, issue_number ? `https://github.com/AllaYakymova/monorepo-react-template/issues/${issue_number}` : null]
};

const createMetaFile = () => {
    // Получаем имя changeset файла из аргументов командной строки
    const changesetName = process.argv[2];
    console.log("!!!!!!! ", process.argv)
    if (!changesetName) {
        console.error("Error: No changeset name provided.");
        process.exit(1);
    }

    const changesetFilePath = `.changeset/${changesetName}.md`;
    const metaFilePath = `.changeset/${changesetName}.meta.json`;
    const changesetContent = fs.readFileSync(changesetFilePath, "utf-8");

    console.log({ changesetContent })

    // Проверяем существование changeset файла
    if (!fs.existsSync(changesetFilePath)) {
        console.error(`Error: Changeset file "${changesetFilePath}" does not exist.`);
        process.exit(1);
    }

    const packages = parsePackagesFromChangeset(changesetContent)

    // Генерируем meta.json
    const metaData = {
        changeset: changesetName,
        date: new Date().toISOString(),
        pr_number: process.env.PR_NUMBER || "unknown",
        // commit: safeExecSync("git rev-parse HEAD"),
        issue_number: extractIssueNumberFromBranch()?.[0], // add issue number
        issue_ink: extractIssueNumberFromBranch()?.[1],
        description: changesetContent.split("\n\n")[1]?.trim() || "No description",
        packages
    };

    fs.writeFileSync(metaFilePath, JSON.stringify(metaData, null, 2));
    console.log(`Meta file created: ${metaFilePath}`);



    // const changesetDir = path.resolve(".changeset");
    // const files = fs.readdirSync(changesetDir).filter(file => file.endsWith(".md"));

    // files.forEach(file => {
    //     if (file.includes('README')) return;
    //     const changesetPath = path.join(changesetDir, file);
    //     const changesetContent = fs.readFileSync(changesetPath, "utf-8");
    //     console.log({ changesetContent })

    //     // Считываем измененные пакеты и тип изменений
    //     const packages = parsePackagesFromChangeset(changesetContent)

    //     // Получаем автора и коммит безопасно
    //     const meta = {
    //         changeset: path.basename(file, ".md"),
    //         // author: safeExecSync("git config user.name"),
    //         date: new Date().toISOString(),
    //         pr_number: process.env.PR_NUMBER || "unknown",
    //         // commit: safeExecSync("git rev-parse HEAD"),
    //         issue_number: extractIssueNumberFromBranch()?.[0], // add issue number
    //         issue_ink: extractIssueNumberFromBranch()?.[1],
    //         description: changesetContent.split("\n\n")[1]?.trim() || "No description",
    //         packages
    //     };

    //     // Записываем в JSON
    //     const metaFilePath = path.join(changesetDir, `${path.basename(file, ".md")}.meta.json`);
    //     fs.writeFileSync(metaFilePath, JSON.stringify(meta, null, 2));
    //     console.log(`Meta file created: ${metaFilePath}`);
    // });
};

createMetaFile();