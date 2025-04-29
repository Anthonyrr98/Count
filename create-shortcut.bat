@echo off
chcp 65001 > nul
title 创建桌面快捷方式

echo 创建计数器应用桌面快捷方式
echo =========================
echo.

if not exist "dist\counter-win32-x64\counter.exe" (
    echo 错误: 应用程序未找到。
    echo 请先运行 rebuild.bat 打包应用程序。
    pause
    exit /b 1
)

echo 正在创建桌面快捷方式...

set SCRIPT="%TEMP%\create-shortcut.vbs"
set SHORTCUT="%USERPROFILE%\Desktop\计数器.lnk"

echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = %SHORTCUT% >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%CD%\dist\counter-win32-x64\counter.exe" >> %SCRIPT%
echo oLink.WorkingDirectory = "%CD%\dist\counter-win32-x64" >> %SCRIPT%
echo oLink.Description = "计数器应用程序" >> %SCRIPT%
echo oLink.IconLocation = "%CD%\dist\counter-win32-x64\counter.exe, 0" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%

echo 快捷方式已创建到桌面: 计数器.lnk
echo.
pause 