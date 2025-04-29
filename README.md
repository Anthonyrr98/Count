# 计数器应用

一个简单的Windows计数器应用，具有记忆功能，可以保存多个计数项目。

## 功能

- 创建多个计数器项目
- 通过点击加减按钮增减计数
- 使用localStorage自动保存数据，下次打开时恢复
- 删除不需要的计数器
- 显示统计图表，直观展示所有计数器的数值
- 导出数据到JSON文件，便于备份
- 从JSON文件导入数据，便于恢复或迁移

## 如何运行（开发模式）

1. 确保安装了 [Node.js](https://nodejs.org/)
2. 克隆或下载此仓库
3. 在项目目录中运行以下命令：

```
npm install
npm start
```

## 如何使用

1. 在左侧输入框中输入计数器名称，点击"添加"按钮创建新计数器
2. 在列表中可以直接点击"+"或"-"按钮修改计数
3. 点击计数器项目可以在右侧查看详情和进行更多操作
4. 点击"显示统计图表"可以查看所有计数器的数值统计图
5. 点击"导出数据"将所有计数器数据保存为JSON文件
6. 点击"导入数据"从之前保存的JSON文件中恢复数据
7. 所有数据会自动保存到浏览器的localStorage中

## 构建独立应用

### 自动构建(推荐)

项目包含了一个自动构建脚本，可以一键完成打包过程：

1. 双击项目目录中的 `auto-build.bat` 文件
2. 脚本会自动备份当前版本(如果存在)、清理旧构建、安装依赖并打包应用
3. 构建完成后，应用程序将保存在 `dist\counter-win32-x64` 目录中
4. 旧版本的备份会被保存在 `backups` 目录，并带有时间戳

这个脚本适合在修改代码后快速重新构建应用程序。

### 手动构建

#### 安装依赖

首先确保已安装所有依赖项：

```
npm install
```

如果在PowerShell中遇到执行策略限制问题，可以尝试以下解决方法之一：

#### 方法1：使用命令提示符(CMD)

打开命令提示符(而不是PowerShell)，导航到项目目录，然后运行npm命令。

#### 方法2：临时更改PowerShell执行策略

以管理员身份打开PowerShell，运行以下命令：

```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

然后在同一PowerShell窗口中运行npm命令。

#### 方法3：永久更改执行策略（需谨慎）

以管理员身份打开PowerShell，运行：

```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### 打包应用

确保依赖安装成功后，使用以下命令进行打包：

#### Windows版本

```
npm run package-win
```

#### macOS版本

```
npm run package-mac
```

#### Linux版本

```
npm run package-linux
```

#### 所有平台

```
npm run package-all
```

打包后的应用程序将位于`dist`目录中，您可以将其分发给其他用户。

### 手动打包（如果npm脚本不起作用）

如果上述打包命令不起作用，可以尝试直接使用electron-packager命令：

```
npx electron-packager . counter --platform=win32 --arch=x64 --out=dist --asar --overwrite --app-name="计数器"
```

对于macOS:

```
npx electron-packager . counter --platform=darwin --arch=x64 --out=dist --asar --overwrite --app-name="计数器"
```

对于Linux:

```
npx electron-packager . counter --platform=linux --arch=x64 --out=dist --asar --overwrite --app-name="计数器"
``` 