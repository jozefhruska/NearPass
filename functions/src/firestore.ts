import * as admin from 'firebase-admin';
try {
  admin.initializeApp();
  admin.firestore().settings({
    ignoreUndefinedProperties: true,
  });
} catch (alreadyDone) {
  // Nothing to report
}
export default admin.firestore();
export type DocumentData = admin.firestore.DocumentData;
export type DocumentQuery = admin.firestore.Query;
export type DocumentReference = admin.firestore.DocumentReference;
export type DocumentSnapshot = admin.firestore.DocumentSnapshot;
export type FieldValue = admin.firestore.FieldValue;
export type QueryDocumentSnapshot = admin.firestore.QueryDocumentSnapshot;
export type QuerySnapshot = admin.firestore.QuerySnapshot;
export type Transaction = FirebaseFirestore.Transaction;
export const FieldValue = admin.firestore.FieldValue;
