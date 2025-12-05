# Base image: Usamos 3.10 para mayor compatibilidad con ML
FROM python:3.10-slim

# Evitar prompts interactivos
ENV DEBIAN_FRONTEND=noninteractive


ENV PYTHONPATH=/app

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copiar TODO el código
#  subir carpeta 'ultralytics/', 'processing/', 'api.py', etc.
COPY . .

# Comando de inicio corregido para Railway
# Usamos 'sh -c' para que lea la variable de entorno $PORT correctamente.
# Si no haces esto, Railway te dará error 502/Bad Gateway.
CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port ${PORT:-8000}"]