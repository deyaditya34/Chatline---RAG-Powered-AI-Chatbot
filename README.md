# Chatline

Chatline is a terminal-first conversational AI CLI built for Retrieval-Augmented Generation (RAG) and long-term memory. It integrates Google Gemini for model inference, Qdrant for semantic vector search, and Elasticsearch for keyword retrieval.

## Features

- Interactive CLI with conversation and interaction modes
- Google Gemini chat and embedding support
- Qdrant vector database integration for semantic search
- Elasticsearch keyword indexing for hybrid retrieval
- Local conversation persistence and session management
- File/document embedding with reusable search context
- Conversation token limit enforcement and summarization support
- Model switching and status inspection via CLI commands

## Prerequisites

- Node.js 18+ (TypeScript / ESM compatible)
- npm
- Google Gemini API key
- Qdrant running locally at `http://localhost:6333`
- Elasticsearch running locally at `http://127.0.0.1:9200`

## Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd chatline
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
cp .env.example .env
```

4. Edit `.env` and set:

- `GEMINI_API_KEY`
- `DATA_DIR`
- `CONVERSATIONS_DIR`
- `USER_CONVERSATIONS_DIR`
- `MODEL_CONVERSATIONS_DIR`
- `INTERACTIONS_DIR`
- `CONVERSATION_TOKEN_LIMIT`
- `DEFAULT_MODEL`
- `DEFAULT_EMBEDDING_MODEL`
- `DEFAULT_SYSTEM_INSTRUCTION`
- `SEMANTIC_DB_COLLECTION_NAME`
- `ELASTIC_DB_COLLECTION_NAME`
- `MODEL_DISPLAY_NAME`
- `USER_DISPLAY_NAME`
- `USER_CONV_DISPLAY_NAME`
- `DEFAULT_WINDOW_MESSAGE_TURNS`

5. Start local database dependencies if you have not already:

Qdrant:

```bash
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -v ~/.gemini/qdrant:/qdrant/storage \
  qdrant/qdrant:latest
```

Elasticsearch:

```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  docker.elastic.co/elasticsearch/elasticsearch:8.10.0
```

## Running

Start the CLI:

```bash
npm start
```

For development with live TypeScript execution:

```bash
npm run dev
```

The app initializes the local data directories and database indexes on startup.

## CLI Usage

When the app starts, use `/help` to show available commands.

### Main commands

- `/help` — display CLI commands
- `/models` — list available Gemini models
- `/model <name>` — switch the active model
- `/model_info [name]` — show details about a model
- `/status` — show current CLI/session status
- `/conversation_mode <rest|interaction>` — switch conversation mode
- `/clear` — clear the terminal
- `/exit` — quit the CLI

### Conversation and interaction commands

- `/guest_chat` — open an anonymous chat session
- `/new [name]` — create a new conversation or interaction
- `/switch <id>` — switch to an existing conversation or interaction by ID
- `/history <id>` — show conversation or interaction history
- `/list` — list saved conversations or interactions
- `/delete <id>` — delete a conversation or interaction

### Document and storage commands

- `/embed <doc_path>` — embed a document into the current conversation context
- `/delete_coll` — remove the configured Elasticsearch index and cleanup stored collection data

## Architecture

- `src/index.js` — app bootstrap and directory initialization
- `src/command.js` — command dispatcher for CLI input
- `src/ai_models/gemini_model.js` — Gemini API integration and embedding/chat helpers
- `src/databases/qdrant.js` — semantic vector storage and search
- `src/databases/elastic_search.js` — keyword search and document indexing
- `src/repl/` — interactive command implementations and session flows
- `src/conversation/` — conversation persistence, loading, and token management
- `src/retrieval/` — semantic and keyword retrieval helpers

## Data Storage

- Local conversation history is stored under directories configured by environment variables
- Qdrant is used for vector search and semantic retrieval
- Elasticsearch is used for keyword search over stored message and document text

## Notes

- The CLI is designed for experimentation with RAG and long-term chat memory.
- The current implementation uses hard-coded local endpoints for Qdrant and Elasticsearch.
- Use `/help` in the running shell to confirm the available command list.

## License

This project is released under the `ISC` license.

