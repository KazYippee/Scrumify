# Scrumify

The project uses one Git repository:

- `backend/`: Django server
- `scrumify-app/`: Next.js application.

## Software

Use Python 3.14, Node.js 22, Git, and PowerShell.

On WSL, use Python 3.14, Node.js 22, Git, and the Ubuntu terminal.

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

## Start the Django server on WSL

Open the Ubuntu terminal in the project folder.

If Python 3.14 is not installed, use these commands first:

```bash
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.14 python3.14-venv
```

Use these commands:

```bash
python3.14 -m venv env
env/bin/python -m pip install Django==6.1.2 djangorestframework==3.18.3 django-cors-headers==4.9.0
env/bin/python manage.py migrate
env/bin/python manage.py runserver
```

Open [the Django admin page](http://127.0.0.1:8000/admin/).

## Make an admin account

Use this command in PowerShell:

```powershell
.\env\Scripts\python.exe manage.py createsuperuser
```

Use this command on WSL:

```bash
env/bin/python manage.py createsuperuser
```

## Run the Django tests

Use this command in PowerShell:

```powershell
.\env\Scripts\python.exe manage.py test backend.api
```

Use this command on WSL:

```bash
env/bin/python manage.py test backend.api
```

## Start the Next.js application

Open a second PowerShell window in the project folder.

Use these commands:

```powershell
cd scrumify-app
npm ci
npm run dev
```

Open [the Next.js application](http://localhost:3000).

## Start the Next.js application on WSL

Open a second Ubuntu terminal in the project folder.

Use these commands:

```bash
cd scrumify-app
npm ci
npm run dev
```

Open [the Next.js application](http://localhost:3000).

## Current condition

The Django server stores chores.
Each chore has a description, due date, status, and points.
Chores can be added and changed on the Django admin page.
The Django server has no API routes.
The Next.js application does not send data to the Django server.
