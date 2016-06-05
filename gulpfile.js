var gulp = require('gulp')
    , fs = require('fs')
    , path = require('path')
    , clean = require('gulp-clean')
    , concat = require('gulp-concat')
    , replace = require('gulp-replace')
    , through2 = require('through2')

    , autoprefixer = require('gulp-autoprefixer')
    // , svgSprite = require('gulp-svg-sprites')
    , sass = require('gulp-sass')

    , cssmin = require('gulp-cssmin')
    , imagemin = require('gulp-imagemin')
    , pngquant = require("imagemin-pngquant")
    , uglify = require('gulp-uglify')
    
    , sequence = require('run-sequence')
    , cache = require('gulp-cache')
    , rev = require('gulp-rev')
    , rename = require("gulp-rename")
    , gulpIf = require('gulp-if')
    , revReplace = require('gulp-rev-replace')
    , browserSync = require("browser-sync").create()
    , reload = browserSync.reload;


var dest = 'dev/';
var src = 'src/';
var env = 'local';
var baseSize = 40; //网页基准像素单位
var revStatus;

gulp.task('clean:dev', function() {
  return gulp.src(dest, {read: false})
    .pipe(clean());
});

gulp.task('concat:lib', function() {
  var manifest = gulp.src("rev-manifest.json");
  var filePath = src + 'js/';
  return gulp.src([
      filePath + 'lib/{zepto,underscore,*}.js',
      filePath + 'core/{engine,*}.js',
      filePath + 'plugin/{tool,*}.js'
    ])
    .pipe(concat('lib.js'))
    .pipe(gulpIf(revStatus, revReplace({manifest: manifest})))
    .pipe(gulpIf(revStatus, rev()))
    .pipe(gulp.dest(dest + 'assets/js/'))
    .pipe(gulpIf(revStatus, rev.manifest({
      base: dest,
      merge: true // 合并json数据
    })))
    .pipe(gulpIf(revStatus, gulp.dest(dest)));
});

gulp.task('concat:app', function() {
  var manifest = gulp.src("rev-manifest.json");
  var includeTpl = through2.obj(function(file, enc, cb) {
      var filePath = path.dirname(file.path);
      var content = file.contents.toString();
      // 导入HTML
      content = content.replace(/__include\('(.*)'\)/g, function(str, src) {
        src = dest + src;
        return fs.existsSync(src) ? "'" + fs.readFileSync(src).toString().replace(/\s{2,}/g, '') + "'" : 'undefined';
      });
      file.contents = new Buffer(content);
      this.push(file);
      cb();
  });
  return gulp.src([
      src + 'js/app.js',
      src + 'js/*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(includeTpl)
    .pipe(gulpIf(revStatus, revReplace({manifest: manifest})))
    .pipe(gulpIf(revStatus, rev()))
    .pipe(gulp.dest(dest + 'assets/js/'))
    .pipe(gulpIf(revStatus, rev.manifest({
      base: dest,
      merge: true // 合并json数据
    })))
    .pipe(gulpIf(revStatus, gulp.dest(dest)));
});

// gulp.task('sprites', function() {
//   var icons = {};
//   return gulp.src(src + 'icons/*.svg')
//     .pipe(svgSprite({
//       mode: "symbols",
//       svgId: "icon-%f",
//       preview: false,
//       svg: {
//         symbols: "symbols.svg"
//       },
//       transformData: function(data, config) {
//         var array = data.svg, i, j;
//         for (i = 0; i < array.length; i++) {
//           var icon = array[i];
//           var str = icon.raw;
//           icons[icon.name] = {
//             width: icon.width,
//             height: icon.height,
//             color: str.match(/fill="(.*?)"/g)[0].slice(6, -1)
//           };
//           var contents = str.match(/\s(d=".*?")/g);
//           var colors = str.match(/fill="(.*?)"/g);
//           icon.raw = '';
//           for (j = 0; j < contents.length; j++) {
//             icon.raw += '<path' + contents[j] + ' ' + colors[j] + '/>';
//           };
//         }
//         return data;
//       }
//     }))
//     .pipe(through2.obj(function(file, enc, cb) {
//       var styleTpl = (function() {
//         var common, inner = '';
//         for (var i in icons) {
//           inner += '.icon.' + i + ' {\n' +
//             '  width: ' + icons[i].width / baseSize + 'rem;\n' +
//             '  height: ' + icons[i].height / baseSize + 'rem;\n' +
//             '  fill: ' + icons[i].color + ';\n' +
//           '}\n';
//         }
//         common = '.icon {\n' +
//           '  display: inline-block;\n' +
//           '  vertical-align: middle;\n' +
//         '}\n' + inner;
//         return common;
//       })();
//       this.push(file);
//       fs.writeFile(src + 'sass/_sprites.scss', styleTpl, cb);
//     }))
//     .pipe(gulp.dest(src));
// });

gulp.task('sass', function() {
  var manifest = gulp.src("rev-manifest.json");

  return gulp.src(src + 'sass/app.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['> 5%'],
      cascade: true,
      remove: true
    }))
    .pipe(gulpIf(revStatus, cssmin()))
    .pipe(gulpIf(revStatus, revReplace({manifest: manifest})))
    .pipe(gulpIf(revStatus, rev()))
    .pipe(gulp.dest(dest + 'assets/css/'))
    .pipe(gulpIf(revStatus, rev.manifest({
      base: dest,
      merge: true // 合并json数据
    })))
    .pipe(gulpIf(revStatus, gulp.dest(dest)));
});

