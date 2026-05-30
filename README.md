# News Guard

News Guard is a cutting-edge, AI-powered misinformation detection platform designed to restore trust in digital journalism. In an era dominated by rapid information flow and viral stories, News Guard empowers users to instantly evaluate the credibility of news articles, social media posts, and online videos. By combining the power of the Gemini 2.5 Flash model with live Google Search grounding, it cross-references claims against trusted global sources in real-time. News Guard crawls and parses data from platforms like Reddit, Twitter/X, and YouTube, extracting core claims and analyzing them for factual accuracy, political bias, emotional sentiment, and reading complexity.

---

## 🌟 Key Features

* **Multi-Platform Scrapers**: Built-in support for scraping and parsing content from **Reddit**, **Twitter/X**, **YouTube**, and standard news articles.
* **AI-Powered Credibility Analysis**: Uses Google Gemini API to analyze the extracted text.
* **Google Search Grounding**: Performs live search query matching to verify statements against the entire web.
* **Detailed Claim Verification**: Explodes articles into atomic claims, checking if they are *Verified*, *False*, or *Unverified* with detailed evidence.
* **Insightful Metrics**:
  * **Political Bias Meter** (Far Left to Far Right)
  * **Freshness & Recency Score**
  * **Reading Level Complexity** (Grade classification)
  * **Emotional Sentiment Mapping** (Fear, Anger, Neutral, Positive)
  * **Red Flags Detection** (Sensationalism, clickbait, missing author credentials, etc.)
* **Shareable Verdict Cards**: Export interactive credibility cards as PNG images to share on social media.

---

## 🛠 Tech Stack

* **Frontend**: React 19, Tailwind CSS (v4), Lucide React (Icons), Motion/React (Animations), Cobe (3D interactive globe)
* **Build Tool**: Vite 8
* **AI / Grounding**: Google Gemini API (`@google/generative-ai`)
* **Dev Server Middleware**: Vite custom middleware handler for serverless API simulation

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have Node.js installed (v18+ recommended) on your machine.

### 📥 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adisxix/News-Guard.git
   cd News-Guard
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### 🔑 Environment Configuration

Create a `.env` file in the root directory of the project and add your Gemini API Key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 🏃 Running the Project

Start the local development server:
```bash
npm run dev
```

The application will run at `http://localhost:5173/`.

### 📦 Building for Production

To compile and bundle the assets:
```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see below for details:

```text
MIT License

Copyright (c) 2026 Aditya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
