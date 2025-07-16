# Gemini Frontend Clone

A fully functional, responsive frontend for a Gemini-style conversational AI chat application.

## Demo Link
https://faiz877.github.io/ai-chat/

## 📦 Project Overview
- OTP-based login/signup with country code selection
- Chatroom management (create, delete, search)
- Conversational UI with user/AI messages, timestamps, typing indicator, and image upload
- Infinite scroll, pagination, and throttled AI responses
- Mobile responsive, dark mode, and persistent state
- Built with React, Zustand, React Hook Form, Zod, and TailwindCSS

## Screenshots
<img width="1366" height="572" alt="image" src="https://github.com/user-attachments/assets/3cfeb109-5656-4ca0-86dd-c79d29633d44" />
<br>
<br>
<br>
<img width="1362" height="657" alt="image" src="https://github.com/user-attachments/assets/e97d04a1-0e19-443e-aa45-ac3e90f0f702" />
<br>
<br>
<br>
<img width="1366" height="655" alt="image" src="https://github.com/user-attachments/assets/f0eeade2-2762-48fb-8d5d-588ed863d797" />
<br>
<br>
<br>

## 🛠️ Setup & Run Instructions

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/gemini-frontend-clone.git
   cd gemini-frontend-clone
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Run the app locally:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Build for production:**
   ```bash
   npm run build
   # or
   yarn build
   ```
5. **Preview production build:**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

---

## 📁 Folder/Component Structure

```
src/
├── components/
│   ├── Auth.tsx              # OTP login/signup UI
│   ├── Dashboard.tsx         # Main dashboard, chatroom list, layout
│   ├── ChatroomInterface.tsx # Chat UI, messages, input, image upload
│   └── ...                   # Other UI components
├── store/
│   ├── authStore.ts          # Zustand store for authentication
│   ├── chatStore.ts          # Zustand store for chatrooms/messages
│   └── themeStore.ts         # Zustand store for dark/light mode
├── App.tsx                   # App entry, routing, theme
├── main.tsx                  # React root
├── index.css                 # TailwindCSS and global styles
└── ...
```

---

## ⚡ Feature Implementation Details

### Throttling (AI Response Delay)
- AI responses are simulated using `setTimeout` with a random delay (1.5–2.5s) to mimic real AI thinking time and prevent spamming.
- See `ChatroomInterface.tsx` for the throttling logic.

### Pagination & Infinite Scroll
- Messages are paginated client-side (20 per page).
- Reverse infinite scroll: when you scroll to the top, older messages are loaded (simulated with dummy data).
- See `ChatroomInterface.tsx` for scroll and pagination logic.

### Form Validation
- Login form uses React Hook Form + Zod for schema-based validation.
- Country code and phone number are validated before OTP is simulated.
- See `Auth.tsx` for validation logic.
