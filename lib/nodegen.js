/**
 * http://www.apache.org/licenses/LICENSE-2.0
 **/
var when = require("when");
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var mustache = require('mustache');
var jsStringEscape = require('js-string-escape');
var obfuscator = require('javascript-obfuscator');
var csv = require('csv-string');
var jimp = require("jimp");

function createCommonFiles(templateDirectory, data) {
    "use strict";
    // Make directories
    try {
        fs.mkdirSync(path.join(data.dst, data.module));
    } catch (error) {
        if (error.code !== 'EEXIST') {
            console.error(error);
        }
    }

    var isStockIcon = data.icon && data.icon.match(/^(alert|arduino|arrow-in|batch|bluetooth|bridge-dash|bridge|cog|comment|db|debug|envelope|feed|file-in|file-out|file|function|hash|inject|join|leveldb|light|link-out|mongodb|mouse|node-changed|node-error|parser-csv|parser-html|parser-json|parser-xml|parser-yaml|range|redis|rpi|serial|sort|split|subflow|swap|switch|template|timer|trigger|twitter|watch|white-globe)\.png$/);
    if (!isStockIcon) {
        try {
            fs.mkdirSync(path.join(data.dst, data.module, 'icons'));
        } catch (error) {
            if (error.code !== 'EEXIST') {
                console.error(error);
            }
        }
    }
    if (data.icon) {
        if (!isStockIcon) {
            try {
                jimp.read(data.icon, function (error2, image) {
                    if (!error2) {
                        var outputPath = path.join(data.dst, data.module, 'icons', path.basename(data.icon));
                        if (image.bitmap.width === 40 && image.bitmap.height === 60) {
                            var buf = fs.readFileSync(data.icon);
                            fs.writeFileSync(outputPath, buf);
                        } else {
                            image.background(0xFFFFFFFF).resize(40, 60).write(outputPath);
                        }
                    } else {
                        console.log('error occurs while converting icon file.');
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
    } else {
        var icons = fs.readdirSync(path.join(templateDirectory, 'icons'));
        icons.forEach(function (icon) {
            try {
                var buf = fs.readFileSync(path.join(templateDirectory, 'icons', icon));
                fs.writeFileSync(path.join(data.dst, data.module, 'icons', icon), buf);
            } catch (error) {
                console.error(error);
            }
        });
    }

    try {
        fs.mkdirSync(path.join(data.dst, data.module, 'locales'));
    } catch (error) {
        if (error.code !== 'EEXIST') {
            console.error(error);
        }
    }
    try {
        var languages = fs.readdirSync(path.join(templateDirectory, 'locales'));
        languages.forEach(function (language) {
            try {
                fs.mkdirSync(path.join(data.dst, data.module, 'locales', language));
            } catch (error) {
                if (error.code !== 'EEXIST') {
                    console.error(error);
                }
            }
        });
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(error);
        }
    }
    try {
        fs.mkdirSync(path.join(data.dst, data.module, 'test'));
    } catch (error) {
        if (error.code !== 'EEXIST') {
            console.error(error);
        }
    }
    try {
        var buf = fs.readFileSync(path.join(templateDirectory, '.travis.yml.mustache'));
        fs.writeFileSync(path.join(data.dst, data.module, '.travis.yml'), buf);
    } catch (error) {
        if (error.code !== 'EEXIST') {
            console.error(error);
        }
    }
}

function runNpmPack(data) {
    "use strict";
    var npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    try {
        child_process.execFileSync(npmCommand, ['pack', './' + data.module], { cwd: data.dst });
    } catch (error) {
        console.error(error);
    }
}

function extractKeywords(keywordsStr) {
    "use strict";
    var keywords = ["node-red-nodegen"];
    keywords = keywordsStr ? keywords.concat(csv.parse(keywordsStr)[0]) : keywords;
    keywords = keywords.map(k => ({ name: k }));
    keywords[keywords.length - 1].last = true;
    return keywords;
}

function function2node(data, options) {
    "use strict";
    return when.promise(function (resolve, reject) {
        // Read meta data in js file
        var meta = {};
        var parts = new String(data.src).split('\n');
        parts.forEach(function (part) {
            var match = /^\/\/ (\w+): (.*)/.exec(part.toString());
            if (match) {
                if (match[1] === 'name') {
                    meta.name = match[2].replace(/([A-Z])/g, ' $1').toLowerCase().replace(/[^ a-z0-9]+/g, '').replace(/^ | $/, '').replace(/ +/g, '-');
                } else {
                    meta[match[1]] = match[2];
                }
            }
        });

        if (!data.name || data.name === '') {
            data.name = meta.name;
        }

        if (!meta.outputs || meta.outputs === '') {
            meta.outputs = 1;
        }

        if (data.module) {
            if (data.prefix) {
                reject('module name and prefix are conflicted.');
                return;
            }
        } else {
            if (data.prefix) {
                data.module = data.prefix + data.name;
            } else {
                data.module = 'node-red-contrib-' + data.name;
            }
        }

        if (!data.version || data.version === '') {
            data.version = '0.0.1';
        }

        if (data.icon) {
            if (!data.icon.match(/\.(png|gif)$/)) {
                data.icon = data.icon + '.png';
            }
            if (!data.icon.match(/^[a-zA-Z0-9\-\./]+$/)) {
                reject('invalid icon file name');
                return;
            }
        }

        if (data.color) {
            if (data.color.match(/^[a-zA-Z0-9]{6}$/)) {
                data.color = '#' + data.color;
            } else {
                reject('invalid color');
                return;
            }
        }

        if (data.name === 'function') {
            reject('\'function\' is duplicated node name. Use another name.');
            return;
        } else if (!data.name.match(/^[a-z0-9\-]+$/)) {
            reject('invalid node name');
            return;
        } else {
            var params = {
                nodeName: data.name,
                projectName: data.module,
                projectVersion: data.version,
                keywords: extractKeywords(data.keywords),
                category: data.category || 'function',
                icon: function () {
                    if (data.icon) {
                        return path.basename(data.icon);
                    } else {
                        return 'icon.png';
                    }
                },
                color: data.color || '#C0DEED',
                func: jsStringEscape(data.src),
                require: data.require,
                parameters: data.parameters,
                dependencies: data.dependencies,
                outputs: meta.outputs
            };
            if(!data.template || data.template === ''){
                data.template = __dirname + '/../templates/function'
            }
            createCommonFiles(data.template, data);

            // Create package.json
            var packageTemplate = fs.readFileSync(path.join(data.template, '/package.json.mustache'), 'utf-8');
            var packageSourceCode = mustache.render(packageTemplate, params);
            fs.writeFileSync(path.join(data.dst, data.module, 'package.json'), packageSourceCode);

            // Create node.js
            var nodeTemplate = fs.readFileSync(path.join(data.template, '/node.js.mustache'), 'utf-8');
            var nodeSourceCode = mustache.render(nodeTemplate, params);
            if (options.obfuscate) {
                nodeSourceCode = obfuscator.obfuscate(nodeSourceCode, { stringArrayEncoding: 'rc4' });
            }
            fs.writeFileSync(path.join(data.dst, data.module, 'node.js'), nodeSourceCode);

            // Create node.html
            var htmlTemplate = fs.readFileSync(path.join(data.template, '/node.html.mustache'), 'utf-8');
            var htmlSourceCode = mustache.render(htmlTemplate, params);
            fs.writeFileSync(path.join(data.dst, data.module, 'node.html'), htmlSourceCode);

            // Create node_spec.js
            var nodeSpecTemplate = fs.readFileSync(path.join(data.template, '/test/node_spec.js.mustache'), 'utf-8');
            var nodeSpecSourceCode = mustache.render(nodeSpecTemplate, params);
            fs.writeFileSync(path.join(data.dst, data.module, 'test/node_spec.js'), nodeSpecSourceCode);

            // Create README.md
            var readmeTemplate = fs.readFileSync(path.join(data.template, '/README.md.mustache'), 'utf-8');
            var readmeSourceCode = mustache.render(readmeTemplate, params);
            fs.writeFileSync(path.join(data.dst, data.module, 'README.md'), readmeSourceCode);

            // Create LICENSE file
            var licenseTemplate = fs.readFileSync(path.join(data.template, '/LICENSE.mustache'), 'utf-8');
            var licenseSourceCode = mustache.render(licenseTemplate, params);
            fs.writeFileSync(path.join(data.dst, data.module, 'LICENSE'), licenseSourceCode);

            if (options.tgz) {
                runNpmPack(data);
                resolve(path.join(data.dst, data.module + '-' + data.version + '.tgz'));
            } else {
                resolve(path.join(data.dst, data.module));
            }
        }
    });
}

module.exports = {
    function2node: function2node
};
