# Relay — Real-Time Chat

Relay is a multi-room real-time chat application built with **Node.js, Express, Socket.IO, HTML, CSS, and vanilla JavaScript**.

## Features

- Real-time messaging
- Multiple chat rooms
- Online user list
- Room user counts
- Join / leave presence messages
- Typing indicators
- In-memory message history
- Responsive desktop/mobile interface
- Enter to send / Shift+Enter for newline

## Tech Stack

| Technology | Usage |
| --- | --- |
| Node.js | Server runtime |
| Express | Static server |
| Socket.IO | Real-time communication |
| HTML5 | UI structure |
| CSS3 | Responsive interface |
| JavaScript | Client and server logic |

## Project Structure

```text
relay-realtime-chat/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── screenshots/
├── server.js
├── package.json
└── README.md
```

## Run Locally

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

For a real-time test, open the app in two browser windows and join the same room using different names.

## How It Works

The browser connects to the Node server through Socket.IO. Users join named rooms, and messages are broadcast only to clients inside the same room. The latest 100 messages per room are kept in server memory.

## Future Improvements

- Account authentication
- MongoDB / PostgreSQL persistence
- Private messages
- Read receipts
- File uploads
- Message reactions
- User avatars
- Moderation controls
- Redis scaling

## Maintainer

**Shivesh** — [@sh1vesh](https://github.com/sh1vesh)
