# ---------- Stage 1: Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

# ติดตั้ง pnpm ผ่าน corepack (มากับ node image อยู่แล้ว ไม่ต้องลง npm install -g)
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# ข้าม prepare script (husky) ตอน install ใน container — ไม่จำเป็นและไม่มี git ให้ใช้
# approve build scripts ที่จำเป็น (bcrypt ต้อง compile native addon, esbuild ต้องโหลด binary)
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm run build

# ---------- Stage 2: Production ----------
FROM node:22-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# ติดตั้งเฉพาะ production dependencies เท่านั้น (ไม่มี devDependencies)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# copy เฉพาะ output ที่ build แล้วจาก stage แรก
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]