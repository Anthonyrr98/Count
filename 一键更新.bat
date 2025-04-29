@echo off
chcp 65001 > nul
title 计数器应用一键更新

echo ================================================
echo             计数器应用一键更新脚本
echo ================================================
echo.
echo 此脚本将重新构建应用程序并创建桌面快捷方式。
echo.
echo 按任意键开始更新...
pause > nul

echo.
echo [1/2] 重新构建应用程序...
call rebuild.bat

echo.
echo [2/2] 创建桌面快捷方式...
call create-shortcut.bat

echo.
echo ================================================
echo             更新完成！
echo ================================================
echo 您可以通过桌面快捷方式或 dist\counter-win32-x64\counter.exe 运行应用。
echo.
pause 