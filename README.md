# Scrumify

The project uses one Git repository:

- `backend/`: Django server
- `scrumify-app/`: Next.js application.

## Software

Use Python 3.14, Node.js 22, Git, and PowerShell.

## Start the Django server

Open PowerShell in the project folder.

Use these commands:

```powershell
python -m venv env
.\env\Scripts\python.exe -m pip install Django==6.1.2 djangorestframework==3.18.3 django-cors-headers==4.9.0
.\env\Scripts\python.exe manage.py migrate
.\env\Scripts\python.exe manage.py runserver
```

Open [the Django admin page](http://127.0.0.1:8000/admin/).

## Start the Next.js application

Open a second PowerShell window in the project folder.

Use these commands:

```powershell
cd scrumify-app
npm ci
npm run dev
```

Open [the Next.js application](http://localhost:3000).

## Current condition

The Django server has no API routes.
The Next.js application does not send data to the Django server.
