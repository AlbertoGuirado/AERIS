#!/bin/bash

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn api:app --host=0.0.0.0 --port=8000
