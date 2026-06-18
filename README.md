# AI Document Intelligence Platform

> Upload PDFs. Ask questions. Extract insights. Powered by GPT-4o and pgvector RAG.

An advanced, production-grade full-stack document analyzer designed like Notion AI meets Adobe Acrobat. It lets users upload PDFs, converse with them via vector RAG, review auto-summaries, inspect structured data tables, and add manual annotations.

## Features
- **Asynchronous Processing Pipeline**: Leverages BullMQ + Redis for robust background chunking and metadata summarization.
- **pgvector Semantic Search**: Real-time document retrieval mapping user queries to text embeddings using OpenAI's `text-embedding-3-small`.
- **OpenAI Streaming Conversations**: SSE streams answers with inline page citation badges.
- **Structured Entity Extraction**: Classifies document types and extracts key-value pairs (Dates, Parties, Amounts, Clauses).
- **Interactive Annotations Layer**: Draw highlights and place comments directly onto pages.
- **Unauthenticated Sharing Engine**: Share read-only document snapshots with public streaming chat windows.

## Architecture
```
[User] → [Next.js 15 Frontend]
             ↓ REST + SSE
         [Express Backend]
             ↓               ↓
      [PostgreSQL         [Redis/BullMQ]
       + pgvector]         (queue)
             ↓               ↓
         [OpenAI API]    [PDF Processor]
```

## RAG Pipeline Explained
1. **Overlap Ingestion**: Splitting PDF text into 512-token segments with 50-token overlap preserves context boundaries.
2. **pgvector Similarity Search**: Queries are matched against chunk vectors using cosine distance (`<=>` operator) inside PostgreSQL.
3. **SSE Streaming**: Chunks are assembled into a context prompt and streamed to the UI using server-sent events.

## Database Schema (Prisma)
- **User**: Authentication profile, avatar color settings.
- **Document**: Title, size, page count, and status tracking state.
- **DocumentChunk**: Raw text blocks and `Unsupported("vector(1536)")` embedding arrays.
- **DocumentAnalysis**: Auto-generated structured summaries, risk flags, and categories.
- **Annotation**: Persistent coordinate markers (x, y, width, height) and comment text.
- **ShareToken**: Public access tokens routing shared document views.

## Local Development Setup
```bash
# Clone the repository
git clone https://github.com/your-username/ai-document-platform.git
cd ai-document-platform

# Install dependencies
pnpm install

# Run database migrations
cd apps/server
pnpm prisma:generate

# Launch services
pnpm dev
```

## Environment Variables

### apps/server (.env)
| Variable | Description | Default |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL with pgvector connection string | `postgresql://...` |
| `REDIS_URL` | Redis URL for BullMQ connection | `redis://localhost:6379` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `JWT_SECRET` | Authentication token secret | `super-secret` |

## Why This Project Is Impressive For AI Engineering Interviews
- **Robust RAG implementation**: Employs industry-standard vector search methodologies without external orchestrators (like LangChain) to showcase raw database/API mechanics.
- **Enterprise-ready UI**: Dynamic features such as page highlights, SSE streams, zoom scaling, and coordinate comments represent production-level complexity.
- **Complete Ingestion Pipeline**: Decoupled asynchronous queue processing utilizing BullMQ handles scale smoothly.
