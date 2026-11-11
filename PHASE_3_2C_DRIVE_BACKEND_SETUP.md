# SpeakLab AI · Drive backend preparation (3.2C-2)

## Status
This change adds a **readiness endpoint only**: `GET /api/google-drive/status`.
It **does not** exchange Google OAuth codes, upload any video, read Google Drive files, or delete Drive files.
The endpoint deliberately responds with `driveConnection: "not_activated"` and `videoUploadEnabled: false`.
Until student authentication and a safe upload flow are implemented, all video remains local to the browser (IndexedDB).

## Existing Preview configuration
- `GOOGLE_CLIENT_ID`: Google OAuth 2.0 web application client ID
- `GOOGLE_DRIVE_FOLDER_ID`: Drive folder ID (configured in Preview)
- A Google OAuth Web client exists for project "SpeakLab AI".
- Teacher controls the private folder "Video app SpeakLab".

## Next server-only secrets (not yet required by readiness endpoint)
- `GOOGLE_CLIENT_SECRET`: OAuth client secret
- `GOOGLE_REFRESH_TOKEN`: offline authorization **after** secure OAuth and folder access are verified

Only save these using Vercel environment variables. Do not prefix with `VITE_`, expose them in a screenshot, print them in logs, or commit them to GitHub.
No refresh token should be created through an insecure/public endpoint, and no student should ever receive the teacher's OAuth token.

## Before enabling Drive upload
1. Establish a **preview callback URI** that matches the deployed Preview URL (not the production domain) and register that *exact* URI in the Google OAuth client's authorized redirect URIs. The currently registered production callback must not be used for the branch test before the backend exists.
2. Implement a one-time **teacher-only** OAuth consent flow with CSRF protection and secure token storage. Do not rely on a static public setup link.
3. Verify the `drive.file` scope grants app access to this **pre-existing folder**. Folder ID alone is insufficient; Google Picker or another explicit authorization step may be needed.
4. Implement login and server-side authorization for actual students. The current React app has mock user data, NOT a production-grade authentication model.
5. Implement chunked/resumable transfer of video. Vercel Functions have a 4.5 MB request/response payload limit; NEVER upload a full video via a single Function request.
6. Store the mapping of each session and authenticated owner to a Drive file ID in a server-managed database with access controls. Do not trust a client-provided userId or fileId for delete.
7. Provide authenticated video playback (avoid public Drive share links). On deletion, trash the **verified owned file** in Drive before marking the record deleted.
8. Keep a local backup and clear error states when upload fails; report “Đã đồng bộ Google Drive” only after Drive and metadata persistence succeed.
9. Run end-to-end validation on isolated Preview before touching `main`.

## About OAuth Testing
Google OAuth external apps in Testing may have refresh tokens expiring in seven days for sensitive/non-basic scopes. Plan production authorization and verification as needed; don't promise indefinite background syncing while Testing.

## Quick check
After Preview deploy, open `https://<your-actual-preview-host>/api/google-drive/status`.
Expected JSON includes `driveConnection: "not_activated"`. This checks the endpoint exists only; it does NOT confirm Google authorization.

## Security
**Never paste client secret, token, or admin access credentials in ChatGPT or GitHub issues.**
