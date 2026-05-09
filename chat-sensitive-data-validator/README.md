# 🛡️ Chat Guard — Sensitive Data Validator

Client-side chat guard that uses Chrome's **local Gemini Nano** to detect credit card numbers in messages before they're "sent".

🌐 **Live:** [chrome-ai.secmy.app](https://chrome-ai.secmy.app)

---

## How It Works

```
User message → Gemini Nano (YES/NO: contains credit card?) → Block or Allow
```

- **Blocked** — "You included sensitive information, the message was not sent"
- **Allowed** — "Message sent, awaiting response"

No API keys. No server. No data leaves your machine.

## Requirements

- **Chrome 148+** with [Prompt API](https://developer.chrome.com/docs/ai/prompt-api) enabled

## Run Locally

```bash
simplehttpserver -https .
# Open https://0.0.0.0:8000/
```

No build step — plain HTML/CSS/JS.

## Files

```
index.html   — page structure + info modal
style.css    — dark-themed chat UI
script.js    — Prompt API integration + chat logic
```
