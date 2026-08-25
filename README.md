# Construction ontology knowledge exploration POC

This repository contains a proof-of-concept interface for extracting, organizing, clustering, and exploring heterogeneous information from construction-domain ontologies and technical documents.

The project was developed as part of a research internship at SIAME within the DATABUILDER research context. Its objective is to illustrate how information from multiple semantic resources could be processed through a common workflow and later used to support questions from construction-domain experts.

> **Project status:** the current version is a frontend demonstrator. File analysis, extraction, clustering, visualization data, and generated answers are simulated. Integration with the FastAPI backend and the real processing pipeline remains future work.

## Workflow

The interface is organized into five stages:

1. **Source analysis** — upload and validate ontology (`.ttl`) and document (`.pdf`) files.
2. **Information extraction** — configure the extraction of classes, labels, descriptions, hierarchical relations, properties, and document fragments.
3. **Cluster generation** — configure embeddings and K-means clustering, then inspect evaluation metrics such as the Silhouette Score and Davies–Bouldin Index.
4. **Cluster visualization** — explore a two-dimensional representation of the clusters, filter concepts, identify their sources, and highlight newly added information.
5. **System questions** — browse 38 expert questions grouped into six construction-related sections and inspect the processing capabilities associated with each question.

## Question catalogue

The questions are grouped into the following sections:

- Construction process
- Typology and frequency of incidents
- Causes of incidents
- Incident treatment and monitoring
- Advanced analyses
- Multiple incidents on the same building

Each question is associated internally with four capability indicators:

- Query
- Postprocessing
- AI interpretation
- AI inference

These indicators describe the operations that would be required to answer each question once the interface is connected to the backend.

## Technologies

### Frontend

- React
- TypeScript
- Vite
- CSS

### Planned backend integration

- Python
- FastAPI
- RDFLib
- Embedding models
- K-means clustering

## Project structure

```text
ontology-poc/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── models/
│   │   └── main.py
│   ├── storage/
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── index.html
└── README.md
```

## Requirements

To run the current frontend, install:

- Node.js 20.19 or later
- npm

Python will be required when the FastAPI backend is implemented.

## Installation

Clone the repository and enter the frontend directory:

```bash
git clone <repository-url>
cd ontology-poc/frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local address shown by Vite, usually:

```text
http://localhost:5173/
```

## Build

To create a production build:

```bash
npm run build
```

## Current limitations

- The uploaded files are not yet processed by a backend.
- Extracted records and cluster results are demonstration data.
- The two-dimensional cluster coordinates are illustrative.
- System questions do not yet query a knowledge base or document collection.
- PDF evidence, ontology URIs, and generated answers will require backend services.

## Future work

- Connect the interface to FastAPI endpoints.
- Analyze and validate uploaded TTL and PDF files.
- Extract and normalize ontology classes and document fragments.
- Generate embeddings from enriched semantic descriptions.
- Apply and evaluate clustering using real data.
- Preserve source provenance for every extracted and clustered item.
- Generate evidence-based answers with ontology URIs or PDF page references.

## Academic purpose

This prototype is intended for research and demonstration purposes. It illustrates the proposed interaction workflow and does not yet constitute a production-ready construction information system.
