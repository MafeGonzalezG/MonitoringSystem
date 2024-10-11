FROM python:3.11.0-slim

RUN pip install pipenv

# Set the working directory
ENV APP_HOME /usr/local/bin/src/webapp

WORKDIR ${APP_HOME}

COPY Pipfile Pipfile.lock ${APP_HOME}/

COPY . ${APP_HOME}/

RUN pipenv install --system --deploy

EXPOSE 8501

HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health

ENTRYPOINT ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0" ]