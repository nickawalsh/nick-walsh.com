activate :automatic_image_sizes
activate :directory_indexes
activate :es6
activate :livereload

activate :autoprefixer do |config|
  config.browsers = ['last 2 versions', 'Explorer >= 9']
  config.cascade = false
end

set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'

configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :relative_assets
  activate :gzip
end
