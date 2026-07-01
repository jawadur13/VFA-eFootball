# VFA Rulebook & AI Chatbot Implementation Plan

## Overview
The goal is to create a dedicated page on the VFA website to display the official rulebook in an organized, easy-to-read format, and integrate a completely free, highly intelligent AI chatbot that acts as the VFA Rules Assistant.

---

## Part 1: Organized Rules Display

Instead of manually converting the 1,800-line Markdown file into HTML every time a rule changes, we will make the website **dynamic**. 

### Approach
1. **New Page (`rules.html`)**: Create a new page with a modern layout (Sidebar on the left, Content on the right).
2. **Dynamic Rendering**: We will use a lightweight JavaScript library (like `marked.js`) to automatically fetch `VFA - eFootball Rulebook.md` and convert it into beautiful HTML directly in the user's browser.
3. **Interactive TOC**: The sidebar will automatically generate a Table of Contents based on the headers in the markdown file, allowing users to jump straight to sections like "Transfers" or "Knockouts".
4. **Benefit**: You only ever need to edit the `.md` file. The website will automatically update itself without you writing a single line of HTML.

---

## Part 2: The "VFA Admin" AI Chatbot (100% Free)

To make the AI completely free while being as smart as ChatGPT, we will use the **Google Gemini API (Free Tier)**. 

### Why Gemini 1.5 Flash?
Traditional chatbots require complex databases to search for documents. However, Gemini 1.5 Flash has a "context window" of 1 million tokens. Our rulebook is roughly 15,000 tokens. This means **we can simply feed the entire rulebook to the AI in every single request** instantly, without paying a dime. 

### The Architecture
1. **The UI (Frontend)**: 
   - A sleek, floating chat bubble in the bottom right corner of the website.
   - Clicking it opens a modern chat window (similar to Intercom or standard customer support bots).
2. **The Security (Backend)**:
   - We cannot put the API Key directly in the HTML (hackers would steal it).
   - Since you use Vercel for hosting, we will create a free **Vercel Serverless Function** (`api/chat.js`). This acts as an invisible middleman that securely holds the API key.
3. **The Prompt Engineering**:
   - The AI will be given a hidden system prompt: *"You are the official VFA Administration Assistant. Your job is to answer manager questions nicely and humanely. You must base your answers STRICTLY on the official rulebook provided below. Do not invent rules. If the rulebook doesn't mention it, tell them to contact the human admins."*
   - We will append the exact text of the Rulebook to this prompt.

---

## Implementation Steps

### Phase 1: Frontend Rules Page
* [ ] Create `rules.html` structure.
* [ ] Import `marked.js` and write a script to fetch the `.md` file and render it.
* [ ] Apply CSS to make the typography look like a premium legal/gaming document.

### Phase 2: Chatbot UI
* [ ] Build the HTML/CSS for the chat widget (bubble, chat box, message bubbles, typing indicator).
* [ ] Write the frontend JavaScript to handle opening/closing the chat and appending user/bot messages to the screen.

### Phase 3: AI Backend Integration
* [ ] Get a free API Key from Google AI Studio.
* [ ] Create an `api/chat.js` file for Vercel.
* [ ] Write the Node.js code to receive the user's message, bundle it with the Rulebook text, and send it to Gemini.
* [ ] Connect the frontend JS to the new `api/chat.js` endpoint.

---

## Cost Breakdown
* **Vercel Hosting**: $0 (Free Tier is more than enough).
* **Gemini API**: $0 (Free Tier allows 15 requests per minute and 1 million tokens per request).
* **Total Cost: $0.00**
