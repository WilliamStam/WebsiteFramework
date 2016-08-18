var jsfile = [
	'vendor/components/jquery/jquery.js',
	'vendor/components/jqueryui/jquery-ui.js',
	'vendor/twbs/bootstrap-sass/assets/javascripts/bootstrap.min.js' ,
//	'vendor/components/jquery-hotkeys/jquery.hotkeys.js',
//	'vendor/components/jquery-mousewheel/jquery.mousewheel.js',
	'vendor/components/nicescroll/jquery.nicescroll.js',
	'vendor/components/jQote2/jquery.jqote2.js',
	'vendor/timrwood/moment/moment.js',
//	'vendor/components/hideseek/jquery.hideseek.min.js',
	'vendor/moxiecode/plupload/js/plupload.full.min.js',
	'vendor/moxiecode/plupload/js/jquery.plupload.queue/jquery.plupload.queue.js',
	'vendor/components/toastr/toastr.js',
	'vendor/ivaynberg/select2/dist/js/select2.full.min.js',
	'ui/_js/plugins/jquery.getData.js',
	'ui/_js/plugins/jquery.ba-dotimeout.min.js',
	'ui/_js/plugins/jquery.ba-bbq.js',
//	'ui/_js/plugins/jquery.ui.touch-punch.min.js',
//	'ui/_js/plugins/jquery.keepalive.js',
	'ui/_js/plugins/jquery.plupload.js',
	'ui/_js/_.js'
];

module.exports = function (grunt) {
	require('time-grunt')(grunt);
	require('jit-grunt')(grunt, {
		sass: 'grunt-sass'
	});
	
	
	grunt.initConfig({
		
		concat: {
			js: {
				options: {
					separator: ';',
					stripBanners: true,
					sourceMap :true,
					sourceMapName : 'ui/base.js.map'
				},
				src: jsfile,
				dest: 'ui/base.js',
				nonull: true
			},
			js_quick: {
				options: {
					separator: ';',
					stripBanners: true
				},
				src: jsfile,
				dest: 'ui/base.js',
				nonull: true
			}
		},
		clean: {
			map: ["ui/**/*.map"],
		},
		
		uglify: {
			js: {
				
				files: {
					'ui/base.js': 'ui/base.js',
				}
			}
		},
		less: {
			style: {
				files: {
					"ui/base.css": "ui/less/_base.less",
				}
			}
		},
		sass: {
			options: {
				sourceMap: true
			},
			style: {
				files: {
					"ui/base.css": "ui/_sass/base.scss",
					"ui/front/base.css": "ui/front/_sass/base.scss",
					"ui/admin/base.css": "ui/admin/_sass/base.scss",
				}
			}
		},
		cssmin: {
			options: {
				report: "min",
				keepSpecialComments: 0,
				shorthandCompacting: true
			},
			target: {
				files: {
					'ui/base.css': 'ui/base.css',
					'ui/front/base.css': 'ui/front/base.css',
					'ui/admin/base.css': 'ui/admin/base.css',
				}
			}
		},
		postcss: {
			options: {
				map: true,
				processors: [
					require('autoprefixer')({
						browsers: ['last 2 versions']
					})
				]
			},
			build: {
				src: 'ui/**/*.css'
				
			}
		},
		watch: {
			js: {
				files: ['js/*.js'],
				tasks: ['concat:js'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			css: {
				files: ['sass/*.scss'],
				tasks: ['sass:style'],
				options: {
					spawn: false,
					livereload: true
				}
			}
		}
		
	});
	
	
	
	
	
	
	grunt.registerTask('jsmin', ['uglify:js']);
	grunt.registerTask('js', ['concat:js_quick','clean:map']);
	grunt.registerTask('jsmap', ['concat:js']);
	grunt.registerTask('css', ['sass:style']);
	grunt.registerTask('autoprefixer', ['postcss:build']);
	grunt.registerTask('build', ['concat:js','sass:style', 'uglify:js','postcss:build','cssmin','clean:map']);
	grunt.registerTask('default', ['watch']);

};