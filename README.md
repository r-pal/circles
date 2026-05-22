# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy`

Builds the app, then publishes the `build` folder to the `gh-pages` branch (via the [gh-pages](https://github.com/tschaub/gh-pages) package). Use this for GitHub Pages updates after the one-time setup below.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Deploy to GitHub Pages

This app uses Create React App’s `homepage` field and the `gh-pages` npm scripts in `package.json`.

### One-time setup

1. Push this repository to GitHub (e.g. `r-pal/circles_repo`).
2. In the repo on GitHub: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch **`gh-pages`**, folder **`/ (root)`**, then save.  
   (The `gh-pages` branch is created the first time you run `npm run deploy`.)
5. Set `homepage` in `package.json` to the URL where the site will be served. It must match how GitHub Pages hosts the repo:
   - **Project site** (repo named `circles_repo` on user `r-pal`):  
     `"homepage": "https://r-pal.github.io/circles_repo"`
   - **User/org site** (repo must be named `r-pal.github.io`):  
     `"homepage": "https://r-pal.github.io"`

   Create React App uses this value for asset paths in the production build. If it is wrong, the deployed app will load a blank page or break static files.

### Publish an update

From the project root, on the branch you want to deploy from (usually `main`):

```bash
npm run deploy
```

That runs `npm run build`, then pushes the contents of `build/` to the `gh-pages` branch. GitHub Pages will serve the new build after a short delay (often under a minute).

### Check the live site

Open the URL that matches your `homepage` setting, for example:

- [https://r-pal.github.io/circles_repo](https://r-pal.github.io/circles_repo) (project site)

If something looks wrong after deploy, confirm **Settings → Pages** shows a recent deployment from `gh-pages`, and that `homepage` in `package.json` matches that URL (including the `/circles_repo` path for a project site).

### Notes

- You need permission to push to the remote and to update the `gh-pages` branch (the deploy script uses your local git credentials).
- Local development (`npm start`) does not use `homepage`; only production builds do.
- More detail: [CRA — Deploying to GitHub Pages](https://create-react-app.dev/docs/deployment/#github-pages).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
