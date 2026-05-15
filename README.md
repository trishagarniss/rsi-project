# ASGARD

**ASGARD** (Adaptive Student Guidance And Risk Detection) is an **early warning system** for **student dropout prediction**. It combines a **FastAPI** web backend, **PostgreSQL** for durable storage, and **scikit-learn**–based models maintained under `ml_pipeline/` for training, evaluation, and deployment workflows.

## Goals

- **Risk signals**: Surface indicators linked to disengagement or dropout risk so educators and administrators can intervene early.
- **Explainable workflows**: Keep data science work (notebooks, datasets, training scripts) separate from the API while sharing a clear path from research to serving.
- **Operational clarity**: Health checks, configuration via environment variables, and Dockerized PostgreSQL for consistent local development.

## Multi-tenant architecture

ASGARD is designed to support **multiple tenants** (e.g., institutions, campuses, or programs) in one deployment:

- **Data isolation**: Each tenant’s students, cohorts, and risk assessments should be keyed by a **tenant identifier** in the database. Row-level or schema-level isolation can be chosen as the product matures; the API layer should always scope queries by authenticated tenant context.
- **Configuration per tenant**: Feature flags, model versions, or alert thresholds may differ per tenant without forking the codebase.
- **Authentication and authorization**: JWT-based auth (`python-jose`) and password hashing (`passlib`) are stubbed under `app/core/security.py` for future tenant-aware access control.

Concrete tenant tables and middleware will evolve with your domain model; this repository provides the **skeleton** for routes, config, and models.

## Tech stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| API          | FastAPI, Uvicorn                    |
| Database     | PostgreSQL 15, SQLAlchemy, psycopg2 |
| ML           | scikit-learn, pandas                |
| Auth (planned) | python-jose, passlib              |
| Tooling        | Poetry (Python dependencies)      |

## Project layout

```text
app/
  main.py              # FastAPI app factory and entry
  api/v1/              # REST API version 1
  core/                # Settings, security helpers
  models/              # SQLAlchemy base, session, ORM models
ml_pipeline/
  notebooks/           # Jupyter experiments and EDA
  datasets/            # Raw CSVs (gitignored; .gitkeep preserves folder)
pyproject.toml         # Poetry: backend dependencies
docker-compose.yml     # PostgreSQL 15, database asgard_db
```

## Quick start

### 1. Install Poetry and backend dependencies

Install [Poetry](https://python-poetry.org/docs/#installation) if it is not already on your `PATH`.

From the repository root:

```bash
poetry install
```

This creates a virtual environment and installs the FastAPI stack and ML libraries declared in `pyproject.toml`.

### 2. Database

```bash
docker compose up -d
```

Default connection (matches `app/core/config.py` unless overridden):

- Host: `localhost`
- Port: `5432`
- Database: `asgard_db`
- User / password: `asgard` / `asgard`

Set `DATABASE_URL` in a `.env` file if you use different credentials, for example:

```env
DATABASE_URL=postgresql+psycopg2://asgard:asgard@localhost:5432/asgard_db
```

### 3. Run the API

```bash
poetry run uvicorn app.main:app --reload
```

On Windows PowerShell, the same command applies once Poetry is installed.

- API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- API v1 health: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

## ML pipeline

Place exploratory work in `ml_pipeline/notebooks/` and raw extracts in `ml_pipeline/datasets/`. Large CSV files are ignored by `.gitkeep`-friendly rules in `.gitignore`; commit only samples or document how to obtain production data.

## License

Specify your license here when the project policy is defined.
