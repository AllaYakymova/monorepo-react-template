const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Функция для получения данных о авторе из git
const getGitAuthor = () => {
    return execSync("git config user.name").toString().trim();
};

// Функция для получения номера PR (если работает в CI)
const getPRNumber = () => {
    const prNumber = process.env.PR_NUMBER; // Для GitHub Actions можно использовать переменные окружения
    return prNumber || "unknown";
};

// Основной скрипт
const createMetaFile = () => {
    const changesetDir = path.resolve(".changeset");
    const files = fs.readdirSync(changesetDir).filter((file) => file.endsWith(".md"));

    files.forEach((file) => {
        const changesetPath = path.join(changesetDir, file);

        // Читаем содержимое changeset
        const changesetContent = fs.readFileSync(changesetPath, "utf-8");

        // Извлекаем пакеты и тип изменений
        const packages = changesetContent
            .split("\n")
            .filter((line) => line.startsWith("- "))
            .map((line) => {
                const [name, type] = line.replace("- ", "").split(": ").map((s) => s.trim());
                return { name, type };
            });

        // Создаем объект мета-данных
        const meta = {
            changeset: path.basename(file, ".md"),
            author: getGitAuthor(),
            pr_number: getPRNumber(),
            date: new Date().toISOString(),
            packages,
        };

        // Записываем мета-данные в JSON
        const metaFilePath = path.join(changesetDir, `${path.basename(file, ".md")}.meta.json`);
        fs.writeFileSync(metaFilePath, JSON.stringify(meta, null, 2));
        console.log(`Meta file created: ${metaFilePath}`);
    });
};

createMetaFile();