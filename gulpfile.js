var gulp = require('gulp');
//start
var prompt = require('gulp-prompt');
//images
var tinify = require('gulp-tinify');
var newer = require('gulp-newer');
//js
var closure = require('gulp-closure-compiler');
var javascriptObfuscator = require('gulp-javascript-obfuscator');
var order = require("gulp-order");
//html
var htmlreplace = require('gulp-html-replace');
var htmlclean = require('gulp-htmlclean');
//css
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var  concat = require('gulp-concat');


var production = false;
var folder = {
	src: 'src/',
	assets:{
		js: 'js/',
		css: 'css/',
		images: 'assets/'
	},
	build: {
		dev: 'build/dev/',
		prod: 'build/prod/'
	}
};

gulp.task('start', function(){
	return gulp.src(folder.src)
		.pipe(
			prompt.prompt({
				type: 'checkbox',
				name: 'first',
				message: 'Escolha o tipo de build:',
				choices: ['debug','production']
			}, function(res){
				console.log(res.first.length);
				if(res.first.length === 0){
					production = false;
				}else{
				console.log(res.first[0]);
					if(res.first[0] === 'debug'){
						production = false;						 
					}else{
						production = true;
					}
				}
			})
		);
});

 
gulp.task('imagesTask',['start'], function() {
	var out = folder.build.dev + folder.assets.images;
	if(production){
	   out = folder.build.prod + folder.assets.images;
	}
	return gulp.src(folder.src + folder.assets.images + '**/*')
		.pipe(newer(out))
        .pipe(tinify('prtRLScGqZccyBGxW6H95th4nT9C1TLH'))
        .pipe(gulp.dest(out));
});
 
gulp.task('jsTask',['imagesTask'], function() {
	var out = folder.build.dev + folder.assets.js;
	if(production){
	   out = folder.build.prod + folder.assets.js;
	}
	
	var task_;
	if(production){
	   var temp = gulp.src(folder.src + folder.assets.js + '**/*.js')
			.pipe(order([
				folder.src + folder.assets.js + '3th/FontLoader.js',
				folder.src + folder.assets.js + '3th/pixi.js',
				folder.src + folder.assets.js + '3th/dragonBones.js',
				folder.src + folder.assets.js + '3th/pixi-sound.js',
		   
			], { base: "./" }))
		
			.pipe(concat("concat.js"))
			.pipe(gulp.dest('temp/'));
		
		task_  = gulp.src('./temp/concat.js')
			.pipe(closure({
      			compilerPath: 'bower_components/closure-compiler/compiler.jar',
		   		fileName: 'main.js',
			  	compilerFlags: {
					define: [
					  "goog.DEBUG=false"
					],
					warning_level: 'QUIET'
				  }
    		}))
			.pipe(javascriptObfuscator());
	}else{
		task_  = gulp.src(folder.src + folder.assets.js + '**/*.js');
	}
	return task_
		.pipe(gulp.dest(out));
});


gulp.task('cssTask',['jsTask'], function() {
	var out = folder.build.dev + folder.assets.css;
	if(production){
	   out = folder.build.prod + folder.assets.css;
	}
	var postCssOpts = [];
	postCssOpts.push(cssnano);
	
	var task_ = gulp.src(folder.src + folder.assets.css + '**/*.css');
	
	if(production){
		task_ = task_
			.pipe(postcss(postCssOpts))
			.pipe(concat('main.css'));
	}
	return task_.pipe(gulp.dest(out));
	
});

gulp.task('htmlTask',['cssTask'], function() {
	var out = folder.build.dev;
	if(production){
	   out = folder.build.prod;
	}
	
	var task_ = gulp.src([folder.src +'*.html', folder.src +'*.htm']);
	if(production){
	   task_ = task_
			.pipe(htmlreplace(
		   		{
					css:folder.assets.css+"main.css",
					js:folder.assets.js+"main.js",
					
				}
	   		))
			.pipe(htmlclean());
	}
	return task_.pipe(gulp.dest(out));
});

gulp.task('othersTask',['htmlTask'], function() {
	var out = folder.build.dev;
	if(production){
	   out = folder.build.prod;
	}
	return gulp.src([
		folder.src+"**/*.json",
		folder.src+"**/*.dbbin",
		folder.src+"**/*.eot",
		folder.src+"**/*.svg",
		folder.src+"**/*.tff",
		folder.src+"**/*.woff",
		folder.src+"**/*.mp3",
		folder.src+"**/*.ogg"
		
	]).pipe(gulp.dest(out));
});

gulp.task('run',['start','imagesTask','jsTask','cssTask','htmlTask','othersTask']);