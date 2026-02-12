# Toknify - TikTok Video Downloader

Toknify is a web application that allows users to download TikTok videos without watermarks. It provides a simple and intuitive interface for downloading high-quality TikTok videos by just pasting the video URL.

## Features

- Download TikTok videos without watermarks
- Simple and modern user interface
- Responsive design that works on all devices
- Fast and efficient video processing
- No registration required

## Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

## Installation

1. Clone the repository or download the source code

2. Create a virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the Flask development server:
   ```
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## How to Use

1. Copy the URL of the TikTok video you want to download
2. Paste the URL in the input field on the Toknify homepage
3. Click the "Download" button
4. Wait for the video to process
5. Click the "Download HD" button to save the video to your device

## Project Structure

```
TikTokDownloader/
├── app.py                # Main application file
├── requirements.txt      # Python dependencies
├── README.md             # This file
├── static/               # Static files (CSS, JS, images)
└── templates/            # HTML templates
    ├── base.html         # Base template
    └── index.html        # Homepage template
```

## License

This project is for educational purposes only. Please respect TikTok's terms of service and only download videos that you have the right to download.

## Disclaimer

This tool is not affiliated with, maintained, authorized, endorsed, or sponsored by TikTok or any of its affiliates. Use at your own risk.
