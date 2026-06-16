# Chatline

A lightweight, privacy-focused CLI for interacting with large language models and managing conversational context. Designed for Retrieval-Augmented Generation (RAG) with uploaded documents and past conversations, plus automatic summarization to reduce token usage.

## Key features

- CLI_first conversational AI system running in REPL mode
    - Interactive terminal-based chat experience
    - Command-driven workflow for conversations and document operations
    
- Hybrid RAG on uploaded documents
    - Ingest local files and embed them into both vector database and keyword
      search indexes.
    - Automatic paragraph-based chunking and embedding pipeline.
    - Semantic retrieval using Qdrant vector search.
    - Keyword retrieval using Elasticsearch BM25 search.
    - Hybrid retrieval combining semantic and exact-match results.
    - UUID-based document tracking and deletion support. 

- Hybrid RAG on past conversations
    - Store user prompts and model responses as vector embeddings.
    - Store conversational messages in Elasticsearch for Keyword retrieval.
    - Retrieve semantically relevant past conversations dynamically.
    - Keyword retrieval using Elasticsearch BM25 search.
    - Role-aware reconstruction of retrieved context (user / model).
    - Long-term semantic memory beyond token limits.

- Sliding-window memory architecture
    - Persistent chronological conversation history
    - Temporary active context window for model inference
    - Semantic long-term retrieval layer using Qdrant

- Automatic conversation summarization
    - Summarizes active conversation when token limits are exceeded
    - Maintains compressed working memory for continued interaction
    - Uses semantic retrieval to recover older forgotten details when needed

- Token-aware context management
    - Automatic token counting before model requests
    - Dynamic prompt reconstruction under token constraints
    - Context compression workflow for large conversations

- Semantic context injection
    - Inject retrieved semantic memories directly into model prompts combines:
        - active conversation context
        - retrieved semantic memories
        - uploaded document context
        - current user prompt

- Vector database integration
    - Powered by Qdrant vector database
    - Conversation-aware filtering
    - Document-aware filtering
    - Incremental vector insertion pipeline

- Persistent conversation management
    - Multi-conversation support
    - Conversation switching support
    - Local filesystem persistence for chats and metadata
    - Model version persistence across conversations

- Google Gemini integration
    - Gemini content generation support
    - Gemini embedding model integration
    - Embedding-based semantic search workflow

- Modular Node.js architecture
    - Environment-based configuration support
    - Separation of:
    - conversation management
    - vector operations
    - embedding pipeline
    - model interaction
    - command handling

## Quick start

# Copy the **".env.example"** file and rename it as **".env"**. Modify the values as needed per requirements.
Initialize local workspace
```
# Optional: Run Qdrant (vector DB) via Docker

If you want to use Qdrant as the vector store (recommended for a local, fast remote-style vector DB), run it in Docker and point gemini at it.

Quick Docker run
```
# persistent storage on host, HTTP API exposed on 6333
docker run -d \
    --name qdrant \
    -p 6333:6333 \
    -v ~/.gemini/qdrant:/qdrant/storage \
    qdrant/qdrant:latest
```

Initialize gemini to use the remote vector store
```

## Commands overview
Run `/help - to view all the available commands` for command-specific options.

## RAG architecture (high level)

1. Ingestion
     - Text extraction -> cleaning -> chunking -> embed -> store vectors
2. Retrieval
     - Query -> embed -> nearest-neighbor search -> score and filter results
3. Fusion
     - Retrieved passages + session summary -> prompt assembly
4. Generation
     - Model call (stream or normal) -> return + optionally store response and update session
5. Memory maintenance
     - Summarize old turns and replace verbose records with compact memory objects in the vector DB

## Summarization strategies

- Rolling summarization: create compressed summaries after N messages or M tokens.
- On-demand: explicitly summarize a session or selection.
- Hybrid: keep recent messages verbatim and summarize older ones into memory vectors.
- Configurable summary length and preservation of named entities or citations.

## Storage and privacy

- Default local vector DB (Qdrant DB - Vector Search Engine).
- Configurable retention: purge or archive old sessions automatically.

## Extensibility

- Custom embedding and retrieval plugins.
- Add new document parsers for proprietary formats.
- Export plugins (JSON, Markdown, PDF).

## Best practices

- Preprocess and clean documents before ingestion for better retrieval quality.
- Tune chunk size and overlap for your document types (code vs prose).
- Use summarization thresholds to control long-term storage and token usage.
- Monitor similarity thresholds and re-index when content changes.

## Contributing

- Fork the repo, create a feature branch, and submit a pull request.
- Follow the repository’s code style and commit message guidelines.

## Contact
- If interested, connect with me in [**Linkedin**](https://www.linkedin.com/in/aditya-kumar-dey/);

