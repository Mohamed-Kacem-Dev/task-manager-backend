# TaskManager API

    TaskManager API is a backend application developed with Node.js, Express, and MongoDB, providing user authentication through Google OAuth and managing tasks for authenticated users.

## Features

- **Google Authentication**: Users can sign in using their Google accounts to access their task management system.
- **Task Management**: Create, retrieve, update, and delete tasks associated with individual users.
- **JWT Authentication**: Utilizes JSON Web Tokens for secure authentication after successful Google OAuth.
- **RESTful API**: Built as a RESTful API, providing endpoints for tasks and user authentication.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your_username/task-manager.git
   cd task-manager
   ```

2. Install dependencies:

   npm install

3. Set up environment variables:

   Create a .env file in the root directory.
   Add necessary environment variables, such as MongoDB connection URI, Google OAuth client ID, and client secret.

4. Start the server:

   npm start

## Usage

- **Authentication**:

  - Visit `/auth/google` to initiate Google OAuth authentication.
  - After successful authentication, the user will be redirected to the front end with a JWT token as a query parameter.

- **Task Management**:

  - All endpoints for managing tasks (`/tasks`, `/tasks/:id`, `/tasks/profile`) are protected and require a valid JWT token for access.
  - Include the JWT token in the Authorization header of your requests to authenticate and access these endpoints.
  - Example: `Authorization: Bearer YOUR_JWT_TOKEN_HERE`

  Note: Ensure the token is obtained after successful authentication and stored securely on the frontend for subsequent requests to the backend API.

## Security

    Ensure proper handling of sensitive data like secret keys and credentials.
    Implement HTTPS for secure communication, especially when handling tokens.

## Contributing

    Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests.

## Contact

    For inquiries or feedback, contact Mohamed KACEM at ham.kacem15@gmail.com
