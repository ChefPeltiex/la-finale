@echo off
setlocal EnableExtensions
set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

python "%ROOT%\validate_json.py"
set "EC=%ERRORLEVEL%"
if not "%EC%"=="0" exit /b %EC%

python "%ROOT%\validate_assets.py"
set "EC=%ERRORLEVEL%"
if not "%EC%"=="0" exit /b %EC%

python "%ROOT%\validate_html.py"
set "EC=%ERRORLEVEL%"
if not "%EC%"=="0" exit /b %EC%

exit /b 0
