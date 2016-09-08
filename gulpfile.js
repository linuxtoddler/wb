var gulp = require('gulp')
    , fs = require('fs')
    , path = require('path')
    , clean = require('gulp-clean')
    , concat = require('gulp-concat')
    , replace = require('gulp-replace')
    , through2 = require('through2')

    , autoprefixer = require('gulp-autoprefixer')
    , spritesmith = require("gulp.spritesmith")
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

var includeTpl = function() {
  return through2.obj(function(file, enc, cb) {
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
}

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
    .pipe(includeTpl())
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
  return gulp.src([
      src + 'js/app.js',
      src + 'js/*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(includeTpl())
    .pipe(gulpIf(revStatus, revReplace({manifest: manifest})))
    .pipe(gulpIf(revStatus, rev()))
    .pipe(gulp.dest(dest + 'assets/js/'))
    .pipe(gulpIf(revStatus, rev.manifest({
      base: dest,
      merge: true // 合并json数据
    })))
    .pipe(gulpIf(revStatus, gulp.dest(dest)));
});

gulp.task('sprites', function() {
  var spritePoistion = ""
    + "@function sprite-icon($name) {\n"
    + "\t@return #{map-get($icons-sprite-map, $name)};\n"
    + "}";
  // 自动生成sprite以及sass mixin
  // 可以使用sprite-icon(icon-name)获取某个图标的某个状态的坐标
  return gulp.src(src + "icons/*.png")
    // .pipe(plumber())
    .pipe(spritesmith({
      imgName: "icons.png"
      , padding: 10
      , cssName: "_icons.scss"
      , cssTemplate: function(data) {
        function fitPx(px, offset) {
          var px = px.replace('px', '');
          var temp = (px / 40 + (offset || 0)).toFixed(2);
          return temp == "0.00" ? "0" : temp + "rem";
        }
        var prefix = "";
        var icons = "";
        var smap = "$icons-sprite-map: (";
        data.sprites.forEach(function(icon, i) {
          var name = icon.name.replace(/\./g, '-');
          var px = icon.px;
          var iconName = "icon-" + name;
          smap += (i ? ",\n\t" : "\n\t") + iconName + ": \"" + fitPx(px.offset_x) + " " + fitPx(px.offset_y) + "\"";
          prefix += (prefix ? ",\n" : "") + ".icon-" + name;
          icons += (icons ? "\n" : "") + ".icon-" + name + " {\n" +
            "  width: " + fitPx(px.width) + ";\n" +
            "  height: " + fitPx(px.height) + ";\n" +
            "  background-position: " + fitPx(px.offset_x) + " " + fitPx(px.offset_y) + ";\n" +
            "}";
        });
        var total_width = fitPx(data.sprites[0].total_width.toString());
        var total_height = fitPx(data.sprites[0].total_height.toString());
        prefix += " {\n  background-image:url(/assets/images/" + data.spritesheet.escaped_image + ");\n  background-size: " + total_width + " " + total_height + ";\n  background-repeat: no-repeat;\n}";
        return smap + "\n);\n" + spritePoistion + "\n" + prefix + "\n" + icons;
      }
    }))
    .pipe(rename(function(path) {
      if (path.extname === ".scss") {
        path.dirname = "sass";
      } else {
        path.dirname = "images";
      }
    }))
    .pipe(gulp.dest(src));
});

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
    , proxy: "localhost:6001"
  });
  gulp.watch(src + 'sass/*.scss').on('change', function() {
    sequence('sass', reload);
  });
  gulp.watch(src + 'icons/*.png').on('change', function() {
    sequence('sprites', reload);
  });
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
  sequence('clean:dev', 'imagemin', ['build:html', 'sass', 'json'], ['concat:lib', 'concat:app'], 'build:index', 'server');
});

gulp.task('release', function() {
  revStatus = true;
  // sequence('clean:dev', 'imagemin', ['build:html', 'sass', 'json'], ['concat:lib', 'concat:app'], 'uglify', 'build:index', 'clean:surplus');
  sequence('clean:dev', 'imagemin', ['build:html', 'sprites', 'sass', 'json'], ['concat:lib', 'concat:app'], 'uglify', 'build:index', 'clean:surplus');
});