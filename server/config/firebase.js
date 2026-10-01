import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;
let isConfigured = false;

try {
  // Check for service account key in environment or local file
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
    || path.join(__dirname, 'serviceAccountKey.json');

  let serviceAccount = null;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } else if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  }

  if (serviceAccount && (serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID)) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
    });
    db = admin.firestore();
    isConfigured = true;
    console.log(`[Firebase] Successfully connected to Firebase Project: ${serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID}`);
  } else {
    console.warn('[Firebase] No Service Account credentials detected. Running in graceful local storage mode.');
    console.warn('[Firebase] To connect live Firebase Firestore: Add serviceAccountKey.json in server/config/ or set FIREBASE_SERVICE_ACCOUNT_JSON env.');
  }
} catch (error) {
  console.warn('[Firebase] Initialization notice:', error.message);
  console.warn('[Firebase] Running in fallback storage mode.');
}

export const getFirestoreDb = () => db;
export const isFirebaseReady = () => isConfigured;
export default admin;
