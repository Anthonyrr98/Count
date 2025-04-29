@echo off
chcp 65001 > nul
title 计数器应用构建脚本

echo 计数器应用构建脚本
echo ===================
echo.

echo 步骤1: 检查并安装依赖...
call npm install --no-fund --no-audit --loglevel=error
echo 依赖安装完成。
echo.

echo 步骤2: 清理当前构建...
if exist "dist\counter-win32-x64" rmdir /S /Q "dist\counter-win32-x64"
echo 清理完成。
echo.

echo 步骤3: 打包应用程序...
call npx electron-packager . counter --platform=win32 --arch=x64 --out=dist --asar --overwrite --app-name="计数器" --quiet
if %errorlevel% equ 0 (
    echo 打包成功！
) else (
    echo 打包失败！
    exit /b 1
)
echo.

echo 步骤4: 复制使用说明...
if exist "使用说明.txt" copy "使用说明.txt" "dist\counter-win32-x64\" > nul
echo 复制完成。
echo.

echo 构建完成！
echo 应用程序位置: dist\counter-win32-x64
echo.

pause 