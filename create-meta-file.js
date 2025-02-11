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
    const branchName = safeExecSync("git rev-parse --abbrev-ref HEAD");
    console.log({ branchName })
    const match = branchName.match(/issue-(\d+)/); // regex for searching "issue-<number>"
    const issue_number = match && match[1] // "unknown"; // return issue number or "unknown", if no match detected
    return [issue_number, issue_number ? `https://github.com/AllaYakymova/monorepo-react-template/issues/${issue_number}` : null]
};

// Функция для извлечения номера PR из коммитов
const extractPRNumberFromCommits = () => {
    const logMessage = safeExecSync("git log -1 --pretty=%B"); // Получаем последнее сообщение коммита
    const match = logMessage.match(/\(#(\d+)\)/); // Регулярное выражение для поиска "(#<PR_number>)"
    console.log('logMessage ', { logMessage, match })
    return match ? match[1] : "unknown"; // Возвращаем номер PR или "unknown", если номер не найден
};

const createMetaFile = () => {
    const changesetDir = path.resolve(".changeset");
    const files = fs.readdirSync(changesetDir).filter(file => file.endsWith(".md"));

    files.forEach(file => {
        if (file.includes('README')) return;
        const changesetPath = path.join(changesetDir, file);
        const changesetContent = fs.readFileSync(changesetPath, "utf-8");
        console.log({ changesetContent })

        // Считываем измененные пакеты и тип изменений
        const packages = parsePackagesFromChangeset(changesetContent)
  
        // Получаем автора и коммит безопасно
        const meta = {
            changeset: path.basename(file, ".md"),
            // author: safeExecSync("git config user.name"),
            date: new Date().toISOString(),
            pr_number: extractPRNumberFromCommits(),
            commit: safeExecSync("git rev-parse HEAD"),
            issue_number: extractIssueNumberFromBranch()?.[0], // add issue number
            issue_ink: extractIssueNumberFromBranch()?.[1],
            description: changesetContent.split("\n\n")[1]?.trim() || "No description",
            packages
        };

        // Записываем в JSON
        const metaFilePath = path.join(changesetDir, `${path.basename(file, ".md")}.meta.json`);
        fs.writeFileSync(metaFilePath, JSON.stringify(meta, null, 2));
        console.log(`Meta file created: ${metaFilePath}`);
    });
};

createMetaFile();