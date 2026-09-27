/**
 * BIYA FASHION - Google Drive Image Picker Configuration
 * 
 * Instructions:
 * 1. Create a project in Google Cloud Console: https://console.cloud.google.com/
 * 2. Enable Google Drive API and Google Picker API.
 * 3. Create Credentials -> API Key and OAuth 2.0 Client ID (Web Application).
 * 4. Add your website's origin (e.g., http://localhost:5173) to Authorized JavaScript origins.
 * 5. Replace the placeholder values below.
 * 
 * If not configured, the app seamlessly falls back to direct Image URL inputs.
 */

export const GOOGLE_DRIVE_CONFIG = {
  GOOGLE_API_KEY: "", // e.g. "AIzaSy..."
  GOOGLE_CLIENT_ID: "", // e.g. "xxxxxxxx.apps.googleusercontent.com"
  GOOGLE_APP_ID: "", // e.g. "123456789012"
  SCOPE: ["https://www.googleapis.com/auth/drive.readonly", "https://www.googleapis.com/auth/drive.file"],
};

/**
 * Returns true if valid Google Drive credentials have been configured
 */
export const isGoogleDriveConfigured = () => {
  return (
    Boolean(GOOGLE_DRIVE_CONFIG.GOOGLE_API_KEY) &&
    GOOGLE_DRIVE_CONFIG.GOOGLE_API_KEY !== "YOUR_GOOGLE_API_KEY_HERE" &&
    Boolean(GOOGLE_DRIVE_CONFIG.GOOGLE_CLIENT_ID) &&
    GOOGLE_DRIVE_CONFIG.GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE"
  );
};

export default GOOGLE_DRIVE_CONFIG;
