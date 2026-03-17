## Run project instructions

Run this once in PowerShell from the project root to set up the virtual environment, copy example env files if needed, and install backend dependencies:

`if (-not (Test-Path ".venv")) { python -m venv .venv }; & ".\.venv\Scripts\Activate.ps1"; if ((Test-Path ".\backend\.env.example") -and (-not (Test-Path ".\backend\.env"))) { Rename-Item ".\backend\.env.example" ".env" }; if ((Test-Path ".\frontend\.env.example") -and (-not (Test-Path ".\frontend\.env"))) { Rename-Item ".\frontend\.env.example" ".env" }; pip install -r ".\backend\requirements.txt"`

Then start the app in two separate terminals from the project root.

Terminal 1, backend:

`Set-Location ".\backend"; python -m uvicorn main:app --reload`

Terminal 2, frontend:

`Set-Location ".\frontend"; npm i; npm run dev`