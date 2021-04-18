---
title: "Cookiecutter Django Quickstart"
published: true
---

Install cookiecutter.

```console
~# sudo apt install cookiecutter
```

Cookie Cutter can use a template in a local directory, a .zip file or a template hosted on GitHub.

```console
~# cookiecutter https://github.com/pydanny/cookiecutter-django
```

Install Python Virtual Environment.

```console
~# cd django_api
~# python3 -m venv .venv/django_api
~# source .venv/django_api/bin/activate
```

Use “deactivate” to deactivate Virtual Environment.

Install local requirements.

```console
~# pip3 install -r requirements/local.txt
```

Create a local PostgreSQL user with a password and login permissions, then create a database for this user.

local.py

```python
# DATABASES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',  # The database backend to use.
        'NAME': 'django_api',  # The name of the database to use.
        'USER': 'django_api',  # The username to use when connecting to the database.
        'PASSWORD': 'password123',  # The password to use when connecting to the database.
        'HOST': '127.0.0.1',  # Which host to use when connecting to the database. An empty string means localhost.
        'PORT': '5432',  # The port to use when connecting to the database. An empty string means the default port.
    }
}
```

Populate the database.

```console
~# python3 manage.py migrate
```

```console
~# python3 manage.py createsuperuser
```

Start the development server.

```console
~# python3 manage.py runserver
```
