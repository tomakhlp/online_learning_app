# Final Project – Learn App

---

## Table of Contents

1. [Description](#description)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Author](#author)
5. [License](#license)

## Description

**Learn App** is a full-stack web application designed to simplify the management of IT trainings. It allows users to register as **students** or **trainers**, upload profile photos, manage their personal accounts and training sessions. This application serves as a tool to streamline the collaborative learning process for both trainers and students.

The **frontend** is built with **React**, **TypeScript**, **Tailwind CSS**, and **Material UI (MUI)** for a modern, responsive, and interactive user interface. It is hosted on **AWS S3** and distributed globally via **AWS CloudFront**.

The **backend** is implemented using the **Serverless Framework**, deployed on **AWS**, and uses **AWS Lambda** for serverless APIs, **AWS DynamoDB** for scalable data storage, and **AWS S3** for storing user profile photos. The entire application architecture focuses on scalability, reliability, and performance.

## Tech Stack

- Frontend:
    - **React**, powered by Vite for fast builds and development.
    - **TypeScript** for maintainable and scalable code through strong type checking.
    - **Tailwind CSS**, a utility-first CSS framework for modern responsive styling.
    - **Material UI (MUI)** for pre-designed UI components.
    - Hosted entirely on **AWS S3** for storing static assets and distributed globally via **AWS CloudFront** for fast delivery.

- Backend:
    - **Node.js** with **Serverless Framework** for deploying serverless architecture.
    - **AWS Lambda** for serverless function execution to handle API requests.
    - **AWS DynamoDB** as the NoSQL database for scalable storage of users, training sessions, and other structured data.
    - **AWS S3** dedicated to storing user profile photos.
    - **AWS CloudFront**, acting as the CDN for both frontend and media assets.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://autocode.git.epam.com/tomakhl99/final-project.git
    ```
   
2. Navigate to the project root folder:
    ```bash
    cd final-project
    ```
   
3. Install dependencies for the frontend:
    ```bash
    cd learn-app
    npm install
    ```
   
4. Install dependencies for the backend:
    ```bash
    cd ../server
    npm install
    ```
5. Rename .env.example from `learn-app` and `server` folders to .env and fill in the required values

6. To run the frontend locally, navigate to the `learn-app` folder and run:
    ```bash
    npm run dev
    ```
   
7. To run the backend locally, navigate to the `server` folder and run:
    ```bash
    npm run offline
    ```
   
8. To deploy the full project to AWS, run the following command from the root folder `final-project`:
    ```bash
    npm run deploy-all
    ```

## Author
This project was developed by **Tamara Khliupkina**
[Git Repository](https://github.com/tomakhlp)

Feel free to contact me for suggestions or collaboration opportunities!

## License
This project is created for educational purposes.  
Please do not use, modify, or distribute the code without the author's permission.

Thank you for understanding!
© Tamara Khliupkina
