# TDC Vibecode

TDC Vibecode is a full-stack application designed to help users showcase their professional skills, discover job opportunities, and connect with others through skill endorsements.

Key Features:
*   User profiles with detailed skill listings and proficiency ratings.
*   A platform for posting and finding job opportunities.
*   Skill endorsement system to validate expertise.
*   Search functionality to find users based on specific skills and ratings.

## Tech Stack

**Backend:**
*   Node.js
*   Express.js
*   MongoDB (with Mongoose)
*   TypeScript
*   Clerk (for authentication)

**Frontend:**
*   React
*   Vite
*   Tailwind CSS
*   TypeScript
*   Clerk (for authentication)

**Mobile:**
*   React Native
*   Expo

## Project Structure

The project is organized into three main directories:

*   `backend/`: Contains the server-side application, including API routes, database models, authentication logic, and API documentation.
*   `frontend/`: Contains the web application built with React, Vite, and Tailwind CSS. This is the primary user interface for desktop and web users.
*   `mobile/`: Contains the mobile application built with React Native and Expo, providing a native mobile experience.

## Setup and Installation

To get TDC Vibecode up and running, you'll need to set up each component (backend, frontend, and mobile) separately.

**Prerequisites:**
*   Node.js (version specified in individual `package.json` files or latest LTS)
*   npm or yarn
*   MongoDB instance (local or cloud-hosted)

**General Steps for Each Component (`backend/`, `frontend/`, `mobile/`):**

1.  **Navigate to the component directory:**
    ```bash
    cd <component_directory>
    # e.g., cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up environment variables:**
    *   Each component that requires environment variables (typically `backend/` and `frontend/`) will have a `.env.example` file.
    *   Copy this file to a new file named `.env` in the same directory:
        ```bash
        cp .env.example .env
        ```
    *   Modify the `.env` file with your specific configurations (e.g., database connection strings, API keys for Clerk, etc.).

**Running the Backend (`backend/`):**

*   **Development mode (with hot reloading):**
    ```bash
    npm run dev
    ```
*   **Build for production:**
    ```bash
    npm run build
    ```
*   **Start production build:**
    ```bash
    npm run start
    ```
    The backend server typically runs on `http://localhost:4000` (can be configured in `.env`).

**Running the Frontend (`frontend/`):**

*   **Development mode (with hot reloading):**
    ```bash
    npm run dev
    ```
*   **Build for production:**
    ```bash
    npm run build
    ```
*   **Preview production build:**
    ```bash
    npm run preview
    ```
    The frontend development server typically runs on `http://localhost:5173` (or another port if 5173 is busy).

**Running the Mobile App (`mobile/`):**

*   **Start the Expo development server:**
    ```bash
    npm start
    # or
    # npx expo start
    ```
*   This will open a menu in your terminal. You can then:
    *   Press `a` to run on an Android emulator or connected device.
    *   Press `i` to run on an iOS simulator or connected device.
    *   Press `w` to run in a web browser.
*   Ensure you have the Expo Go app installed on your mobile device if you want to run it directly without emulators.

Please refer to the `package.json` file within each component's directory for other available scripts.

## API Overview

The backend provides a RESTful API to support the application's functionalities, including user management, job postings, and endorsements. Authentication is handled via Clerk.

For a comprehensive list of endpoints, request/response formats, and authentication details, please refer to the API documentation:
*   [API Summary](backend/docs/api-summary.md)
*   [User API Details](backend/docs/users.md)
*   [Job API Details](backend/docs/jobs.md)
*   [Endorsements API Details](backend/docs/endorsements.md)

The base URL for the API in a local development environment is typically `http://localhost:4000`.

## Contributing

Contributions are welcome! If you'd like to contribute to TDC Vibecode, please consider the following:

*   **Reporting Bugs:** If you find a bug, please open an issue in the repository detailing the problem, steps to reproduce, and your environment.
*   **Suggesting Enhancements:** Feel free to open an issue to suggest new features or improvements.
*   **Pull Requests:** If you'd like to contribute code, please fork the repository and submit a pull request with your changes. Ensure your code follows the existing style and includes relevant tests if applicable.

(More detailed contributing guidelines can be added here or in a separate `CONTRIBUTING.md` file as the project evolves.)

## License

*   The `frontend` and `backend` components of this project are licensed under the MIT License. You can find more details in their respective `package.json` files.
*   The license for the `mobile` component is not explicitly stated.

It is recommended to add a `LICENSE` file to the root of the project to clarify the licensing terms for the entire application and ensure consistency.
