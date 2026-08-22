// src/cli/cli.ts
import * as fs from 'fs';

export function runCli(): string | null {
    const args = process.argv.slice(2);
    const targetFile = args[0];

    if (!targetFile) {
        console.log('Укажите файл для компиляции. Пример: esharp app.esharp.js');
        process.exit(1);
    }

    if (!targetFile.endsWith('.esharp.js') && !targetFile.endsWith('.esharp.ts')) {
        console.log('Файл должен иметь расширение .esharp.js или .esharp.ts.');
        process.exit(1);
    }

    if (!fs.existsSync(targetFile)) {
        console.log(`Файл "${targetFile}" не найден в текущей директории.`);
        process.exit(1);
    }

    return targetFile;
}