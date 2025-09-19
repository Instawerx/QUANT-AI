Agent: web
Goal: Finalize the frontend for the Mission Control platform and ensure it integrates all features with a polished user experience.

Steps:
- Consolidate existing components (e.g., wallet connect, deposit tokens, user balances, admin dashboard) into a coherent navigation flow. Use a modern UI framework (React with Tailwind CSS) to create responsive pages for portfolio management, admin functions, and settings.
- Connect frontend components to the backend API built in previous tasks for contract interactions and Firestore operations. Use Axios or fetch to call API endpoints; handle loading states and errors gracefully.
- Integrate the multi-language translation system across all pages, ensuring that dynamic content from the database is translated or displayed appropriately.
- Implement user authentication and authorization flow based on MetaMask connection and Firestore roles. If a user lacks admin roles, hide or disable administrative features.
- Ensure the frontend reads from the database to display up-to-date user balances, transaction history, and supported tokens; update in real-time using Firestore listeners if appropriate.
- Add a settings page where users can change their preferred language, view connected wallet address, and log out.
- Perform end-to-end tests (e.g., using Cypress or Playwright) covering key user journeys such as connecting wallet, depositing tokens, withdrawing, switching language, and viewing balances.
- Review UI/UX for polish and consistency; adhere to responsive design guidelines.

Acceptance:
- All pages load correctly and integrate with backend and smart contracts on the testnet.
- Multi-language support works across the site.
- End-to-end tests are implemented and passing.
- The UI is responsive and meets design guidelines.
