# Cloudflare Pages 自动化部署配置

## 需要配置的 GitHub Secrets

在 GitHub 仓库设置 → Secrets and variables → Actions 中添加：

### 1. CLOUDFLARE_API_TOKEN

获取方式：
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **个人资料** → **API 令牌**
3. 点击 **创建令牌** → **编辑 Cloudflare Pages**
4. 设置以下权限：
   - **Account Resources**: Read
   - **User**: None
   - **Zone**: None
   - **Account Settings**: None
5. 或者直接使用 **Cloudflare Pages 编辑** 模板

### 2. CLOUDFLARE_ACCOUNT_ID

你的 Account ID: `0f0103845b5e7652f7ff394f2cde3098`

---

## 配置步骤

1. Fork 本仓库到你的 GitHub
2. 在你的 Fork 仓库中：
   - 进入 **Settings** → **Secrets and variables** → **Actions**
   - 点击 **New repository secret**
   - 添加 `CLOUDFLARE_API_TOKEN`
   - 添加 `CLOUDFLARE_ACCOUNT_ID` = `0f0103845b5e7652f7ff394f2cde3098`

3. 在 Cloudflare Dashboard：
   - 进入 **Pages** → **创建项目** → **连接到 Git**
   - 选择你的 Fork 仓库
   - 构建配置：
     ```
     构建命令: npm run build
     输出目录: dist
     ```

4. 完成后即可自动部署！

---

## 部署流程

每次推送到 `main` 分支时：
1. GitHub Actions 自动触发
2. 安装依赖
3. 构建项目（自动生成导航）
4. 部署到 Cloudflare Pages

---

## 预览部署

推送到 PR 时会自动创建预览链接。
