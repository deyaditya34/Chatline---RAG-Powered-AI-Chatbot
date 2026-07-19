# Chatline

Chatline is a terminal-first conversational AI CLI built for Retrieval-Augmented Generation (RAG) and long-term memory management. It integrates Google Gemini for model inference, Qdrant for semantic vector search, and Elasticsearch for keyword retrieval—enabling hybrid search capabilities across conversations and documents.

## Features

### Core Capabilities
- **Interactive CLI** with multi-turn conversation and interaction management
- **Google Gemini Integration** with dynamic model switching and token counting
- **Hybrid Search** combining Qdrant semantic search with Elasticsearch keyword indexing
- **Long-term Memory** with persistent conversation and interaction storage
- **Document Management** with file embedding and contextual retrieval
- **Token Management** with automatic limit enforcement and summarization support
- **Multi-mode Support** for guest (anonymous) and registered conversations

### Data Management
- **Conversations** - Full conversation history with user and model turn separation
- **Interactions** - Single Q&A exchange records with response tracking
- **Document Upload** - Embed and search across uploaded documents
- **Dual Storage** - Both file-based and database-backed persistence
- **Session Management** - Switch between conversations and interactions seamlessly

### CLI Commands

**Model Management:**
- `/models` - List available AI models
- `/model <name>` - Switch to a specific model
- `/model_info [name]` - Display detailed model information

**Chat:**
- `/chat <msg>` - Send a one-shot request
- `/guest_chat` - Anonymous chat without conversation persistence

**Conversations:**
- `/new [name]` - Create a new conversation
- `/switch <id>` - Switch to an existing conversation
- `/history` - Display current conversation history
- `/list` - List all saved conversations
- `/delete <id>` - Delete a conversation

**Interactions:**
- `/new_interaction [name]` - Create a new interaction
- `/switch_interaction <id>` - Switch to a different interaction
- `/interaction_history` - Show interaction history
- `/list_interactions` - List all interactions
- `/delete_interaction <id>` - Delete an interaction

**Storage & Retrieval:**
- `/load` - Load a saved chat from storage
- `/embed <doc_path>` - Upload and embed a document
- `/search_document <query>` - Search embedded documents
- `/delete_collection` - Clear database collections

**System:**
- `/help` - Display all available commands
- `/status` - Show current session status

## Architecture

```
src/
├── ai_models/          # Google Gemini integration
├── config/             # Environment and path configuration
├── conversation/       # Conversation persistence and management
├── interaction/        # Interaction storage and retrieval
├── databases/          # Qdrant (semantic) and Elasticsearch (keyword) clients
├── retrieval/          # RAG retrieval pipeline
├── embedding/          # Document embedding utilities
├── repl/               # CLI command handlers
├── cli/                # Output formatting and display
├── types/              # TypeScript interfaces
└── data/               # Local file storage for conversations and interactions
```

## Prerequisites

- **Node.js** 18+ (TypeScript / ESM compatible)
- **npm** or yarn
- **Google Gemini API key** ([Get one here](https://ai.google.dev))
- **Qdrant** running at `http://localhost:6333`
- **Elasticsearch** running at `http://127.0.0.1:9200`

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd chatline
```

2. Install dependencies:

```bash
npm install
```

3. Create and configure environment file:

```bash
cp .env.example .env
```

4. Edit `.env` with the following required variables:

```
GEMINI_API_KEY=your_google_gemini_api_key
DATA_DIR=./data
CONVERSATIONS_DIR=./data/conversations
USER_CONVERSATIONS_DIR=./data/conversations/user
MODEL_CONVERSATIONS_DIR=./data/conversations/model
INTERACTIONS_DIR=./data/interactions
CONVERSATION_TOKEN_LIMIT=8000
DEFAULT_MODEL=gemini-2.0-flash
DEFAULT_EMBEDDING_MODEL=text-embedding-004
DEFAULT_SYSTEM_INSTRUCTION=You are a helpful AI assistant
SEMANTIC_DB_COLLECTION_NAME=chatline_semantic
ELASTIC_DB_COLLECTION_NAME=chatline_keyword
MODEL_DISPLAY_NAME=Model
USER_DISPLAY_NAME=You
USER_CONV_DISPLAY_NAME=User
DEFAULT_WINDOW_MESSAGE_TURNS=10
```

## Setting Up Local Databases

### Qdrant (Semantic Search)

```bash
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -v ~/.qdrant/storage:/qdrant/storage \
  qdrant/qdrant:latest
```

### Elasticsearch (Keyword Search)

```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.10.0
```

## Running

### Production Mode

```bash
npm start
```

Runs the compiled JavaScript from `src/`.

### Development Mode

```bash
npm run dev
```

Runs TypeScript files directly with live execution and auto-recompilation.

### Building

```bash
npm run build
```

Compiles TypeScript to JavaScript.

## Usage

Once started, the CLI initializes required data directories and database collections automatically. Type `/help` to see all available commands.

### Example Workflow

```
> /new my-conversation
Created conversation: my-conversation

> /chat What is machine learning?
[Model response...]

> /embed ./document.pdf
Document embedded successfully

> /search_document machine learning algorithms
[Search results...]

> /history
[Full conversation history...]

> /model gemini-2.0-flash-thinking
Model switched to: gemini-2.0-flash-thinking
```

## Data Storage

- **Conversations** stored in `./data/conversations/` (user and model turn separation)
- **Interactions** stored in `./data/interactions/`
- **Vector Database** indexed in Qdrant for semantic search
- **Keyword Index** maintained in Elasticsearch

## Project Structure

```
chatline/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── command.ts               # Command routing and parsing
│   ├── session.ts               # Session and mode management
│   ├── readline.ts              # User input handling
│   │
│   ├── ai_models/
│   │   └── gemini_model.ts      # Google Gemini client
│   │
│   ├── config/
│   │   ├── ai.ts                # AI model configuration
│   │   ├── database.ts          # Database connection settings
│   │   ├── env.ts               # Environment variables
│   │   └── path.ts              # Directory paths
│   │
│   ├── conversation/            # Conversation management
│   ├── interaction/             # Interaction management
│   ├── databases/               # Qdrant and Elasticsearch clients
│   ├── retrieval/               # RAG retrieval logic
│   ├── embedding/               # Document embedding
│   ├── repl/                    # CLI command implementations
│   ├── cli/                     # Output formatting
│   ├── types/                   # TypeScript interfaces
│   └── data/                    # Local storage
│
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- **@google/genai** - Google Gemini API client
- **@qdrant/js-client-rest** - Qdrant vector database client
- **@elastic/elasticsearch** - Elasticsearch client
- **axios** - HTTP client for token counting
- **dotenv** - Environment variable management
- **uuid** - Unique ID generation
- **typescript** - Language and build tools
- **tsx** - TypeScript execution runtime

## Development

- Install dependencies: `npm install`
- Compile TypeScript: `npm run build`
- Start dev server: `npm run dev`
- Run production: `npm start`

## Environment Variables Reference

See `.env.example` for a complete list. Key variables:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key (required) |
| `DATA_DIR` | Base directory for local data storage |
| `CONVERSATION_TOKEN_LIMIT` | Max tokens per conversation before summarization |
| `DEFAULT_MODEL` | Default Gemini model for chat |
| `DEFAULT_EMBEDDING_MODEL` | Model used for document embeddings |
| `SEMANTIC_DB_COLLECTION_NAME` | Qdrant collection name |
| `ELASTIC_DB_COLLECTION_NAME` | Elasticsearch index name |

## License

ISC

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

