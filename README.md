Premium Calculation Project
This project consists of two applications: a backend service developed with NestJS and a frontend application using jQuery. The backend provides a service to calculate premiums, and the frontend collects user information through a form and calculates the premium using the backend service.

Backend
The backend is developed using NestJS and exposes an API to calculate premiums. Swagger documentation is available at http://localhost:3000/api.

Setup
Navigate to the backend directory:

bash
Copy code
cd backend
Install dependencies:

bash
Copy code
npm install
Start the backend server:

bash
Copy code
npm start
The backend will run on port 3000.

Frontend
The frontend is a web application that uses jQuery to provide a form for collecting user information and calculating premiums using the backend service.

Setup
Navigate to the frontend directory:

bash
Copy code
cd frontend
Install dependencies:

bash
Copy code
npm install
Start the frontend server:

bash
Copy code
npm start
The frontend will run on port 3001.

Usage
Start the backend server.
Start the frontend server.
Open your browser and navigate to http://localhost:3001.
Fill out the form with the user's information and submit to calculate the premium using the backend service.
Notes
Ensure both the backend and frontend servers are running before attempting to use the application.
For now, you need to manually start each project in separate terminal windows.
Thank you for using our project!

This README provides a clear overview of the project, setup instructions for both the backend and frontend, and usage notes.
