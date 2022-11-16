
import * as functions from 'firebase-functions';
export type CallableContext = functions.https.CallableContext;

/* -------------------------------------------------------------------------- */
/*         SETUP - Cloud functions regions, memory alloc and setup         */
/* -------------------------------------------------------------------------- */


export type GoogleCloudFunctionsMemory =
    '128MB'
  | '256MB'
  | '512MB'
  | '1GB'
  | '2GB'
  | '4GB'
  | '8GB'

export const GOOGLE_CLOUD_FUNCTIONS_MEMORY: GoogleCloudFunctionsMemory = '1GB';
export const GOOGLE_CLOUD_FUNCTIONS_REGION = 'europe-west1';

const configuredFunctions = functions
    .region(GOOGLE_CLOUD_FUNCTIONS_REGION)
    .runWith({
      memory: GOOGLE_CLOUD_FUNCTIONS_MEMORY,
      timeoutSeconds: 120,
    });

export type HttpsErrorCode = functions.https.FunctionsErrorCode
export type HttpsResponse = { status: string }
export const HttpsError = (code: HttpsErrorCode, message: string) =>
  new functions.https.HttpsError(code, message);
export const HttpsSuccess: HttpsResponse = {status: 'OK'};

export default configuredFunctions;
