@echo off
title Wurth Platform — Dev Server
cd /d "%~dp0"
echo Installing dependencies (Windows-native binaries)...
call npm install
echo.
echo Starting Vite dev server...
echo Open http://localhost:5173 in your browser.
echo Press Ctrl+C to stop.
echo.
call npm run dev
pause
