@echo off
echo Iniciando frontend en modo PRODUCCION...
echo.

cd /d "%~dp0"

if not exist node_modules (
    echo Instalando dependencias...
    npm install
)

echo Compilando para produccion...
npm run build && npm run serve-prod
