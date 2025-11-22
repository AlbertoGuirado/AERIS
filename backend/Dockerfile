# Base image: Usamos 3.10 para mayor compatibilidad con las librerías de ML/CV.
FROM python:3.10-slim

# Evitar prompts interactivos
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias de sistema necesarias para OpenCV y video
RUN apt-get update && apt-get install -y \
    git \ 
    # Dependencias de OpenCV (libGL.so.1 resuelto con libgl1)
    libgl1 \ 
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    # Soporte para manipulación de video si usas ffmpeg
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo y copiar requirements
WORKDIR /app
COPY requirements.txt .

# Actualizar pip e instalar dependencias de Python
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación (incluye api.py, processing/, y modelos .pt)
COPY . .

# Comando para ejecutar FastAPI usando la variable de entorno $PORT de Railway
# El puerto 8000 en la CMD es el fallback si $PORT no se define, pero Uvicorn lo respeta.
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]