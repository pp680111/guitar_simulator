# GuitarSim - 吉他模拟器

一款可以在浏览器和安卓设备上运行的吉他模拟器应用。

## 功能特点

- 点击指板弹奏音符
- 多种吉他音色选择（古典、民谣、电吉他、合成器）
- 支持加载自定义音色库（SF2/GIG/OGG格式）
- 录音和导出功能

## 技术栈

- 前端：HTML + CSS + JavaScript
- 音频：SpessaSynth (Web Audio API)
- 移动端：Capacitor

## 环境要求

### 编译 Android APP 所需环境

- **JDK**：Java 21 或更高版本
- **Android SDK**：API 24（Android 7.0）及以上
- **Node.js**：18.x 或更高版本
- **Gradle**：由 Android 项目自动管理

> 注意：本项目的最低安卓版本为 **API 24（Android 7.0）**，支持约 99%+ 的现有安卓设备。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 复制前端资源到 www 目录

```bash
# Windows
mkdir www
xcopy /E /I /Y index.html www\
xcopy /E /I /Y css www\css\
xcopy /E /I /Y js www\js\
xcopy /E /I /Y soundfonts www\soundfonts\
copy spessasynth_bundle.js www\

# Linux/Mac
mkdir -p www
cp index.html www/
cp -r css www/
cp -r js www/
cp -r soundfonts www/
cp spessasynth_bundle.js www/
```

或者直接运行：

```bash
node -e "
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

fs.copyFileSync('index.html', 'www/index.html');
fs.copyFileSync('spessasynth_bundle.js', 'www/spessasynth_bundle.js');
copyDir('css', 'www/css');
copyDir('js', 'www/js');
copyDir('soundfonts', 'www/soundfonts');
console.log('Done!');
"
```

### 3. 添加 Android 平台

```bash
npx cap add android
```

### 4. 配置权限

已自动配置以下权限：
- `INTERNET` - 网络访问
- `RECORD_AUDIO` - 录音功能
- `WRITE_EXTERNAL_STORAGE` - 存储写入（API ≤ 28）
- `READ_EXTERNAL_STORAGE` - 存储读取（API ≤ 32）

### 5. 构建 APK

#### 方式一：使用命令行

```bash
cd android
./gradlew assembleDebug
```

APK 生成位置：`android/app/build/outputs/apk/debug/app-debug.apk`

#### 方式二：使用 Android Studio

1. 用 Android Studio 打开 `android` 文件夹
2. 等待 Gradle 同步完成
3. 点击 **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**

## 项目结构

```
guitar_sim/
├── index.html          # 主页面
├── css/
│   └── styles.css      # 样式文件
├── js/
│   ├── audio.js        # 音频处理
│   ├── fretboard.js    # 指板逻辑
│   ├── recorder.js     # 录音功能
│   └── app.js          # 主应用
├── soundfonts/         # 音色库目录
├── www/                # Capacitor Web 资源目录
├── android/            # Android 原生项目
├── capacitor.config.json
└── package.json
```

## 常见问题

### Q: 构建失败，提示找不到 JDK？

确保已安装 JDK 21，并设置环境变量：
```bash
# Windows
setx JAVA_HOME "C:\Program Files\Java\jdk-21"
# Linux/Mac
export JAVA_HOME=/path/to/jdk-21
```

### Q: Gradle 下载失败？

可以修改 `android/gradle/wrapper/gradle-wrapper.properties`，使用国内镜像：

```properties
distributionUrl=https\://mirrors.aliyun.com/gradle/gradle-8.14.3-all.zip
```

### Q: 如何修改最低安卓版本？

编辑 `android/variables.gradle`：

```gradle
ext {
    minSdkVersion = 24  // 修改此值
    ...
}
```

### Q: 如何修改应用名称？

编辑 `capacitor.config.json`：

```json
{
  "appName": "你的应用名称"
}
```

## 许可证

ISC
