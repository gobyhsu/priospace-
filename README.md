# 🎯 优事空间 PrioSpace Plus

> **致谢 / Acknowledgements**
>
> 本多语言本地化版及修改内容基于 **Anoy Roy Chowdhury** 开发的 [PrioSpace](https://github.com/AnoyRC/priospace) 项目。我们非常感谢原作者带来的优秀开源作品。原项目许可证：**MIT License**
>
> This multilingual localized version is based on the [PrioSpace](https://github.com/AnoyRC/priospace) project developed by **Anoy Roy Chowdhury**. We sincerely thank the original author for this excellent open-source work. Original license: **MIT License**


一款精美、现代的生产力应用，集成了任务管理、番茄计时器、习惯追踪和实时协作功能。使用 Next.js、React 和 Framer Motion 构建，带来流畅动画和优质用户体验。

A beautiful, modern productivity app that combines task management with Pomodoro timer functionality, habit tracking, and real-time collaboration. Built with Next.js, React, and Framer Motion for smooth animations and premium user experience.

![Version](https://img.shields.io/badge/Version-1.3.2-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)
![WebRTC](https://img.shields.io/badge/WebRTC-Enabled-green)

---

## 📋 修改声明 / Modification Notice

**优事空间 PrioSpace Plus 多语言版 / Multilingual Version**

本项目基于 Anoy Roy Chowdhury 开发的 [PrioSpace](https://github.com/AnoyRC/priospace) 项目（MIT License）进行二次开发。 / This project is a derivative of [PrioSpace](https://github.com/AnoyRC/priospace) by Anoy Roy Chowdhury (MIT License).

**修改内容 / Modifications：**

1. **全界面中文化**：将全部用户界面文本（约 170+ 处）从英文翻译为简体中文 / **Full Chinese localization**：Translated all UI text (~170+ strings) from English to Simplified Chinese
2. **多语言支持（i18n）**：支持简体中文、繁體中文、English、Español 四种语言，设置中可切换，首次安装自动检测系统语言 / **Multi-language support (i18n)**：Supports 4 languages with in-app switching and auto-detection of system language on first launch
3. **品牌本地化**：中文名"优事空间"，标语"专注 · 追踪 · 成就" / **Brand localization**：Chinese name "优事空间", tagline "专注 · 追踪 · 成就"
4. **日期格式本地化**：日期格式根据当前语言自动适配，星期显示为对应语言 / **Locale-aware dates**：Date formats and weekday names automatically adapt to the selected language
5. **默认主题调整**：将默认主题颜色从暖棕色改为绿色 / **Default theme change**：Changed default theme from warm brown to green
6. **天气功能新增**：集成高德天气 API，支持自动定位和手动输入城市，主界面显示实时天气图标和温度 / **Weather feature**：Integrated Amap weather API with auto-location and manual city input, displaying real-time weather icon and temperature
7. **习惯管理**：支持编辑和删除习惯 / **Habit management**：Edit and delete habits
8. **分类颜色编辑**：支持修改分类标签颜色 / **Category color editing**：Customize tag/category colors
9. **子任务级联**：父任务完成时自动完成所有子任务 / **Subtask cascade**：Auto-complete all subtasks when parent task is done
10. **窗口标题中文化** / **Localized window title**
11. **设置页面**：新增多语言选择器和本地化署名"Localized by 迷汁逃桃" / **Settings page**：Added language selector and localization credit

**未修改内容 / Unchanged：**

- 原项目核心功能逻辑、组件结构、API 接口均未改动 / Core logic, component structure, and API interfaces remain unchanged
- 原作者信息及版权声明在设置页面中保留 / Original author info and copyright notice preserved in settings
- 原项目许可证（MIT License）继续适用 / Original MIT License still applies

**本地化作者 / Localized by：** 迷汁逃桃

本修改版同样遵循 MIT License 开源协议。 / This modified version is also released under the MIT License.

---

## ✨ 功能特性 / Features

### 📝 任务管理 / Task Management
- 创建、编辑和管理任务和习惯 / Create, edit, and manage tasks and habits
- **子任务支持** — 将复杂任务拆分为可管理的子任务 / **Subtasks support** - Break down complex tasks
- 使用自定义颜色分类组织任务 / Organize with custom color-coded categories
- 流畅动画完成任务标记 / Mark tasks complete with smooth animations
- 长按完成手势，适合移动端 / Hold-to-complete gesture for mobile
- 常规任务和习惯分区显示 / Separate sections for tasks and habits
- **子任务级联完成** — 父任务完成时自动完成所有子任务 / **Subtask cascade** - Auto-complete all subtasks when parent is done

### 🌐 任务共享 / Task Sharing
- **WebRTC 驱动的任务共享** / **WebRTC-powered task sharing**
- 点对点连接，即时同步 / Peer-to-peer connection for instant synchronization
- 实时与团队成员分享任务和进度 / Share tasks and progress in real-time

### ⏱️ 番茄计时器 / Pomodoro Timer
- 可自定义计时器预设（5、10、25、50 分钟）/ Customizable timer presets
- 实时倒计时动画显示 / Real-time countdown with animated display
- 超时追踪 / Overtime tracking
- 休息计时器，自动切换 / Break timer with automatic transitions
- 专注时间追踪 / Focus time tracking

### 🔄 习惯追踪 / Habit Tracking
- GitHub 风格的 30 天贡献热力图 / GitHub-style contribution graph for 30-day history
- 月度视图，可视化强度指标 / Monthly view with visual intensity indicators
- 单个习惯每日完成追踪 / Individual habit tracking with daily completion
- 习惯分析和进度可视化 / Habit analytics and progress visualization

### 🌤️ 天气功能 / Weather（新增）
- 高德天气 API，支持自动定位 / Amap weather API with auto-location
- 手动输入城市 / Manual city input
- 主界面显示实时天气图标和温度 / Display real-time weather icon and temperature
- 每小时自动刷新 / Auto-refresh every hour

### 🌍 多语言支持 / Multi-Language（V1.3.2 新增）

- 支持 4 种语言：简体中文 / 繁體中文 / English / Español / Support for 4 languages
- 设置中一键切换语言 / Switch language in settings
- 首次安装自动检测系统语言 / Auto-detect system language on first launch
- 日期、星期、名言等全面本地化 / Full localization for dates, weekdays, and quotes

### 🎨 精美界面 / Beautiful UI/UX
- 现代底部弹窗设计 / Modern bottom-sheet modal design
- **8 种精美主题**，无缝切换 / **8 stunning themes** with seamless selection
- Framer Motion 流畅弹性动画 / Smooth spring animations
- 响应式设计，适配移动端和桌面端 / Responsive design for mobile and desktop
- 深色/浅色模式 / Dark/Light mode support
- 直观触摸手势和微交互 / Intuitive touch gestures and micro-interactions

---

## 🚀 快速开始 / Getting Started

### 前置条件 / Prerequisites
- Node.js 18+
- npm 或 yarn / npm or yarn

### 安装 / Installation

```bash
# 克隆仓库 / Clone the repository
git clone https://github.com/gobyhsu/priospace-.git
cd priospace-

# 安装依赖 / Install dependencies
npm install

# 启动开发服务器 / Run the development server
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### Windows 安装包构建 / Build Windows Installer

```bash
# 需要安装 Rust 工具链 / Requires Rust toolchain
npm run tauri build
```

生成的安装包位于 `src-tauri/target/release/bundle/`

---

## 🏗️ 技术栈 / Tech Stack

| 技术 / Technology | 用途 / Purpose |
|---|---|
| **Next.js 15** | React 框架（App Router，静态导出）/ React framework (App Router, static export) |
| **React 19** | UI 库 / UI library |
| **Tailwind CSS** | 实用优先 CSS 框架 / Utility-first CSS framework |
| **Framer Motion** | 动画库 / Animation library |
| **Tauri v2** | 桌面应用打包 / Desktop app packaging |
| **Open-Meteo API** | 天气数据 / Weather data |
| **react-i18next** | 多语言国际化 / Internationalization (i18n) |
| **WebRTC** | 点对点实时通信 / Peer-to-peer real-time communication |
| **shadcn/ui + Lucide** | UI 组件和图标 / UI components and icons |

---

## 📁 项目结构 / Project Structure

```
priospace-/
├── app/                    # Next.js App Router
│   ├── globals.css         # 全局样式 / Global styles
│   ├── layout.js           # 根布局 / Root layout
│   ├── page.js             # 主应用页面 / Main application page
│   └── home/page.js        # 着陆页 / Landing page
├── components/             # 可复用组件 / Reusable components
├── lib/                    # 工具函数 / Utility functions
│   └── i18n.js             # i18next 初始化配置 / i18next initialization
├── locales/                # 多语言翻译文件 / Language translation files
│   ├── zh-CN.json          # 简体中文 / Simplified Chinese
│   ├── zh-TW.json          # 繁體中文 / Traditional Chinese
│   ├── en.json             # 英文 / English
│   └── es.json             # 西班牙语 / Spanish
├── utils/                  # 工具模块 / Utility modules
│   ├── time.js             # 时间格式化 / Time formatting
│   └── weather.js          # 天气 API / Weather API
├── public/                 # 静态资源 / Static assets
├── src-tauri/              # Tauri 桌面应用 / Tauri desktop app
├── webrtc-server/          # WebRTC 信令服务器 / Signaling server
└── package.json            # 依赖配置 / Dependencies
```

---

## 🤝 贡献 / Contributing

欢迎贡献！请 fork 本仓库并提交 Pull Request。

Contributions are welcome! Please fork this repository and submit a Pull Request.

---

## 📄 许可证 / License

本项目基于 MIT License 开源。原项目由 Anoy Roy Chowdhury 开发，同样采用 MIT License。

This project is licensed under the MIT License. The original project by Anoy Roy Chowdhury is also under the MIT License.

---

<div align="center">

**原项目 / Original project by [Anoy Roy Chowdhury](https://x.com/Anoyroyc)**

**多语言本地化版 / Multilingual localized version by 迷汁逃桃**

*专注 · 追踪 · 成就 / Focus · Track · Achieve*

</div>
