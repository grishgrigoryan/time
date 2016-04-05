module.exports = function(grunt) {
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		watch: {
			css: {
				files: ['resources/assets/sass/**/*.scss'],
				tasks: ['sass:dev','csssplit']
			},
			tpl : {
				files: ['resources/assets/templates/**/*.tpl']
			},
			scripts : {
				files: ['resources/assets/js/**/*.js']
			},
			fonts : {
				files: ['resources/assets/fonts/**/*']
			},
			images : {
				files: ['resources/assets/images/**/*']
			}
		},
		uglify: {
			default: {
				files: {
					'public/js/bundle.js': ['public/js/libs/angular.js','public/js/libs/angular-animate.js','public/js/libs/angular-aria.js','public/js/libs/angular-route.js',
											'public/js/libs/angular-material.js','public/js/libs/angular-table.js','public/js/service/UserService.js','public/js/app.js','public/js/controller/Controller.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('build',['uglify']);
};