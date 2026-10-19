# Tweetsmith (MERN)

Type in a brand brief. Get a short brand voice summary and 10 on-brand tweets.

- **MongoDB** saves your last generations (optional).
- **Express + Node** takes the brief, builds the prompt, calls the AI, cleans the reply.
- **React (Vite)** has the form, the voice summary and the tweet cards.

## What you need

1. Node.js 18 or newer (check with `node -v`).
2. An AI API key. Anthropic (Claude) is the default. OpenAI also works.
3. MongoDB is optional. Without it, everything works except the "Recent generations" list.

## Run it

Open the folder in VS Code, then open the terminal (Ctrl + `).

```bash
# 1. Install everything (root, server and client)
npm run install-all

# 2. Create your settings file
#    Windows:  copy server\.env.example server\.env
#    Mac/Linux: cp server/.env.example server/.env
```

Open `server/.env` and paste your key:

```
ANTHROPIC_API_KEY=your-key-here
```

Using OpenAI instead? Set `LLM_PROVIDER=openai` and fill `OPENAI_API_KEY`.

```bash
# 3. Start server and client together
npm run dev
```

Open http://localhost:5173 in your browser.

The server runs on http://localhost:5000. Check it at http://localhost:5000/api/health.

## MongoDB (optional)

- **Atlas (free):** create a cluster, copy the connection string into `MONGO_URI` in `server/.env`.
- **Local:** install MongoDB Community and keep the default `mongodb://127.0.0.1:27017/tweetsmith`.
- **Skip it:** delete the `MONGO_URI` line. The app prints "Running without history" and still works.

## How it works

1. The form sends brand name, industry, campaign objective and product details to `POST /api/generate`.
2. `server/utils/prompt.js` builds one prompt with two steps: infer the brand voice, then write 10 tweets (3 engaging, 2 promotional, 3 witty, 2 informative).
3. `server/utils/llm.js` calls the AI and reads the JSON reply.
4. `server/utils/normalize.js` cleans the reply into a fixed shape.
5. The result is saved in MongoDB (if connected) and sent back to React.

## Folder map

```
tweetsmith-mern/
  package.json            run-everything scripts
  server/
    server.js             Express app and MongoDB connection
    routes/generate.js    POST /api/generate and GET /api/history
    models/Generation.js  Mongoose schema
    utils/prompt.js       the prompt (edit this to change the tweets)
    utils/llm.js          Anthropic and OpenAI calls
    utils/normalize.js    reply cleanup
    .env.example
  client/
    index.html
    vite.config.js        proxies /api to port 5000
    src/
      App.jsx
      api.js
      components/         BriefForm, VoicePanel, TweetList, History
      styles.css
```

## Test with two brands (for the submission)

Press the **Zomato** example, generate, and take a screenshot. Then press **Tanishq**, generate, and take another. The tone should change clearly between the two.

## Put it online (for a live link)

- **Server:** deploy the `server` folder on Render or Railway. Add the same values as in `.env` as environment variables. Start command: `npm start`.
- **Client:** deploy the `client` folder on Vercel or Netlify. Add `VITE_API_URL` set to your server's address (for example `https://your-server.onrender.com`). Build command: `npm run build`. Output folder: `dist`.

## Common problems

- **"ANTHROPIC_API_KEY is missing":** the key is not in `server/.env`, or the file is named `.env.example` still.
- **Page loads but Generate fails:** the server is not running. Check the terminal for errors.
- **"MongoDB not reachable":** fine to ignore, or fix `MONGO_URI`.
- **Port already in use:** change `PORT` in `server/.env` and the proxy target in `client/vite.config.js`.
