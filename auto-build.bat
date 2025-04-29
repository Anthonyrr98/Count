@echo off
chcp 65001 > nul
title 计数器应用自动构建脚本

echo ===================================================
echo             计数器应用自动构建脚本
echo ===================================================
echo.

:: 获取当前日期和时间作为版本标识
set "timestamp=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "timestamp=%timestamp: =0%"

:: 创建备份目录（如果不存在）
if not exist "backups" mkdir backups

:: 步骤1：备份当前版本（如果存在）
echo 步骤1：备份当前版本（如果存在）
if exist "dist\counter-win32-x64" (
    echo   正在备份当前版本...
    xcopy "dist\counter-win32-x64" "backups\counter-win32-x64_%timestamp%" /E /I /H /Y > nul
    echo   备份完成：backups\counter-win32-x64_%timestamp%
) else (
    echo   没有找到当前版本，跳过备份
)
echo.

:: 步骤2：清理当前构建
echo 步骤2：清理当前构建
if exist "dist\counter-win32-x64" (
    echo   正在删除旧的构建文件...
    rmdir /S /Q "dist\counter-win32-x64"
    echo   旧的构建文件已删除
) else (
    echo   没有找到旧的构建文件，跳过清理
)
echo.

:: 步骤3：安装依赖（如果需要）
echo 步骤3：检查依赖
if not exist "node_modules" (
    echo   正在安装依赖...
    call npm install --no-fund --no-audit --loglevel=error
    echo   依赖安装完成
) else (
    echo   依赖已安装，跳过安装步骤
)
echo.

:: 步骤4：打包应用
echo 步骤4：打包应用
echo   正在打包应用程序...
call npx electron-packager . counter --platform=win32 --arch=x64 --out=dist --asar --overwrite --app-name="计数器" --quiet

if %errorlevel% equ 0 (
    echo   打包成功！
    echo   应用程序已保存到 dist\counter-win32-x64 目录
) else (
    echo   打包失败！请检查错误信息
    exit /b 1
)
echo.

:: 步骤5：复制使用说明
echo 步骤5：复制使用说明到打包目录
if exist "使用说明.txt" (
    echo   正在复制使用说明...
    copy "使用说明.txt" "dist\counter-win32-x64\" > nul
    echo   使用说明已复制
) else (
    echo   未找到使用说明.txt文件，跳过复制
)
echo.

echo ===================================================
echo           构建完成！版本标识：%timestamp%
echo ===================================================
echo.
echo 应用程序已保存在 dist\counter-win32-x64 目录
echo 备份版本保存在 backups\counter-win32-x64_%timestamp% 目录
echo.

pause 