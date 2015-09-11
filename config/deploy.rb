# config valid only for current version of Capistrano
lock '3.4.0'

set :stages, %w[staging production]
set :default_stage, 'staging'

set :application, 'bundle-api'
set :repo_url, 'git@project.clintagency.com:clint-rocket/bundle-api.git'
set :repo_tree, "app/api"
set :tmp_dir, '/usr/local/capistrano/tmp'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default value for :scm is :git
set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
set :pty, true

# Default value for :linked_files is []
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('node_modules')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 3

set :use_sudo, false
set :deploy_via, :remote_cache
set :ssh_options, {:forward_agent => true}

set :npm_flags, '--silent --no-spin'

server "95.131.142.147", user: "sshuser", roles: %w{app, web db}, primary: true

after "deploy:symlink:release", "pm2:restart"