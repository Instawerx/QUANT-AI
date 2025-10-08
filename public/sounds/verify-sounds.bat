@echo off
echo.
echo ========================================
echo   Sound Files Verification
echo ========================================
echo.

set MISSING=0

if exist "wheel-spin.mp3" (
    echo [OK] wheel-spin.mp3
) else (
    echo [MISSING] wheel-spin.mp3
    set /a MISSING+=1
)

if exist "win-celebration.mp3" (
    echo [OK] win-celebration.mp3
) else (
    echo [MISSING] win-celebration.mp3
    set /a MISSING+=1
)

if exist "lose-sound.mp3" (
    echo [OK] lose-sound.mp3
) else (
    echo [MISSING] lose-sound.mp3
    set /a MISSING+=1
)

if exist "click.mp3" (
    echo [OK] click.mp3
) else (
    echo [MISSING] click.mp3
    set /a MISSING+=1
)

if exist "coin-drop.mp3" (
    echo [OK] coin-drop.mp3
) else (
    echo [MISSING] coin-drop.mp3
    set /a MISSING+=1
)

if exist "double-up.mp3" (
    echo [OK] double-up.mp3
) else (
    echo [MISSING] double-up.mp3
    set /a MISSING+=1
)

if exist "fanfare.mp3" (
    echo [OK] fanfare.mp3
) else (
    echo [MISSING] fanfare.mp3
    set /a MISSING+=1
)

echo.
echo ========================================
if %MISSING%==0 (
    echo   Status: All 7 files present!
    echo   You're ready to test sounds.
) else (
    echo   Status: %MISSING% file(s) missing
    echo   See DOWNLOAD_GUIDE.md for help
)
echo ========================================
echo.
pause
