// main.ts
import * as fs from 'fs';
import * as path from 'path';

// Импортируем компоненты из нашего ядра в src/
import { validateAndParseEsharp } from './src/syntax/syntax';
import { compileToExe } from './src/compile2exe/parser';
import { runCli } from './src/cli/cli';

// Экспортируем ядро наружу, чтобы CLI или другие модули могли его использовать
export class EsharpCore {
    public static run(targetFile: string) {
        if (!fs.existsSync(targetFile)) {
            throw new Error(`Файл "${targetFile}" не найден`);
        }

        const code = fs.readFileSync(targetFile, 'utf-8');
        
        // 1. Проверяем синтаксис через syntax.ts
        const config = validateAndParseEsharp(code);
        console.log('Синтаксис проверен успешно.', config);

        // 2. Передаем в парсер/компилятор
        compileToExe(config);
    }
}

// Если запускаем напрямую из консоли — передаем управление в cli.ts
if (require.main === module) {
    runCli();
}