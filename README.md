# Scrumify

The project uses one Git repository:

- `backend/`: Django server
- `scrumify-app/`: Next.js application.

## Software

Use Python 3.14, Node.js 22, Git, and PowerShell.

## Installation/Setup: Windows

### Start the Django server

Open PowerShell in the project folder.

Use these commands:

```powershell
python -m venv env
.\env\Scripts\python.exe -m pip install Django==6.1.2 djangorestframework==3.18.3 django-cors-headers==4.9.0
.\env\Scripts\python.exe manage.py migrate
.\env\Scripts\python.exe manage.py runserver
```
The commands above to the following 
- Create virtual env
- Install dependencies
- Apply database migrations
- Starts development server

Open [the Django admin page](http://127.0.0.1:8000/admin/).

### Make an admin account

Use this command in PowerShell:

```powershell
.\env\Scripts\python.exe manage.py createsuperuser
```

Use this command on WSL:

```bash
env/bin/python manage.py createsuperuser
```

### Run the Django tests

Use this command in PowerShell:

```powershell
.\env\Scripts\python.exe manage.py test backend.api
```

Use this command on WSL:

```bash
env/bin/python manage.py test backend.api
```

### Start the Next.js application

Open a second PowerShell window in the project folder.

Use these commands:

```powershell
cd scrumify-app
npm ci
npm run dev
```

Open [the Next.js application](http://localhost:3000).

### Start the Next.js application on WSL

Open a second Ubuntu terminal in the project folder.

Use these commands:

```bash
cd scrumify-app
npm ci
npm run dev
```

Open [the Next.js application](http://localhost:3000).

## Installation/Setup: Mac Users

This installation process requires homebrew. If it is not installed yet, run the following command in the terminal: 

```homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install required software tools:

```terminal
brew install python@3.14 node@22 git
```

Now cd into the directory you want Scrumify in on your computer; clone the repo:

```terminal
git clone https://github.com/greinermachine/Scrumify.git
```

### Start Django Server

Create environment with the correct python:

```
python3.14 -m venv scrumifyEnv
./scrumifyEnv/bin/python -m pip install Django==6.1.2 djangorestframework==3.18.3 django-cors-headers==4.9.0
./scrumifyEnv/bin/python manage.py migrate
./scrumifyEnv/bin/python manage.py runserver
```

You are now in the Django server. Keep this terminal window running, and open [the Django admin page](http://127.0.0.1:8000/admin/). 

### 
In a second terminal window, cd back into your Scrumify directory, and run:

```
./scrumifyEnv/bin/python manage.py createsuperuser
```

Enter your username, email, and password.

### Run Django Tests

```
./scrumifyEnv/bin/python manage.py test backend.api
```

### Start Next.js Application

```
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
