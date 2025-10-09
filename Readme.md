# EquiShare

EquiShare is a web application that helps groups of friends or colleagues easily split expenses, track payments, and settle up. Whether you’re planning a trip, sharing rent, or managing group activities, EquiShare makes expense sharing simple and transparent.

## Features

- **Create Plans:** Start a new plan for any event or group activity.
- **Add Friends:** Invite friends to join your plan.
- **Add Expenses:** Log group expenses with options for equal or custom shares, and individual payments.
- **Automatic Settlements:** Instantly calculate who owes whom and how much.
- **Expense Details:** View detailed breakdowns of each expense.
- **Edit & Delete:** Modify or remove expenses and plans as needed.

## Tech Stack

- **Frontend:** React.js (with hooks), Axios, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB running locally or a MongoDB Atlas account
- Git

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd EquiShare\ Website
   ```

2. **Install backend dependencies:**
   ```sh
   cd server
   npm install
   ```

3. **Install frontend dependencies:**
   ```sh
   cd ../client/equishare
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the `server` directory with your MongoDB URI and any other secrets.

5. **Start the backend:**
   ```sh
   cd server
   npm start
   ```

6. **Start the frontend:**
   ```sh
   cd ../client/equishare
   npm start
   ```

7. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## Usage

1. **Register/Login** to your account.
2. **Create a new plan** and add friends.
3. **Add expenses** as they occur, specifying who paid and how the cost is split.
4. **View settlements** to see who owes whom.
5. **Settle up** and keep your group finances transparent!

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

**EquiShare** – Making group expenses fair and easy!