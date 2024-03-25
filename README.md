# Google Cloud project setup script for CI/CD with Google Cloud Run

[My full tutorial on setting up Google Cloud Run with CI/CD](https://jeremybernier.notion.site/How-to-Set-Up-Google-Cloud-Run-with-GitHub-Actions-f198229acf1b49788e67e9c2ff0f0e6e)

This is a simple script that runs through the steps you'd need to go through to set up CI/CD (Continuous Integration / Continuous Deployment) with Google Cloud. The script will help you create a new project, or use an existing project.

Basically it runs through the steps in this [tutorial](https://cloud.google.com/community/tutorials/cicd-cloud-run-github-actions) up until Step 8 where the `key.json` file is generated.

1. Creates a new project (or switches to existing project)
2. Sets up billing for the project
3. Enables Cloud Build and Container Registry
4. Creates a service account
5. Gives the service account Cloud Run Admin, Storage Admin, and Service Account User roles
6. Generate a `key.json` file with your credentials, so your CI/CD platform (eg. GitHub Actions) can authenticate with Google Cloud:

Follow the rest of the tutorial to finish setting up CI/CD with GitHub Actions: https://cloud.google.com/community/tutorials/cicd-cloud-run-github-actions

*Note: I whipped this up in an hour, so don't expect anything elaborate or comprehensive. If anything you can just use this as a reference. It works though.*

## Instructions

```
npm install
npm start
```

### FAQ

**I have no idea what this is. What does this do in plain English?**

It creates a new Google Cloud Run project for you, and does all the work you'd need to do to hook it up to CI/CD with GitHub Actions (so that anytime you update your GitHub repo, your deployed service will automatically update with the latest code)

### Say Thanks

- [Buy me a coffee](https://www.buymeacoffee.com/jbernier)
- Personal website: [jbernier.com](https://www.jbernier.com/)
- More dev resources: [codefire.dev](https://codefire.dev/)
