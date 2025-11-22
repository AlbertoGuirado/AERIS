FROM python:3.11-slim

WORKDIR /app

COPY ultralytics ./ultralytics      # <--- Asegurar que esto esté antes
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh", "start.sh"]