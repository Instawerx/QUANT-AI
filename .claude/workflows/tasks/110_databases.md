Agent: gcp
Goal: Design and implement the complete database schema for the Mission Control platform using Firestore.

Steps:
- Review the business requirements of the platform (user authentication, portfolio management, transactions, multi-language support) and design an appropriate Firestore data model. This should include collections such as `users`, `portfolios`, `transactions`, `tokens`, `contracts`, `translations`, and any others needed to support the mission-control features.
- For each collection, define document fields, data types, and relationships (including references to subcollections or nested maps). Use consistent naming conventions and avoid deep nested structures to ensure scalability.
- Generate or update `infra/firestore.indexes.json` to include composite indexes needed for anticipated queries (e.g., queries by user ID and token type, date ranges for transactions).
- Update `infra/firestore.rules` to include read/write permissions for the new collections using role-based access control. Ensure the rules enforce least privilege and maintain default-deny policies.
- Implement Firestore Admin SDK helpers in the backend to create, read, update, and delete documents for each collection. Include data validation (e.g., using zod).
- Write unit tests that verify CRUD operations on the new collections and ensure that security rules behave as expected when accessed from the client.
- Document the data model in a markdown file (e.g., `docs/data_model.md`) with diagrams or tables explaining collections, fields, and relationships.

Acceptance:
- The Firestore data model supports all required features and does not require further migrations.
- Indexes deploy successfully with `firebase deploy --only firestore:indexes`.
- Security rules compile and pass the Firestore emulator tests for permitted and denied operations.
- Tests covering the Firestore helper functions are green.