var importTemplates = function() {
  var manifest = gulp.src("rev-manifest.json");
  return through2.obj(function(file, enc, cb) {
    var filePath = path.dirname(file.path);
    var content = file.contents.toString();
    // 导入HTML
    content = content.replace(/@import\s+'(.*?\..*?)'/g, function(str, src) {
      src = filePath + '/./' + src;
      return fs.existsSync(src) ? fs.readFileSync(src).toString() : 'undefined';
    });
    file.contents = new Buffer(content);
    this.push(file);
    cb();
  });
};

gulp.task('build:html', function() {
  var manifest = gulp.src("rev-manifest.json");

  return gulp.src([src + 'pages/**/*.html'], {base: src})
    .pipe(importTemplates())
    .pipe(gulpIf(revStatus, revReplace({manifest: manifest})))
    .pipe(gulp.dest(dest));
});

gulp.task('build:index', function() {
  var manifest = gulp.src("rev-manifest.json");

  gulp.src(src + 'favicon.ico')
    .pipe(gulp.dest(dest));

  return gulp.src([src + 'index.html'], {base: src})
    .pipe(importTemplates())
    .pipe(gulpIf(revStatus, revReplace({manifest: manifest})))
    .pipe(gulp.dest(dest));
});

gulp.task('uglify', function() {
  return gulp.src(dest + 'assets/js/*.js', {base: dest})
    .pipe(uglify())
    .pipe(gulp.dest(dest));
});

gulp.task('json', function() {
  return gulp.src(src + 'json/*.json')
    .pipe(gulp.dest(dest + 'assets/json/'))
});

gulp.task('imagemin', function() {
  return gulp.src(src + "images/**/*.*")
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
      use: [pngquant({quality: '65-80', speed: 4})]
    })))
    .pipe(gulpIf(revStatus, rev()))
    .pipe(gulp.dest(dest + 'assets/images/'))
    .pipe(gulpIf(revStatus, rev.manifest({
      base: dest,
      merge: true // 合并json数据
    })))
    .pipe(gulpIf(revStatus, gulp.dest(dest)));
});

gulp.task('clean:surplus', function() {
  return gulp.src([dest + 'pages', src + 'symbols.svg', 'rev-manifest.json'], {read: false})
    .pipe(clean());
});

gulp.task('server', function() {
  browserSync.init({
    ui: false
    , port: 81
    , proxy: "localhost:5000"
  });
  gulp.watch(src + 'sass/*.scss').on('change', function() {
    sequence('sass', reload);
  });
  // gulp.watch(src + 'icons/*.svg').on('change', function() {
  //   sequence('sprites', reload);
  // });
  gulp.watch(src + 'images/*.{png,jpg}').on('change', function() {
    sequence('imagemin', reload);
  });
  gulp.watch([src + 'js/core/*.js', src + 'js/lib/*.js', src + 'js/plugin/*.js']).on('change', function() {
    sequence('concat:lib', reload);
  });
  gulp.watch(src + 'js/*.js').on('change', function() {
    sequence('concat:app', reload);
  });
  gulp.watch(src + 'pages/**/*.html').on('change', function() {
    sequence('build:html', 'concat:app', reload);
  });
  gulp.watch(src + 'index.html').on('change', function() {
    sequence('build:index', reload);
  });
});

gulp.task('default', function() {
  // sequence('clean:dev', 'imagemin', ['build:html', 'sprites', 'sass', 'json'], ['concat:lib', 'concat:app'], 'build:index', 'server');
  sequence('clean:dev', 'imagemin', ['build:html', 'sass', 'json'], ['concat:lib', 'concat:app'], 'build:index', 'server');
});

gulp.task('release', function() {
  revStatus = true;
  sequence('clean:dev', 'imagemin', ['build:html', 'sass', 'json'], ['concat:lib', 'concat:app'], 'uglify', 'build:index', 'clean:surplus');
  sequence('clean:dev', 'imagemin', ['build:html', 'sprites', 'sass', 'json'], ['concat:lib', 'concat:app'], 'uglify', 'build:index', 'clean:surplus');
});