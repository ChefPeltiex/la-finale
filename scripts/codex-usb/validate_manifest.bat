@echo off
setlocal EnableExtensions
set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
python "%ROOT%\validate_json.py"
if errorlevel 1 exit /b %ERRORLEVEL%
exit /b 0
