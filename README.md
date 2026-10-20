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
The commands above to the following 
- Create virtual env
- Install dependencies
- Apply database migrations
- Starts development server

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
Each chore has a description, due date, status, points, and an owner.
The owner is the account that the chore belongs to.
Accounts and chores can be added on the Django admin page.
Pick an owner for each chore on the Django admin page.

The Next.js application asks you to sign in with your account.
After you sign in, it shows only your chores.
A chore can be edited in the Next.js application with the Edit button.
You cannot see or change chores that belong to another account.

The Django server has these API routes:

- `POST /api/login/`: sign in with a username and password and get a token.
- `GET /api/chores/`: list your chores.
- `GET /api/chores/<id>/`: get one of your chores.
- `PUT /api/chores/<id>/`: change one of your chores.

Every chore route needs the header `Authorization: Token <your token>`.
