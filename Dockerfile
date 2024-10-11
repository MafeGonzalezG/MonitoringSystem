FROM python:3.13.0-slim

WORKDIR /app

# Install pipenv
RUN pip3 install --upgrade pip
RUN pip3 install pipenv

# Copy the Pipfile and Pipfile.lock
COPY Pipfile* /app/

# Install dependencies using pipenv with verbose output
RUN cd /app && pipenv install --system --deploy --ignore-pipfile

# Copy the rest of the application code
COPY . .

# Expose the port that Streamlit will run on
EXPOSE 8501

# Check if the Streamlit app is running
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health

# Command to run the Streamlit app
CMD ["pipenv", "run", "streamlit", "run", "your_app.py"]