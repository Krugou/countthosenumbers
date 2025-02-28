# Count Those Numbers

A fun and challenging memory game where you need to remember and calculate sequences of numbers. Built with React, TypeScript, and Three.js.

## Features

- 🎮 Interactive 3D number visualization
- 🎯 Multiple difficulty levels
- 🏆 Global leaderboard system
- 🎨 Customizable visual styles
- 🔊 Sound effects and animations
- 📱 Responsive design for all devices

## Tech Stack

- React 18+ with Vite
- TypeScript for type safety
- Tailwind CSS for styling
- Three.js/React Three Fiber for 3D visualizations
- Firebase Authentication and Realtime Database
- React Spring for animations

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/countthosenumbers.git
cd countthosenumbers
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url
```

4. Start the development server:
```bash
npm run dev
```

## Game Rules

1. Choose your difficulty level (Easy, Medium, Hard)
2. Watch the sequence of numbers that appear
3. Calculate the total sum of the numbers
4. Enter your answer before the time runs out
5. Score points based on:
   - Correct answers (base points)
   - Remaining time (time bonus)
   - Current streak (streak bonus)
   - Difficulty level (difficulty multiplier)

## Development

### Project Structure

```
src/
├── components/     # React components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── types/         # TypeScript types
├── utils/         # Utility functions
├── config/        # Configuration files
└── locales/       # Internationalization files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Three.js for 3D graphics
- Firebase for backend services
- React Spring for animations
- Tailwind CSS for styling
- All contributors and supporters
