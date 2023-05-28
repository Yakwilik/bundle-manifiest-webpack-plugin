const fs = require('fs');
const path = require('path');
const { RawSource } = require('webpack').sources;
const { Compilation } = require('webpack');

class BundleManifiestWebpackPlugin {
    constructor(options) {
        this.swFilename = options.swFilename;  // относительный путь до файла сервисного воркера
        this.outputFilename = options.outputFilename || 'serviceWorker.js';  // имя файла для сохранения
    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap('GenerateSW', (compilation) => {
            compilation.hooks.processAssets.tapAsync(
                {
                    name: 'GenerateSW',
                    stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                },
                (assets, callback) => {
                    let assetNames = Object.keys(assets);

                    let assetList = assetNames.map((filename) => `'${filename}'`);

                    let swPath = path.join(compiler.options.context, this.swFilename);

                    fs.readFile(swPath, 'utf8', (err, data) => {
                        if (err) {
                            return callback(err);
                        }

                        let swSource = new RawSource(`self.__BMWP_MANIFEST = [${assetList.join(",")}];${data}`);

                        if (compilation.getAsset(this.outputFilename)) {
                            compilation.updateAsset(this.outputFilename, swSource);
                        } else {
                            compilation.emitAsset(this.outputFilename, swSource);
                        }

                        callback();
                    });
                }
            );
        });
    }
}

module.exports = BundleManifiestWebpackPlugin;
