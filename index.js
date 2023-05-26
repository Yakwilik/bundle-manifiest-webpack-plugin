class FileListPlugin {
    apply(compiler) {
        // Эмит событий, включенных в жизненный цикл компиляции
        compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
            // Создание объекта для хранения списка файлов
            let fileList = {};

            // Перебираем все созданные файлы в процессе сборки
            for (let filename in compilation.assets) {
                // Добавляем каждый файл в объект fileList
                fileList[filename] = true;
            }

            // Превращаем объект fileList в строку JSON
            fileList = JSON.stringify(fileList, null, 2);

            // Добавляем fileList в компиляцию с помощью Webpack для вывода
            compilation.assets['filelist.json'] = {
                source: function() {
                    return fileList;
                },
                size: function() {
                    return fileList.length;
                }
            };

            // Завершаем плагин
            callback();
        });
    }
}

module.exports = FileListPlugin;
