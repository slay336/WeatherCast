FROM python:3.8

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD [ "gunicorn", "-w", "1", "-b", "0.0.0.0:8000", "run:app" ]