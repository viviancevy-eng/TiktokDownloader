# Toknify - TikTok Video Downloader

Toknify is a simple static web app (HTML/CSS/JS) that helps you download TikTok videos (and audio when available) by pasting a TikTok URL.

## Features

- Download TikTok videos without watermarks
- Download audio (when provided by the upstream API)
- Simple and modern user interface
- Responsive design that works on all devices
- Direct download behavior from the result buttons (tries `fetch -> blob`, falls back to direct link if blocked by CORS)
- No registration required

## Prerequisites

- Any modern browser
- Recommended: run via a local web server (opening via `file:///` may cause CORS issues)

## Setup

1. Clone the repository or download the source code

## Running the Application

Run a local static server, then open the shown URL in your browser.

### Option A (Windows) - Python built-in server

1. Start the server:
   ```
   python -m http.server 8080
   ```

2. Open:
   ```
   http://localhost:8080
   ```

### Option B - VS Code Live Server

1. Install the "Live Server" extension
2. Right click `index.html` -> "Open with Live Server"

## How to Use

1. Copy a TikTok video URL
2. Paste the URL into the input field
3. Click "Download"
4. After the preview appears, click:
   - "Download Video" to download the video
   - "Download Audio" to download audio (if available)

## Project Structure

```
TikTokDownloader/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## License

This project is for educational purposes only. Please respect TikTok's terms of service and only download videos that you have the right to download.

## Disclaimer

This tool is not affiliated with, maintained, authorized, endorsed, or sponsored by TikTok or any of its affiliates. Use at your own risk.
