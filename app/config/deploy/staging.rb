server "146.185.40.21", user: "webadmin", roles: %w{app, web db}, primary: true
set :deploy_to, "/space/www/clintagency/project/data/htdocs/api"
set :pm2_config, 'app/config/pm2/staging.json'