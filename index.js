// https://cloud.google.com/community/tutorials/cicd-cloud-run-github-actions

import open from "open";
import readline from "readline";
import util from "util";
import child_process from "child_process";
const exec = util.promisify(child_process.exec);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function query(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function init() {
  const projectsListOut = await exec(`gcloud projects list`);
  const projectIds = projectsListOut.stdout
    .split("\n")
    .map((line) => line.split(" ")[0])
    .slice(1)
    .filter((val) => val !== "");

  const projectIdsMap = new Set(projectIds);

  console.log("Google Cloud Project IDs", projectIds);

  const projectId = await query("Project ID: ");

  if (!projectIdsMap.has(projectId)) {
    await query(
      "Project does not exist so new project will be created (press enter to continue)"
    );
    console.log("Creating project...");
    await exec(`gcloud projects create ${projectId}`);
    console.log("Project created!");
  }

  await exec(`gcloud config set project ${projectId}`);

  console.log("Enabling Cloud Resource Manager API");

  await exec(`gcloud services enable cloudresourcemanager.googleapis.com`);

  open(
    `https://console.cloud.google.com/billing/linkedaccount?project=${projectId}`
  );

  await query(
    `Please enable billing on your account by going to: https://console.cloud.google.com/billing/linkedaccount?project=${projectId}
    
    When you're finished, press the enter key to continue...`
  );

  console.log("Enabling Cloud Build, Cloud Run, and Container Registry APIs");

  await exec(
    `gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com`
  );

  const serviceAccountName = await query(
    `Service account name (must be between 6-30 characters): `
  );
  const serviceDescription = await query(`Service description: `);
  const serviceDisplayName = await query(`Service display name: `);

  console.log(`Creating service account...`);

  await exec(`gcloud iam service-accounts create "${serviceAccountName}" \
  --description="${serviceDescription}" \
  --display-name="${serviceDisplayName}"`);

  const serviceAccountEmail = `${serviceAccountName}@${projectId}.iam.gserviceaccount.com`;
  console.log(`Service account email: ${serviceAccountEmail}`);

  console.log(
    "Granting the service account Give the service account Cloud Run Admin, Storage Admin, and Service Account User roles."
  );

  await exec(`gcloud projects add-iam-policy-binding ${projectId} \
  --member=serviceAccount:${serviceAccountEmail} \
  --role=roles/run.admin

gcloud projects add-iam-policy-binding ${projectId} \
  --member=serviceAccount:${serviceAccountEmail} \
  --role=roles/storage.admin

gcloud projects add-iam-policy-binding ${projectId} \
  --member=serviceAccount:${serviceAccountEmail} \
  --role=roles/iam.serviceAccountUser`);

  console.log("Done");

  console.log("Generating key.json");
  await exec(`gcloud iam service-accounts keys create key.json \
  --iam-account ${serviceAccountEmail}`);

  console.log("Finished!");

  console.log("-------");
  console.log(
    "When setting up CI/CD (eg. with GitHub actions), use the following variables:"
  );
  console.log(`GCP_PROJECT_ID=${projectId}`);
  console.log(`GCP_EMAIL=${serviceAccountEmail}`);
  console.log(`GCP_CREDENTIALS=<Insert key.json contents>`);

  /************/

  rl.close();
}

init();
