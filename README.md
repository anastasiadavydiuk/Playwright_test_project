# Playwright Test Project

Fullstack pet project based on the RealWorld Conduit app with automated UI and API testing using Playwright.

## Tech Stack

### Application

- React
- Vite
- Express.js
- Sequelize
- MySQL

### Test Automation

- Playwright
- TypeScript
- Page Object Model
- API helpers
- Faker

## Project Structure

backend/ # Express + Sequelize backend
frontend/ # React + Vite frontend
playwright-project/ # Playwright UI and API tests

Prerequisites

Before running the project, make sure you have:

Git
Node.js
npm
MySQL
Recommended Versions
Node.js 20.19.0+
npm 10+

## Installation

Clone the repository:
git clone git@github.com:anastasiadavydiuk/playwright_test_project.git
cd playwright-project

npm install
cd playwright-project && npm install
cd ..

## Environment Configuration

Create a .env file in the project root.

PORT=3001
JWT_KEY=supersecretkey_example

DEV_DB_USERNAME=root
DEV_DB_PASSWORD=
DEV_DB_NAME=database_development
DEV_DB_HOSTNAME=127.0.0.1
DEV_DB_DIALECT=mysql
DEV_DB_LOGGGIN=true

Database Setup

Create databases in MySQL:

CREATE DATABASE database_development;

npm run sqlz -- db:migrate

## Run the Application

Start the backend and frontend:

npm run dev

Application URLs:
Frontend: http://localhost:3000
Backend API: http://localhost:3001/api

Run Playwright Tests
Go to the Playwright project:

cd playwright-project
npx playwright test
npx playwright test --ui

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [RealWorld](https://realworld.io/)
- [RealWorld (GitHub)](https://github.com/gothinkster/realworld)
- [CodebaseShow](https://codebase.show/)
- [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
