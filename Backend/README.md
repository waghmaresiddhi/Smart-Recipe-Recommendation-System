# Django Base Template Source Code

## Creating a repository from a template

* Above the file list, click `Use this template`.
* Use the Owner drop-down menu, and select the account you want to own the repository.
* Type a name for your repository, and an optional description.
* Choose a repository visibility. For more information, see "About repository visibility."
* Optionally, to include the directory structure and files from all branches in the template, and not just the default branch, select Include all branches.
* Click Create repository from template.

## Commands
* pip install -r requirements.txt
* python build.py
* python manage.py makemigrations
* python manage.py migrate
* python manage.py createsuperuser
* python manage.py runserver
* python manage.py collectstatic
* python manage.py startapp <appname> (optional)


# Windows lib

* python -m pip install python-magic-bin

# Code Linting using black

* python -m black --extend-exclude migrations/ .

## Deploy at server
* ssh-agent bash -c 'ssh-add ~/.ssh/id_ed25519; git pull'