# 变更记录

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
