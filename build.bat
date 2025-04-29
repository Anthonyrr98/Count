@echo off
chcp 65001 > nul
echo 正在打包计数器应用程序...
echo.

:: 设置环境变量，防止npm输出太多信息
set npm_config_loglevel=error

:: 使用npx调用electron-packager，避免PowerShell执行策略问题
npx electron-packager . counter --platform=win32 --arch=x64 --out=dist --asar --overwrite --app-name="计数器"

if %errorlevel% equ 0 (
    echo.
    echo 打包成功！
    echo 应用程序已保存到 dist\counter-win32-x64 目录
    echo.
) else (
    echo.
    echo 打包失败！请检查错误信息
    echo.
)

pause 