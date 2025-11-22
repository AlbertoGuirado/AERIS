# Base image: Usamos 3.10 para mayor compatibilidad con ML
FROM python:3.10-slim

# Evitar prompts interactivos
ENV DEBIAN_FRONTEND=noninteractive

# 🚀 IMPORTANTE: Asegurar que Python vea tu carpeta local 'ultralytics'
# Esto fuerza a Python a buscar módulos en /app primero
ENV PYTHONPATH=/app

# Instalar dependencias de sistema necesarias
RUN apt-get update && apt-get install -y \
    # git \  <-- YA NO LO NECESITAS si no instalas desde git en requirements.txt
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# 🚀 CRÍTICO: Copiar TODO el código
# Esto subirá tu carpeta 'ultralytics/', 'processing/', 'api.py', etc.
COPY . .

# 🚀 CRÍTICO: Comando de inicio corregido para Railway
# Usamos 'sh -c' para que lea la variable de entorno $PORT correctamente.
# Si no haces esto, Railway te dará error 502/Bad Gateway.
CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port ${PORT:-8000}"]