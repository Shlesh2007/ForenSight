# ForenSight AI

> **Intelligent Digital Forensics Investigation Copilot**

ForenSight AI transforms raw forensic evidence into structured, queryable, and explainable investigation knowledge. It ingests disk images, memory dumps, network captures, and mobile/cloud extractions — normalizes them into a common fact model, links them into a knowledge graph, and provides an AI copilot that answers investigator questions in natural language with citations back to the underlying evidence.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Team & Scope](#team--scope)
- [Roadmap](#roadmap)

---

## Overview

Existing tools like Autopsy, FTK, and EnCase are great at collecting evidence — but they leave analysts manually sifting through millions of events. ForenSight AI sits on top of those tools and does the heavy lifting:

- Parses heterogeneous forensic data from multiple sources
- Normalizes everything into a single **Common Fact Model**
- Builds a per-case **Knowledge Graph** (Neo4j) linking entities and events
- Correlates events across sources using rules and ML
- Answers investigator questions via an **AI Copilot** (RAG + LLM) with evidence citations

---

## Architecture

The system is a six-layer pipeline:

```
RAW EVIDENCE       →  Disk image (E01/dd), RAM dump, PCAP, mobile extraction, cloud export
      ↓
ACQUISITION        →  Hash (SHA-256), read-only mount, chain-of-custody log
      ↓
PARSING            →  dfVFS, Volatility3, Zeek/tshark, ALEAPP/iLEAPP, custom cloud adapters
      ↓
NORMALIZATION      →  Common Fact Model (Entity → Event → Relation)
      ↓
STORAGE            →  PostgreSQL (facts) + Neo4j (graph) + Qdrant (vectors) + filesystem (evidence)
      ↓
REASONING          →  Correlation rules (Cypher), ML classifiers, cross-case similarity
      ↓
AI COPILOT         →  RAG over graph, natural-language Q&A, timeline summaries, next-step suggestions
      ↓
PRESENTATION       →  React web UI — case dashboard, graph explorer, chat panel
```

### Knowledge Graph Schema

**Node types:** `File`, `Process`, `User`, `Host`, `NetworkEndpoint`, `Artefact`

**Relation types:** `EXECUTED`, `PARENT_OF`, `ACCESSED`, `MODIFIED`, `DELETED`, `CONNECTED_TO`, `RESOLVES_TO`, `AUTHENTICATED_AS`, `EXTRACTED_FROM`, `DERIVED_BY`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend language | Python 3.11 |
| API framework | FastAPI |
| Task queue | Celery + Redis |
| Relational DB | PostgreSQL 16 |
| Graph DB | Neo4j Community 5.x |
| Vector DB | Qdrant |
| Disk parsing | dfVFS, pytsk3, Autopsy CLI |
| Memory parsing | Volatility 3 |
| Network parsing | Zeek + tshark |
| Mobile parsing | ALEAPP, iLEAPP, MVT |
| LLM (default) | Llama 3.1 8B via Ollama |
| LLM (fallback) | Gemini 1.5 Flash / Claude Haiku |
| Embeddings | BAAI/bge-small-en-v1.5 |
| Frontend | React 18 + TypeScript + Vite |
| Graph viz | Cytoscape.js |
| Containerization | Docker Compose |

---

## Project Structure

```
forensight-ai/
├── docker-compose.yml
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── acquisition/        # Hash-on-ingest, custody log, type detection
│   │   ├── api/routes/         # REST endpoints: cases, artefacts, graph, copilot, auth
│   │   ├── core/               # Config, security, logging
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic
│   │   ├── parsers/
│   │   │   ├── disk/           # dfVFS adapter, MFT, registry, browser history
│   │   │   ├── memory/         # Volatility 3 adapter
│   │   │   ├── network/        # Zeek + tshark adapters
│   │   │   ├── mobile/         # ALEAPP + iLEAPP adapters
│   │   │   └── cloud/          # Google Takeout + MS eDiscovery adapters
│   │   ├── normalization/      # Common Fact Model + normalizer
│   │   ├── storage/
│   │   │   ├── postgres/       # DB client + migrations
│   │   │   ├── neo4j/          # Graph client + loader
│   │   │   └── vector/         # Qdrant client + embedder
│   │   ├── reasoning/
│   │   │   ├── rules/          # Cypher correlation rules
│   │   │   └── ml/             # Session clustering, malware classifier
│   │   ├── copilot/            # Intent classifier, retriever, LLM client, citation enforcer
│   │   └── workers/            # Celery tasks for parsing and ingestion
│   └── tests/
│       ├── unit/
│       └── integration/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── dashboard/      # Case dashboard, key indicators
│       │   ├── graph/          # Cytoscape.js graph explorer
│       │   ├── chat/           # Copilot chat panel with citation links
│       │   └── timeline/       # Timeline view
│       ├── pages/
│       ├── services/           # API clients
│       ├── types/
│       └── hooks/
├── evidence_store/             # WORM-style raw evidence files
├── infra/                      # nginx config, postgres init SQL
└── docs/                       # Architecture, runbook, API reference
```

---

## Getting Started

### Prerequisites

- Docker + Docker Compose
- Git

### Run the stack

```bash
git clone https://github.com/Shlesh2007/ForenSight.git
cd ForenSight
docker-compose up --build
```

Services that come up:

| Service | URL |
|---|---|
| Web UI | http://localhost:3000 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Neo4j Browser | http://localhost:7474 |
| Qdrant UI | http://localhost:6333/dashboard |

### Stop the stack

```bash
docker-compose down
```

---

## Usage

1. **Create a case** — give it a name and description via the dashboard.
2. **Upload evidence** — drag in a disk image, memory dump, or PCAP. The system hashes it on ingest and queues the parser.
3. **Explore the graph** — once parsed, open the Graph Explorer to walk entities and relations (what did this process execute? what did this user access?).
4. **Ask the copilot** — type a natural-language question in the Chat panel. Every answer cites the underlying Event IDs, which link back to the source artefact.

### Example copilot questions

```
What did process svchost.exe (PID 1234) connect to?
Summarise the timeline for user Administrator on 2024-03-15.
Are there any registry persistence mechanisms in this case?
What files were modified in the hour before the suspicious network connection?
```

---

## Team & Scope

Built by a two-person team as a Semester 4 project.

**Current scope (v0.1 demo):**
- Disk image + memory dump parsing (NIST / Digital Corpora public datasets)
- Common Fact Model with 4 entity types and 6 relation types
- 3 rule-based correlations: process-to-network binding, registry Run-key persistence, parent-child process chain
- AI Copilot with factual lookup and timeline summarisation intents
- Minimal web UI: case dashboard, graph view, chat panel
- Hash-on-ingest and append-only audit log

**Deferred to future versions:**
- Full PCAP, mobile, and cloud parsers
- ML-based correlation and cross-case similarity
- Local LLM via Ollama
- Word/PDF report export
- Multi-tenant access control

---

## Roadmap

- [ ] Live triage mode (stream events from EDR agents)
- [ ] Multi-investigator collaboration with role-based access
- [ ] Automated report drafting from the case graph
- [ ] Federated cross-case search across teams
- [ ] Fine-tuned forensic LLM on anonymised case summaries

---

## License

This project is for academic and research purposes.
