# **App Name**: API Inspector

## Core Features:

- API Status Check: Button to check the status of the backend API endpoint: GET /
- Create Customer: Form to create a new customer using the POST /customers endpoint.
- Create Account: Form to create a new account using the POST /accounts endpoint, with a dropdown for 'checking' or 'savings'.
- Make Transaction: Form to create a new transaction using the POST /transactions endpoint, with a dropdown for 'credit' or 'debit'.
- Check Balance: Form to check account balance using the GET /accounts/:accountId/balance endpoint.
- Get Statement: Form to get account statement using the GET /transactions/:accountId endpoint.
- API Results Display: A text area (pre tag) to display JSON results or error messages from the API.

## Style Guidelines:

- Background color: Dark gray (#222222) for a modern dark mode theme.
- Primary color: Teal (#008080) to provide contrast.
- Accent color: Cyan (#00FFFF) for highlighting interactive elements and important information.
- Body and headline font: 'Inter', a sans-serif font that provides a modern and clean look and readability for the interface.
- Two-column layout with actions on the left and API results on the right.
- Minimal icons for buttons to improve usability.
- Subtle transitions and animations for feedback on button clicks and form submissions.