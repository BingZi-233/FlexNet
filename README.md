# Nuxt Minimal Starter

## Getting Started

## Environment Variables Configuration

### 1. Environment Files Usage
- `.env.development` - 本地开发环境配置
- `.env.production` - 生产环境配置

### 2. Template Usage
```bash
cp .env.example .env.development
# 根据实际环境修改以下值：
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_admin_key
```

### 3. Security Practices
⚠️ 密钥保护要求：
1. 永远不要提交`.env.*`文件到版本控制
2. 生产环境密钥应通过CI/CD管道注入
3. 客户端密钥与管理员密钥必须分离使用

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
