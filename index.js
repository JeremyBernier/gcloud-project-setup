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
  const projectName = await query("Project name: ");

  const projectExists = await query("Does this project already exist? (y/N) ");

  if (!projectExists || projectExists.toLowerCase() === "n") {
    console.log("Creating project...");
    await exec(`gcloud projects create ${projectName}`);

    console.log("Project created!");
  }

  await exec(`gcloud config set project ${projectName}`);

  console.log("Enabling Cloud Resource Manager API");

  await exec(`gcloud services enable cloudresourcemanager.googleapis.com`);

  open(
    `https://console.cloud.google.com/billing/linkedaccount?project=${projectName}`
  );

  await query(
    `Please enable billing on your account by going to: https://console.cloud.google.com/billing/linkedaccount?project=${projectName}
    
    When you're finished, press the enter key to continue...`
  );

  console.log("Enabling Cloud Build, Cloud Run, and Container Registry APIs");

  await exec(
    `gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com`
  );

  const serviceAccountName = await query(`Service account name: `);
  const serviceDescription = await query(`Service description: `);
  const serviceDisplayName = await query(`Service display name: `);

  console.log(`Creating service account...`);

  await exec(`gcloud iam service-accounts create "${serviceAccountName}" \
  --description="${serviceDescription}" \
  --display-name="${serviceDisplayName}"`);

  const serviceAccountEmail = `${serviceAccountName}@${projectName}.iam.gserviceaccount.com`;
  console.log(`Service account email: ${serviceAccountEmail}`);

  console.log(
    "Granting the service account Give the service account Cloud Run Admin, Storage Admin, and Service Account User roles."
  );

  await exec(`gcloud projects add-iam-policy-binding ${projectName} \
  --member=serviceAccount:${serviceAccountEmail} \
  --role=roles/run.admin

gcloud projects add-iam-policy-binding ${projectName} \
  --member=serviceAccount:${serviceAccountEmail} \
  --role=roles/storage.admin

gcloud projects add-iam-policy-binding ${projectName} \
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
  console.log(`GCP_PROJECT_ID=${projectName}`);
  console.log(`GCP_APP_NAME=`);
  console.log(`GCP_EMAIL=${serviceAccountEmail}`);
  console.log(`GCP_CREDENTIALS=<Insert key.json contents>`);

  /************/

  rl.close();
}

init();
