# Google Cloud project setup script for CI/CD

This is a simple script that runs through the steps you'd need to go through to set up CI/CD (Continuous Integration / Continuous Deployment) with Google Cloud. Necessary for any CI/CD (eg. GitHub Actions).

Basically it runs through the steps in this [tutorial](https://cloud.google.com/community/tutorials/cicd-cloud-run-github-actions) up until Step 8 where the `key.json` file is generated.

1. Creates a new project (or switches to existing project)
2. Sets up billing for the project
3. Enables Cloud Build and Container Registry
4. Creates a service account
5. Gives the service account Cloud Run Admin, Storage Admin, and Service Account User roles
6. Generate a `key.json` file with your credentials, so your CI/CD platform (eg. GitHub Actions) can authenticate with Google Cloud:

Follow the rest of the tutorial to finish setting up CI/CD with GitHub Actions: https://cloud.google.com/community/tutorials/cicd-cloud-run-github-actions

Note: I whipped this up in an hour, so don't expect anything elaborate or comprehensive. If anything you can just use this as a reference.

## Instructions

```
npm start
```