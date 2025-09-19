Agent: gcp
Steps:
- Generate firestore.rules (rules_version=2) with default deny; allow read/write only with auth and role claims.
- Generate firestore.indexes.json for anticipated queries.
- Add ./infra/firebase.json and .firebaserc.

Acceptance:
- Rules compile and deploy with `firebase deploy --only firestore:rules`.
