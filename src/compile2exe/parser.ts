// src/compile2exe/parser.ts
import { exec, ExecException } from 'child_process';
import * as path from 'path';

export async function compileToExe(config: Record<string, string>) {
    const exeName = config['exeName'] || 'app.exe';
    const htmlSrc = config['compileHtml2exe'] || 'index.html';
    const icon = config['icon'] || '';

    console.log(`Подготовка к сборке ${exeName}...`);
    console.log(`Источник HTML: ${htmlSrc}`);
    if (icon) {
        console.log(`Иконка: ${icon}`);
    }

    // Путь к нашему C# компилятору
    const compilerPath = path.join(__dirname, 'compiler.cs');
    
    // Вызываем системный компилятор C# (csc), передавая параметры
    const command = `csc /target:winexe /out:${exeName} "${compilerPath}"`;

    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
            console.error(`❌ Ошибка сборки: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Предупреждения компилятора: ${stderr}`);
        }
        console.log(`УРА!!! Исполняемый файл успешно создан: ${exeName}.`);
    });
}