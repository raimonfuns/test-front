module.exports = function(grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);
    var path = require('path');
    var fs = require('fs');
    var pkg = require('./package');
    var proj_namespace = path.join(pkg.description, pkg.name, pkg.version, '/');
    var ASSETS_URL = 'http://assets.dwstatic.com/' + proj_namespace;
    var ipAddress = require('network-address')();

    var get_files = require('grunt-adiejs-static/lib/get_files').get_files,
        get_data = require('grunt-adiejs-static/lib/data').get_data,
        get_layout = require('grunt-adiejs-static/lib/layout').get_layout,
        render_file = require('grunt-adiejs-static/lib/render').render_file,
        write_file = require('grunt-adiejs-static/lib/write_file').write_file,
        get_helper_functions = require('grunt-adiejs-static/lib/get_helper_functions').get_helper_functions,
        ejs_static = require('grunt-adiejs-static/lib/ejs_static'),
        _ = require('grunt-adiejs-static/node_modules/underscore'),
        middleware_directory = require('grunt-contrib-connect/node_modules/connect/lib/middleware/directory'),
        Negotiator = require('grunt-contrib-connect/node_modules/connect/node_modules/negotiator/lib/negotiator'),
        url = require('url');

    var log = function (value) {
        console.log(value);
    }

    var renderTpl = function(req, res, next) {
        if (req.originalUrl.indexOf('service') > 0 || req.originalUrl.indexOf('/vip/') > 0) {
            return next();
        }
        var reqPathName = decodeURIComponent(url.parse(req.originalUrl).pathname),
            reqFileName = reqPathName.substring(0, reqPathName.lastIndexOf('.html') + 5),
            localPathName = path.resolve('src/', reqPathName.substring(1)),
            renderedFile;

        // log("************* originalUrl *************");
        // log(url.parse(req.originalUrl))
        // log("************* reqPathName *************");
        // log(reqPathName);
        // log("************* reqFileName *************");
        // log(reqFileName);
        // log("************* localPathName *************");
        // log(localPathName);


        fs.readFile(localPathName, function(err, file) {
            if (err) {
                return next();
            }

            var options = {
                    path_to_data: 'src/data/config.json',
                    file_extension: '.html',
                    underscore: true
                },
                config_cover = ejs_static.get_files(options),
                htmlfiles; // local html file array

                // log("************* config_cover *************");
                // log(config_cover);

                fs.readdir(path.resolve('src/'), function(err, arr) {
                    if (err) {
                        console.log(err)
                    }

                    htmlfiles = _.filter(arr, function(item) {
                        return item.lastIndexOf('.html') !== -1;
                });


                var key = reqFileName;

                // log("************* config_cover[key] *************");
                // log(config_cover[key]);

                if (config_cover[key]) {
                    var fileData = ejs_static.get_data(key, config_cover);
                    var layoutData = ejs_static.get_layout(key, config_cover, options);

                    // log("************* fileData *************");
                    // log(fileData);
                    // log("************* layoutData *************");
                    // log(layoutData);

                    renderedFile = ejs_static.render_file(layoutData, fileData, _.extend({}, _));
                }

                var type = new Negotiator(req).preferredMediaType(['text/plain', 'text/html', 'text/css', 'application/json', 'application/javascript', 'application/x-javascript']);
                switch (type) {
                    case 'text/css':
                        res.setHeader('Content-Type', 'text/css');
                        break;
                    case 'application/javascript':
                        res.setHeader('Content-Type', 'application/javascript');
                        break;
                    case 'application/x-javascript':
                        res.setHeader('Content-Type', 'application/x-javascript');
                        break;
                    case 'text/plain':
                        req.url.lastIndexOf('.js') !== -1 && res.setHeader('Content-Type', 'application/javascript');
                        req.url.lastIndexOf('.css') !== -1 && res.setHeader('Content-Type', 'text/css');
                        break;
                }
                res.end(renderedFile || file);
            });
        });
    };

    grunt.initConfig({

        // 全局变量
        banner: '/*! Project: ' + pkg.name + '\n *  Version: ' + pkg.version + '\n *  Date: <%= grunt.template.today("yyyy-mm-dd hh:MM:ss TT") %>\n *  Author: ' + pkg.author.name + '\n */',

        connect: {
            site_src: {
                options: {
                    hostname: 'show.yy.com',
                    //hostname: '172.19.42.12',
                    port: 85,
                    base: ['src/'],
                    livereload: true,
                    open: true, //打开默认浏览器
                    middleware: function(connect, options) {
                        var middlewares = [];
                        /*var directory = options.directory || options.base[options.base.length - 1];
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        middlewares.push(connect.static('src/'));
                        options.base.forEach(function(base) {
                           middlewares.push(connect.static(base));
                        });*/
                        middlewares.push(function(req, res, next) {
                            return renderTpl(req, res, next);
                        });
                        middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
                        middlewares.push(connect.directory(path.resolve('src/')));
                        return middlewares;
                    }
                    //middleware: [
                    //    function(req, res, next){
                    //        return renderTpl(req,res,next);
                    //    },
                    //    middleware_directory(path.resolve('src/')),
                    //    require('grunt-connect-proxy/lib/utils').proxyRequest
                    //]
                },
                proxies: [{
                    context: ['/vip', '/service'],
                    host: pkg.unionText.host,
                    port: pkg.unionText.port,
                    https: false,
                    changeOrigin: false,
                    xforward: false
                    //headers: {
                    //  "x-custom-added-header": value
                    //}
                }]
            },
            site_dest: {
                options: {
                    hostname: 'show.yy.com',
                    port: 85,
                    base: ['dest/'],
                    livereload: true,
                    keepalive: true, //保持sever不退出
                    open: true, //打开默认浏览器
                    middleware: function(connect, options) {
                        var middlewares = [];
                        middlewares.push(function(req, res, next) {
                            return renderTpl(req, res, next);
                        });
                        middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
                        middlewares.push(connect.directory(path.resolve('dest/')));
                        return middlewares;
                    }
                },
                proxies: [{
                    context: ['/vip', '/service'],
                    host: pkg.unionText.host,
                    port: pkg.unionText.port,
                    https: false,
                    changeOrigin: false,
                    xforward: false
                    //headers: {
                    //  "x-custom-added-header": value
                    //}
                }]
            }
        },

        clean: {
            build: ["dest"],
            release: ["dest/assets/slice", "dest/data", "dest/partial", ".buildJs"],
            zip: ["assets"],
            svn: [".tmp_svn"]
        },

        copy: {
            release: {
                expand: true,
                cwd: 'src/',
                src: ['**', '!assets/stylus', '!assets/stylus/{,*/}*', '!assets/css/*.map', '!img/psd', '!img/psd/{,*/}*'],
                dest: 'dest/'
            },
            zip_dest: {
                expand: true,
                cwd: 'dest/',
                src: ['js/{,*/}*', 'img/{,*/}*', 'css/*'],
                dest: 'assets/dest'
            },
            zip_src: {
                expand: true,
                cwd: 'src/',
                src: ['**', '!assets/stylus', '!assets/stylus/{,*/}*',  '!assets/css/*.map', '!img/psd', '!img/psd/{,*/}*'],
                dest: 'assets/src'
            }
        },

        cssmin: {
            options: {
                banner: '<%= banner %>'
            },
            minify: {
                expand: true,
                cwd: 'dest/assets/css',
                src: ['*.css', '!*.min.css'],
                dest: 'dest/assets/css',
                ext: '.css'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dest/assets/js',
                    src: '**/*.js',
                    dest: 'dest/assets/js'
                }]
            }
        },

        // 图片压缩
        imagemin: {
            options: {
                pngquant: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dest/assets/img/',
                    src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
                    dest: 'dest/assets/img/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                }]
            }
        },

        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'ff 17', 'opera 12.1', 'ie 8']
            },
            dist: {
                expand: true,
                flatten: true,
                src: 'src/css/*.css',
                dest: 'src/css/'
            }
        },

        // 动态模板预编译工具
        tmod: {
            task1: {
                files: [{
                    src: ['src/tpl/public']
                }],
                options: {
                    debug: false,
                    syntax: "simple",
                    charset: "utf-8",
                    type: "cmd", // 以cmd规范输出
                    dest: '../../assets/js/tpl/public'
                }
            },
            task2: {
                files: [{
                    src: ['src/tpl/welfare']
                }],
                options: {
                    debug: false,
                    syntax: "simple",
                    charset: "utf-8",
                    type: "cmd", // 以cmd规范输出
                    dest: '../../assets/js/tpl/welfare'
                }
            }
        },

        // ejs静态模板
        ejs_static: {
            release: {
                options: {
                    dest: 'dest/',
                    path_to_data: 'src/data/release/config.json',
                    path_to_layouts: 'src/p/',
                    is_sync_path_to_data: false,
                    underscores_to_dashes: true,
                    file_extension: '',
                    underscore: true
                }
            },
            release_tpl: {
                options: {
                    dest: 'tpl/',
                    path_to_data: 'src/data/configtpl.json',
                    path_to_layouts: 'src/p/',
                    is_sync_path_to_data: false,
                    underscores_to_dashes: false,
                    file_extension: '',
                    underscore: true
                }
            }
        },

        stylus: {
            dist: {
                options: {
                    style: 'compact', //nested, compact, compressed, expanded
                    sourcemap: true,
                    noCache: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/assets/stylus',
                    src: ['*.styl', '!_*.styl', '!*/_*.styl'],
                    dest: 'src/assets/css',
                    ext: '.css'
                }]
            }
        },

        sass: {                             
            dist: {                           
                options: {                       
                    style: 'compact' //nested, compact, compressed, expanded
                },
                files: [{
                    expand: true,
                    cwd: 'src/assets/sass',
                    src: ['*.scss'],
                    dest: 'src/assets/css',
                    ext: '.css'
                }]
            }
        },

        // 提取模块id
        transport: {
            options: {
                idleading: '/assets/js/'
            },
            target: {
                expand: true,
                cwd: 'src/assets/js',
                src: ['**/*.js', '!*.js'], // src/assets/js下面所有目录里的js文件，不包括当前目录
                dest: '.buildJs/assets/js'
            }
        },

        // 合并
        concat: {
            trans_js: {
                options: {
                    include: 'all'
                    //relative: true
                },
                files: [{
                    expand: true,
                    cwd: '.buildJs/assets/js',
                    src: ['**/*.js'],
                    dest: 'dest/assets/js'
                }]
            },
            trans_html: {
                options: {
                    process: function(src, filepath) {
                        var regex = /((href|src)=['"][\s]*)(?!http[s]?\:|\#|\/)([\?\#\=\/\w._-]*)([\s]*['"])/g;
                        return src.replace(regex, '$1' + ASSETS_URL + '$3$4');
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'dest/',
                    src: '*.html',
                    dest: 'assets/dest/'
                }]
            }
        },

        sprite:{
            all: {
                padding: 20,
                src: 'src/assets/slice/icon/*.png',
                dest: 'src/assets/img/icon.png',
                destCss: 'src/assets/css/test.css'
            }
        },

        watch: {
            css: {
                files: ['src/assets/stylus/{,*/}*.styl', 'src/assets/sass/{,*/}*.scss'],
                // tasks: ['stylus', 'autoprefixer', 'sass']
                tasks: ['sass']
            },
            tpl: {
                files: ['src/assets/js/tpl/{,*/}*.html'],
                tasks: ['tmod']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: ['src/p/**/*.html', 'src/assets/css/*.css', 'src/assets/js/**/*.js', 'src/partial/*.ejs', 'src/data/*.json']
            }
        },

        compress: {
            zip: {
                options: {
                    archive: 'assets.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'assets/',
                    src: '**'
                }]
            }
        },

        push_svn: {
            options: {
                message: '提交模板文件',
                username: '',
                password: '',
                pushIgnore: ['dest/**', '.DS_Store', '.idea/**', 'node_modules/**', '.tmp_svn/**', '.svn/**'],
                trymkdir: true
            },
            tpl: {
                src: 'tpl/p',
                dest: 'https://svn.yy.com/web/gh/vip.yy.com/trunk/vip-parent/vip-web/src/main/webapp/WEB-INF/content/vip/templates/tmp',
                tmp: '.tmp_svn'
            }
        },

        zip: {
            build: {
                cwd: 'dest/',
                src: ['dest/**'],
                dest: 'vipweb-front.zip'
            }
        }
    });

    // 默认任务
    grunt.registerTask('default', ['stylus', 'tmod', 'configureProxies:site_src', 'connect:site_src', 'watch']);

    // 查看src
    grunt.registerTask('src', ['configureProxies:site_src', 'connect:site_src', 'watch']);

    // 自定义端口
    grunt.task.registerTask('port', 'multi port', function(arg) {
        if (arguments.length === 0) {
            console.log('端口号不能为空！')
        } else {
            grunt.config.set('connect.port' + arg, {
                options: {
                    hostname: ipAddress,
                    port: arg,
                    base: ['src/'],
                    livereload: true,
                    open: true,
                    middleware: [

                        function(req, res, next) {
                            return renderTpl(req, res, next);
                        },
                        middleware_directory(path.resolve('src/'))
                    ]
                }
            });

            grunt.config.set('watch.livereload', {
                options: {
                    livereload: arg + 1
                },
                files: ['src/*.html', 'src/css/*.css', 'src/js/*.js']
            })


            grunt.task.run(['connect:port' + arg, 'watch']);
        }
    });

    // webserver 查看发布目录
    grunt.registerTask('dest', ['configureProxies:site_dest', 'connect:site_dest']);

    // 发布任务,发布并启用服务
    // grunt.registerTask('release', ['stylus', 'tmod', 'autoprefixer', 'clean:build', 'copy:release', 'transport', 'concat:trans_js', 'cssmin', 'uglify', 'imagemin', 'ejs_static:release', 'clean:release', 'connect:site_dest']);
    grunt.registerTask('release', ['stylus', 'tmod', 'autoprefixer', 'copy:release', 'transport', 'concat:trans_js', 'cssmin', 'uglify', 'ejs_static:release', 'clean:release', 'configureProxies:site_dest', 'connect:site_dest', 'watch']);

    //去掉'adisprite',build服务
    grunt.registerTask('build', ['stylus', 'tmod', 'autoprefixer', 'clean:build', 'copy:release', 'transport', 'concat:trans_js', 'cssmin', 'uglify', 'imagemin', 'ejs_static:release', 'clean:release']);


    grunt.registerTask('test', ['ejs_static:release']);

    // release后，zip打包
    grunt.registerTask('pack', ['zip']);


    // 提交tpl文件到工作svn
    grunt.registerTask('mktpl', ['ejs_static:release_tpl', 'push_svn:tpl', 'clean:svn']);


    // 提交src和配置文件到工作svn
    grunt.task.registerTask('work', 'commit message', function(arg) {
        grunt.config.merge({
            push_svn: {
                options: {
                    message: arg,
                    pushIgnore: ['dest/**', '.DS_Store', '.idea/**', 'node_modules/**', '.tmp_svn/**', '.svn/**'],
                    remove: true
                }
            }
        })
        grunt.task.run(['push_svn:work', 'clean:svn']);
    });

    // 提交dest到静态文件svn
    grunt.task.registerTask('assets', 'commit message', function(arg) {
        grunt.config.merge({
            push_svn: {
                options: {
                    message: arg,
                    pushIgnore: ['*.html', '.DS_Store', '.idea/**', '.tmp_svn/**', '.svn/**']
                }
            }
        })
        grunt.task.run(['push_svn:assets', 'clean:svn']);
    });
};