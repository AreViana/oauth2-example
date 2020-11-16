# Deploy Nestjs API to Heroku

## 1) Prepare your project ✨
To prepare our nestjs project to deploy on heroku, make the [following](https://github.com/AreViana/oauth2-example/commit/24d112504b9ce6812ce18a194db160572da830fb) changes:
* Change in `package.json` :
  * Pin your node version in "engines"
  * Add `prestart:prod` command in "scripts"
* Change in `main.ts` :
  * Update our app listener `PORT` to accept the default port of Heroku
* Create a Procfile to run our `start:prod` command
  > By default when you have a `pre` or `post` command, these will be triggered when you run the base command. That means when Heroku runs `yarn start:prod` command specified in our Procfile, It also runs `yarn prestar:prod` before.

## 2) Create a Heroku App 🎉

You can do it directly from the graphical interface of [Heroku](https://dashboard.heroku.com/apps) or use [Heroku CLI](https://devcenter.heroku.com/articles/creating-apps)

## 3) Config the Heroku production enviroment 🔧
Add your enviroment variables:
1. Ensure you are login with the CLI command: `heroku login`
2. Set `heroku config:set NODE_ENV=production`
3. Set `heroku config:set NPM_CONFIG_PRODUCTION=false` (because we are using typescript)
4. Set the rest of your enviroment variables `heroku config:set MY_ENV=MyValue`

## 4) Push your repo 🚀

1. Ensure you are login
2. Add a remote `heroku git:remote -a your-heroku-app-name`
3. Push your repo `git push heroku master`

> Official documentation [steps](https://devcenter.heroku.com/articles/git).