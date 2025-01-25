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

const createMetaFile = () => {
    const changesetDir = path.resolve(".changeset");
    const files = fs.readdirSync(changesetDir).filter(file => file.endsWith(".md"));

    files.forEach(file => {
        const changesetPath = path.join(changesetDir, file);
        const changesetContent = fs.readFileSync(changesetPath, "utf-8");

        // Считываем измененные пакеты и тип изменений
        const packages = changesetContent
            .split("\n")
            .filter(line => line.startsWith("- "))
            .map(line => {
                const [name, type] = line.replace("- ", "").split(": ");
                return { name, type };
            });

        // Получаем автора и коммит безопасно
        const meta = {
            changeset: path.basename(file, ".md"),
            author: safeExecSync("git config user.name"),
            date: new Date().toISOString(),
            pr_number: process.env.PR_NUMBER || "unknown",
            commit: safeExecSync("git rev-parse HEAD"),
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