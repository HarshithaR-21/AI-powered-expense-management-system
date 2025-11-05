# AI-powered Expense Management System - Equishare

AI-powered Expense Management System is a web application that helps groups of friends or colleagues easily split expenses, track payments, and settle up. It includes AI-generated summaries and insights to make expense tracking clearer and more actionable.

## Features

- Create plans for events or shared activities
- Add friends / members to a plan
- Add expenses: group (equal / different) or individual payments
- Automatic settlement calculation (who owes whom)
- AI-generated summaries & insights for expense history
- View, edit, and delete expenses and plans

## Tech Stack

- Frontend: React.js (hooks), Axios, TailwindCSS
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- AI Integration: OpenAI API (optional features)

## Quick Start

### Prerequisites
- Node.js & npm
- MongoDB (local or Atlas)
- Git

### Install
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd <project-directory>
   ```

2. Install backend dependencies:
   ```sh
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```sh
   cd ../client
   npm install
   ```

### Environment
Create a `.env` in the `server` folder:
```
MONGO_URI=<your-mongodb-connection-string>
PORT=8080
JWT_SECRET=<your-jwt-secret>
OPENAI_API_KEY=<your-openai-api-key>   # optional
```
(Optional) create `REACT_APP_API_BASE_URL` in client env if needed:
```
REACT_APP_API_BASE_URL=http://localhost:8080
```

### Run (development)
Start backend:
```sh
cd server
npm run dev
```
Start frontend:
```sh
cd ../client
npm start
```
Open: http://localhost:3000

## API Endpoints (examples)
- POST /auth/register
- POST /auth/login
- POST /plan/add-plan
- GET /plan/get-plans
- GET /plan/get-plan/:id
- POST /expense/add-expense/:planId
- GET /expense/get-expense/:expenseId
- GET /expense/get-expenses/:planId
- DELETE /expense/delete-expense/:expenseId

(See server/controllers for request/response schemas)

## Testing
- Backend tests (if present): `cd server && npm test`
- Frontend tests: `cd client && npm test`

## Troubleshooting
- fatal: 'origin' does not appear to be a git repository — add remote:
  ```sh
  git remote add origin <repo-url>
  git push -u origin main
  ```
- Wrong expense fetched — ensure backend uses `Model.findById(id)` and frontend sends correct `_id`.
- Settlement infinite loop — ensure numeric balances and use `Math.min(creditor, -debtor)` when matching.

## Contributing
1. Fork
2. Create branch: `git checkout -b feat/your-feature`
3. Commit & push
4. Open a PR

## License
MIT — see LICENSE file.

## Contact
Open an issue in the repository for bugs or feature requests.
