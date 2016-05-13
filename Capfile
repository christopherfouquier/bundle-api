# Change path to config
set :deploy_config_path, 'app/config/deploy.rb'
set :stage_config_path, 'app/config/deploy'

# Load DSL and set up stages
require 'capistrano/setup'

# Include default deployment tasks
require 'capistrano/deploy'

# Include tasks from other gems included in your Gemfile
require 'capistrano/npm'
require 'capistrano/pm2'

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob('lib/capistrano/tasks/*.cap').each { |r| import r }