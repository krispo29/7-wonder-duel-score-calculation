# 7 Wonders Duel - Score Calculator

This is a web-based score calculator for the popular board game, 7 Wonders Duel. Built with React and Vite, this application provides a clean and intuitive interface for players to tally their final scores quickly and accurately.

The user interface is primarily in Thai.

![image](https://github.com/user-attachments/assets/e5de71a1-17c4-4734-a54a-1d1205f83899)


## ✨ Features

- **Dual Player Score Tracking**: Input scores for two players side-by-side.
- **Comprehensive Score Categories**: Includes all in-game scoring categories:
    - Military
    - Civilian Buildings (Blue Cards)
    - Wonders
    - Progress Tokens
    - Commercial Buildings (Yellow Cards)
    - Guilds (Purple Cards)
    - Coins (automatically calculates 1 point per 3 coins)
- **Automatic Winner Calculation**: The application automatically determines the winner based on the highest total score.
- **Tie-Breaker Logic**: Correctly handles tie-breakers by comparing civilian building scores.
- **Instant Victory Conditions**: Special buttons to declare a winner by Military or Scientific Supremacy.
- **Responsive Design**: A clean, modern, and responsive layout that works on desktop and mobile devices.
- **Reset Functionality**: Easily start a new game with a single click.

## 🛠️ Technologies Used

- **Frontend**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18.x or higher recommended)
- npm or yarn

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/7-wonder-duel-calculator.git
    cd 7-wonder-duel-calculator
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```

    The application will be available at `http://localhost:5173` (or the next available port).

### Building for Production

To create a production-ready build, run:

```sh
npm run build
```

This will create a `dist` folder with the optimized static assets.
