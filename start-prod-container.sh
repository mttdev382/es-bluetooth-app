#!/bin/bash
echo "Avviando il container di produzione..."
docker-compose -f docker-compose.prod.yaml up --build
