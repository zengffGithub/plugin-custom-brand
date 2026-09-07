# @nocobase/plugin-custom-brand

> NocoBase 自定义品牌插件 —— 隐藏右上角帮助按钮与品牌标识，自定义登录页底部品牌文字。

[![NocoBase](https://img.shields.io/badge/NocoBase-2.x-blue)](https://www.nocobase.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](./LICENSE)

## 功能特性

- **隐藏右上角帮助按钮**：移除导航栏右上角的问号按钮及其下拉菜单（主页、用户手册、许可证链接）
- **隐藏品牌标识**：移除登录页底部的 "Powered by NocoBase" 文字
- **自定义登录页品牌**：在设置页配置 HTML 内容，显示在登录页底部（支持 `{{appVersion}}` 版本号占位符）
- **V1 + V2 双端支持**：同时兼容 NocoBase V1 和 V2 页面

## 工作原理

### 核心组件修改

本插件修改了 NocoBase 核心组件 `PoweredBy.tsx`（V1/V2 各一份），在品牌内容为空时返回 `null`（不渲染任何内容），而非默认的 "Powered by NocoBase"。

### 品牌显示逻辑

```
用户在设置页输入品牌 HTML（如 "Powered by Digit v2.2.7"）
→ 保存到 DB application_plugins.options
→ PoweredBy 组件读取 plugin.options.brand
→ 如果 brand 有值 → 渲染自定义 HTML（支持 {{appVersion}} 占位符）
→ 如果 brand 为空 → 不渲染任何内容（return null）
```

### 帮助按钮隐藏

V1/V2 插件的 `load()` 方法中：
- `hideDefaultHelp()`：about 为空时，通过 MutationObserver 找到 `[data-testid="help-button"]` 的父容器并设置 `display: none`
- 问号按钮隐藏后，导航栏其他元素不受影响

## 安装与启用

### 从 NPM 安装

```bash
yarn add @nocobase/plugin-custom-brand
yarn pm enable @nocobase/plugin-custom-brand
```

### 从源码安装

```bash
# 将插件放入 packages/plugins/@nocobase/plugin-custom-brand/
# 确保 tsconfig.paths.json 包含路径映射
yarn pm enable @nocobase/plugin-custom-brand
```

### 构建（生产环境）

```bash
# 源码安装环境推荐（跳过类型声明，避免 TS2307 错误）
yarn build @nocobase/plugin-custom-brand --tar --no-dts
```

## 使用指南

### 设置页面

进入 **设置 → 自定义品牌**（侧边栏菜单项）。

### 配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| 登录页底部品牌（HTML） | 登录页底部显示的 HTML 内容 | 空（不显示） |

支持的 HTML 示例：

```html
Powered by <span style="font-weight:600">Digit</span> {{appVersion}}
```

`{{appVersion}}` 占位符会自动替换为当前 NocoBase 版本号（如 `v2.2.7`）。

### 效果说明

| 配置状态 | 导航栏右上角 | 登录页底部 |
|----------|-------------|-----------|
| brand 为空（默认） | ❌ 问号按钮已隐藏 | ❌ 不显示任何内容 |
| brand 有值 | ❌ 问号按钮已隐藏 | ✅ 显示自定义 HTML |

## 文件结构

```
@nocobase/plugin-custom-brand/
├── src/
│   ├── client/                     # V1 客户端
│   │   ├── plugin.tsx              # 隐藏帮助按钮、注册设置页
│   │   ├── CustomBrandSettings.tsx  # V1 设置页面
│   │   └── index.tsx
│   ├── client-v2/                  # V2 客户端
│   │   ├── plugin.tsx              # 隐藏帮助按钮、注册设置菜单
│   │   ├── CustomBrandSettingsV2.tsx  # V2 设置页面
│   │   └── index.tsx
│   ├── server/
│   │   └── plugin.ts               # API：customBrand:get / customBrand:save
│   └── locale/
│       ├── zh-CN.json
│       └── en-US.json
├── package.json
├── client.js                       # V1 入口
├── client.d.ts
├── client-v2.js                    # V2 入口
├── client-v2.d.ts
├── server.js
├── server.d.ts
└── README.md
```

## API 接口

| 端点 | 方法 | 说明 |
|------|------|------|
| `customBrand:get` | GET | 获取品牌配置（about + brand） |
| `customBrand:save` | POST | 保存品牌配置 |

数据存储在 `application_plugins` 表的 `options` 字段中，结构为 `{ options: { about: "...", brand: "..." } }`（双层嵌套，与核心 PoweredBy 组件读取路径一致）。

## 依赖

| 依赖 | 版本 | 说明 |
|------|------|------|
| `@nocobase/client` | 2.x | V1 客户端框架 |
| `@nocobase/client-v2` | 2.x | V2 客户端框架 |
| `@nocobase/flow-engine` | 2.x | FlowEngine（V2 设置菜单注册） |
| `@nocobase/server` | 2.x | 服务端框架 |
| `@nocobase/utils` | 2.x | 工具函数（parseHTML） |

## 开发

```bash
# 开发模式（热重载）
yarn dev

# 构建
yarn build @nocobase/plugin-custom-brand --tar --no-dts

# ESLint
yarn eslint packages/plugins/@nocobase/plugin-custom-brand/src --fix
```

## 已知限制

- 本插件修改了 NocoBase 核心组件 `PoweredBy.tsx`（V1 + V2 各一份），升级 NocoBase 版本时需检查是否产生冲突
- 登录页底部品牌仅支持 HTML 字符串，不支持 React 组件或模板引擎
- V1 和 V2 的设置页面独立实现（`CustomBrandSettings.tsx` / `CustomBrandSettingsV2.tsx`），功能一致

## License

[Apache-2.0](./LICENSE)
