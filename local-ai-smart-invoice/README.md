# 🧾 EU Invoice Engine — Local AI Smart Invoice

**Zero-cloud invoice parser** — drop a scanned invoice image, get structured data instantly.  
OCR + Chrome's built-in Gemini Nano — everything runs locally in your browser.

🌐 **Live:** [chrome-ai.secmy.app](https://chrome-ai.secmy.app)

---

## How It Works

```
Image → Tesseract.js (OCR) → Gemini Nano (AI parsing) → Structured Invoice Fields
```

1. **OCR** — [Tesseract.js](https://github.com/naptha/tesseract.js) extracts raw text from the scanned image (supports EN/DE/FR)
2. **AI Extraction** — Chrome's [Prompt API](https://developer.chrome.com/docs/ai/built-in) (Gemini Nano) parses the OCR text into structured invoice fields
3. **Auto-fill** — sender, receiver, dates, line items, VAT — all populated automatically

No API keys. No server. No data leaves your machine.

## Extracted Fields

| Section | Fields |
|---------|--------|
| **Sender** | Company name, VAT ID, IBAN, BIC/SWIFT |
| **Receiver** | Company name, address, VAT ID |
| **Invoice** | Invoice number, issue date, due date |
| **Line Items** | Description, quantity, unit price, VAT rate, total |

## Requirements

- **Chrome 148+** with [Prompt API](https://developer.chrome.com/docs/ai/prompt-api) enabled
- Node.js (for building)

### Enable Chrome Prompt API

1. Go to `chrome://flags/#optimization-guide-on-device-model` → **Enabled BypassPerfRequirement**
2. Go to `chrome://flags/#prompt-api-for-gemini-nano` → **Enabled**
3. Relaunch Chrome
4. Go to `chrome://components` → find **Optimization Guide On Device Model** → **Check for update**

## Run Locally

```bash
npm install
npm run build
simplehttpserver -https -path ./dist
# Open https://0.0.0.0:8000/
```

> **Note:** The Prompt API requires HTTPS. Serving via `simplehttpserver -https` provides a self-signed cert — accept the browser warning on first visit.

## Dev Mode

```bash
npm run dev
# Opens on http://localhost:3000
# Note: Prompt API may not work without HTTPS in dev mode
```

## Tech Stack

- **React 19** + TypeScript
- **Vite** — build tooling
- **Tailwind CSS v4** — styling
- **Tesseract.js v7** — client-side OCR
- **Chrome Prompt API** — local Gemini Nano inference
- **Lucide React** — icons

## Project Structure

```
src/
  App.tsx     — main app: OCR pipeline, AI integration, invoice form UI
  main.tsx    — React entry point
  index.css   — Tailwind imports + fonts
index.html    — entry HTML with HTTPS redirect
vite.config.ts
```

## License

MIT
