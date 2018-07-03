var gulp = require("gulp");
var flatten = require("gulp-flatten");
var concat = require("gulp-concat");
var del = require("del");
var insert = require("gulp-insert");
var connect = require("gulp-connect");
var uglify = require("gulp-uglify");
let cleanCSS = require("gulp-clean-css");
var ghpages = require("gh-pages");
var distFolder = "dist";

gulp.task("clean", function() {
    return del(distFolder);
});

gulp.task("connect", function() {
    connect.server({
        root: "dist",
        livereload: true,
        port: 1234
    });
});

gulp.task("prepare", ["clean", "js", "css", "images", "demo"]);

gulp.task("js", function() {
    return gulp
        .src(["./dropdown/**/*.js", "./index.js"])
        .pipe(concat("dropdown.js"))
        .pipe(
            insert.transform(function(contents) {
                return ";(function () {\r\n" + contents + "\r\n})();";
            })
        )
        .pipe(uglify())
        .pipe(flatten())
        .pipe(gulp.dest(distFolder))
        .pipe(connect.reload());
});

gulp.task("demo", function() {
    return gulp
        .src(["./demo/favicon.ico", "./demo/index.css", "./demo/index.html"])
        .pipe(flatten())
        .pipe(gulp.dest(distFolder))
        .pipe(connect.reload());
});

gulp.task("css", function() {
    return gulp
        .src(["./dropdown/**/*.css"])
        .pipe(concat("dropdown.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest(distFolder))
        .pipe(connect.reload());
});

gulp.task("images", function() {
    return gulp
        .src(["./dropdown/input/down-arrow.svg"])
        .pipe(gulp.dest(distFolder))
        .pipe(connect.reload());
});

gulp.task("prepare:watch", function() {
    return gulp.watch(["./demo/**/*.html", "./dropdown/**/*.js", "./dropdown/**/*.css"], ["prepare"]);
});

gulp.task("development", ["connect", "prepare", "prepare:watch"]);

gulp.task("deploy", function() {
    return ghpages.publish("dist");
});
