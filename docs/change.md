# 变更记录

## 2026-05-24 20:15:00

### 改动内容

1. **优化 README.md**
    - 补充项目简介、特性与技术栈说明
    - 增加目录结构、环境变量、SSR 流程与端口说明
    - 完善开发与生产构建命令说明，保留相关模板链接

### Commit Message

```
docs: 优化 README 项目说明与使用文档
```

## 2026-05-24 18:32:00

### 改动内容

1. **修复 dev SSR 误处理 source map 等静态资源请求**
    - `vite.config.dev.ts`：新增 `shouldRenderSSR`，仅对 HTML 页面导航走 SSR
    - 跳过 `/@`、`/sm/`、`/src/`、带扩展名、`/api/` 等应由 Vite 处理的请求
    - 完善 catch 分支，非 SSR 请求失败时正确 `next(e)` 传递

### Commit Message

```
fix: dev SSR 中间件跳过 source map 与非页面请求
```

## 2026-05-24 18:25:00

### 改动内容

1. **修复 SSR 渲染 `ReferenceError: window is not defined`**
    - `pages/Article.tsx`：将 `window.$timeout` 清理逻辑从 render 函数体移入 `useEffect`，避免服务端渲染时访问浏览器 API

### Commit Message

```
fix: 修复 Article 页 SSR 时访问 window 导致崩溃
```

## 2026-05-24 18:20:00

### 改动内容

1. **修复 Vite 开发 SSR 运行时 `req.get is not a function`**
    - `createFetchRequest.ts`：抽象 `ISSRRequest` / `ISSRResponse`，兼容 Connect（Vite dev）与 Express（生产）
    - Host / Protocol / Path 改从 `headers` 与 `x-forwarded-proto` 读取，不再依赖 Express 专有 API
    - 新增 `getRequestCookies`、`setRedirectResponse` 供 SSR 渲染复用
    - `App.tsx`、`index.server.tsx` 同步改用通用 SSR 请求/响应类型

### Commit Message

```
fix: 修复 Vite 开发 SSR 下 Connect req 不兼容 Express API 的问题
```

## 2026-05-24 18:16:00

### 改动内容

1. **修复剩余 5 项 TypeScript 编译错误**
    - `api/index-client.ts`：为 `file` 方法参数补充 `url`、`data` 显式类型
    - `shims-global.d.ts`：`$timeout` 值类型改为 `number`（浏览器 `setTimeout` 返回值）
    - `stores/index.ts`：`hydrate` / `dehydrate` 改为显式 `topics` / `article` 分支，消除联合类型关联推断失败

### Commit Message

```
fix: 修复 index-client、useAutoScroll 与 stores 剩余 TS 错误
```

## 2026-05-24 18:00:00

### 改动内容

1. **修复 TypeScript 编译错误（22 项）**
    - `shims-global.d.ts`：将 `Window` 等全局声明移入 `declare global`，修复 `$timeout`、`__PREFETCHED_STATE__` 无法识别
    - `stores/index.ts`：`PickKeys` 改用 `infer _` 匹配 `PrefetchStore`；`dehydrate` 中 `{}` 后补分号避免 ASI 误解析
    - `api/articleApi.ts`：详情接口参数展开为 `{ ...config }` 以兼容 `Record<string, unknown>`
    - `api/config-server.ts`：`LRUCache` 泛型由 `unknown` 改为 `AxiosResponse`
    - `api/index-client.ts`：`file` 方法补充泛型 `<T>` 与 `checkHttpStatus<T>` / `checkBusinessCode<T>`
    - `api/index-server.ts`：Axios `headers` 断言为 `AxiosRequestHeaders`
    - `main.tsx`：移除 `.tsx` 扩展名导入
    - `pages/Home.tsx`：移除未使用的 `useMemo` 导入
    - `index.server.tsx`：`serialize` 参数类型对齐 `dehydrate` 返回值

### Commit Message

```
fix: 修复 tsc -b --noEmit 全部 TypeScript 编译错误
```

## 2026-05-24

### 改动内容

1. **目录结构对齐规范**
    - `routes/` → `router/`（`createBrowserRouter` + Route Loader）
    - `composables/` → `hooks/`（`useAutoScroll`）
    - `types.ts` 拆分为 `types/`（`api.ts`、`article.ts`）
    - 新增 `utils/`、`components/`、`layouts/`、`assets/`

2. **路由与 SSR**
    - 使用 `createBrowserRouter` + `RouterProvider`（客户端）
    - 使用 `createStaticHandler` + `StaticRouterProvider`（服务端）
    - Loader 内调用 MobX Store 预取数据，保留 `hydrate` / `dehydrate` 序列化
    - 新增 `utils/createFetchRequest.ts` 适配 Express → Fetch Request
    - 修复动态路由 `/article/:id` 的 SSR 预取（由 Loader + `params.id` 驱动）

3. **API 与类型**
    - 新增 `utils/request.ts` 统一 HTTP 状态与业务码处理
    - 新增 `api/articleApi.ts` 模块化接口
    - 引入 `IApiResponse<T>`、`IArticle` 等 `I` 前缀类型
    - `api/url.js` 改为环境变量 `VITE_SERVER_URL` / `VITE_API_BASE_URL`
    - 新增 `.env.example`

4. **Store**
    - `stores/modules/topics.ts` → `home.ts`（`HomeStore`）
    - `dehydra` 更名为 `dehydrate`，移除 `hydrate` 中的 `any`

5. **UI 与样式**
    - 新增 `layouts/MainLayout.tsx`、`components/AppProvider.tsx`
    - 新增 `styles/antd-theme.ts`，根布局使用 `ConfigProvider`
    - 页面布局迁移至 UnoCSS 原子类，移除 `style={{ display: 'none' }}` hack
    - 移除 `ahooks` 自动导入，页面改用原生 `useEffect`

6. **精简**
    - `App.tsx` 仅保留 `IRenderContext` 类型定义
    - 删除页面级 `prefetch` 导出
    - 新增 `main.tsx` 客户端入口 re-export
    - 新增 `components/PageContainer.tsx` 统一页面容器

### Commit Message

```
refactor: 对齐 Cursor 规则重构目录、数据路由与 API 层

- 迁移 createBrowserRouter + Loader 驱动 MobX SSR 预取
- 统一 types/utils/api 模块与 I 前缀接口命名
- 引入 layouts/components，样式改用 UnoCSS
```
