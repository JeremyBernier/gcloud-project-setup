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

  const projectexists = await query("Does this project already exist? (y/N) ");

  if (!projectexists) {
    console.log("Creating project...");
    await exec(`gcloud projects create ${projectName}`);
  }

  await exec(`gcloud config set project ${projectName}`);

  open(
    `https://console.cloud.google.com/billing/linkedaccount?project=${projectName}`
  );

  await query(
    `Please enable billing on your account by going to: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID
    
    When you're finished, press the enter key to continue...`
  );

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

  await exec(`gcloud projects add-iam-policy-binding ${projectName} \
  --member=serviceAccount:${serviceAccountEmail} \
  --role=roles/run.admin

gcloud projects add-iam-policy-binding ${projectName} \
  --member=serviceAccount:${serviceAccountEmail} \
  --role=roles/storage.admin

gcloud projects add-iam-policy-binding ${projectName} \
  --member=serviceAccount:${serviceAccountEmail} \
  --role=roles/iam.serviceAccountUser`);

  console.log("Generating key.json");
  await exec(`gcloud iam service-accounts keys create key.json \
  --iam-account ${serviceAccountEmail}`);

  console.log("Finished!");

  /************/

  rl.close();
}

init();
