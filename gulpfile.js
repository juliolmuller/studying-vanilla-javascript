
// Importar recursos do 'gulp'
const gulp = require('gulp')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglifyJS = require('gulp-uglify')
const del = require('del')

// Listar browsers suportados
const BROWSERS_VERSIONS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
]

// Definir tarefa 'pages'
gulp.task('pages', () => {
  return gulp.src('app/**/*.html')      // Selecionar todos os arquivos HTML
    .pipe(htmlmin({                     // Minificar arquivos HTML
      collapseWhitespace: true,           // Remover quebra de linhas e espaços em branco em excesso
      removeComments: true,               // Remover comentários
      minifyCSS: cleanCSS(),              // Minificar tags e atributos 'style'
      minifyJS: uglifyJS()                // Minificar tags e atributos 'script'
     }))
    .pipe(gulp.dest('public'))          // Salvar arquivo gerado na pasta 'public'
})

// Definir tarefa 'styles'
gulp.task('styles', () => {
  return gulp.src('app/**/*.css')       // Selecionar todos os arquivos CSS
    .pipe(autoprefixer({                // Transpilar CSS para melhorar compatibilidade para browsers antigos
      browsers: BROWSERS_VERSIONS
    }))
    .pipe(cleanCSS())                   // Minificar arquivos CSS
    .pipe(concat('styles.min.css'))     // Concatenar multiplos arquivos em um único
    .pipe(gulp.dest('public/css'))      // Salvar arquivo gerado na pasta 'public'
})

// Definir tarefa 'scripts'
gulp.task('scripts', () => {
  return gulp.src([                     // Selecionar todos os arquivos JavaScript
    'app/js/utils/**/*.js',               // 1º. Selecionar bibliotecas de recursos
    'app/js/model/**/*.js',               // 2º. Selecionar recursos de modelo de negócio
    'app/js/controller/**/*.js',          // 3º. Selecionar controladores
    'app/js/**/*.js'                      // 4º. Selecionar demais recursos e 'index.js'
  ])                                    
    .pipe(babel({                       // Transpilar JavaScript para melhorar compatibilidade para browsers antigos
      presets: ['@babel/env']
    }))
    .pipe(uglifyJS())                   // Minificar arquivos JavaScript
    .pipe(concat('scripts.min.js'))     // Concatenar multiplos arquivos em um único
    .pipe(gulp.dest('public/js'))       // Salvar arquivo gerado na pasta 'public'
})

// Definir tarefa 'assets'
gulp.task('assets', () => {
  return gulp.src('app/assets/**/*.*')      // Selecionar todos os demais tipos de arquivos
    .pipe(gulp.dest('public/assets'))   // e copiá-los para a pasta 'public'
})

// Definir tarefa 'clean'
gulp.task('clean', () => {
  return del(['./public/**', '!./public'])
})

// Definir tarefa principal
gulp.task('default', 
  gulp.series('clean',
    gulp.parallel(
      'pages',
      'styles',
      'scripts',
      'assets'
    )
  )
)
