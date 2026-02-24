<<<<<<< HEAD
# DevPilot-Studio
=======
# DevPilot Studio

AI-powered Developer + Enterprise Command Center built with Angular 21.

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Key:**
   Add your Anthropic Claude API key to `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     claudeApiKey: 'your_key_here',
     // ...
   };
   ```

3. **Run locally:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🛠 Features

### Developer Tools
- **Code Assistant:** Explain, refactor, and improve code.
- **Commit Generator:** Conventional commit messages from diffs.
- **Test Generator:** Unit test suite generation.

### Enterprise Tools
- **Meeting Analyzer:** Summaries, decisions, and action items.
- **Email Drafter:** Professional emails with tone selection.
- **Requirement Summarizer:** PRD to technical breakdown.
- **Performance Review:** Constructive feedback generation.

## 🏗 Tech Stack
- **Framework:** Angular 21 (Standalone API)
- **State:** Angular Signals
- **Styling:** Tailwind CSS v4 + Design Tokens
- **AI:** Anthropic Claude API
- **Persistence:** LocalStorage

## 🌐 Deployment
Deploy to Netlify or Vercel using the provided `netlify.toml` and `_redirects` configuration.
>>>>>>> 415bbf9 (Initial commit)
