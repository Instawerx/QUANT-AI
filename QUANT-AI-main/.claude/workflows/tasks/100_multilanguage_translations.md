Agent: web
Goal: Implement multi-language translation based on user location/IP and preferences.

Steps:
- Choose a localization/internationalization library (e.g., i18next or react-i18next) to manage translations within the frontend. Set up language detection that uses the browser's locale or IP geolocation to default to a user's native language, while still allowing users to switch languages manually.
- Create translation resource files for the primary target languages (for example, English, Spanish, French, Chinese) covering all text within the application (frontend). These translations should be stored in a structured format (e.g., JSON). Include placeholders for additional languages.
- Update the front-end components to replace hard-coded text with translation keys and to handle dynamic text retrieval through the i18n system.
- Implement server-side support (if needed) for geolocation: an API endpoint that infers the user's region via IP (e.g., using the `request-ip` or a geolocation service) and returns the recommended language. Document that user consent should be respected and that fallback to English occurs when language detection fails.
- Ensure that all database-stored text fields that need translation are stored in a language-agnostic way (e.g., using Firestore collections with nested language keys or a translations subcollection) so that translations can be served from the backend if necessary.
- Write tests to verify that language detection, switching, and fallback behavior work correctly and that components display the correct translations.

Acceptance:
- The front-end successfully detects the user’s preferred language or IP-based location and loads the correct translation resources.
- Users can override the detected language via a settings menu.
- All UI text is translatable and appears correctly in each supported language file.
