# 🌤️ AI Weather & Crypto Assistant

An AI-powered assistant that provides real-time weather information and cryptocurrency prices using Google's Gemini AI.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![Gemini AI](https://img.shields.io/badge/Gemini-2.0-purple)

## ✨ Features

- 🌡️ **Real-time Weather** - Get current weather for any city worldwide
- 💰 **Crypto Prices** - Check live cryptocurrency prices (Bitcoin, Ethereum, etc.)
- 🤖 **AI-Powered** - Natural language understanding with Google Gemini
- 🎨 **Modern UI** - Beautiful dark-themed chat interface

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Arju1234n/whethercryto.git
cd whethercryto

# Install dependencies
npm install

# Create .env file with your API key
echo "API_KEY=your_gemini_api_key" > .env

# Start the server
node server.js
```

### Usage

Open your browser and visit: **http://localhost:3000**

Try asking:
- "What's the weather in New York?"
- "Bitcoin price"
- "How's the weather in London?"
- "Ethereum price in INR"

## 📁 Project Structure

```
├── server.js       # Express backend with AI logic
├── index.html      # Frontend chat interface
├── package.json    # Dependencies
└── .env            # API key (not in repo)
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **AI**: Google Gemini 2.0 Flash
- **APIs**: 
  - WeatherAPI (weather data)
  - CoinGecko (crypto prices)
- **Frontend**: HTML, CSS, JavaScript

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serves the chat interface |
| `/api/chat` | POST | Processes AI chat messages |

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `API_KEY` | Your Google Gemini API key |

## 📄 License

MIT License

## 👤 Author

**Arjun Kumar**

---

⭐ Star this repo if you found it helpful!
