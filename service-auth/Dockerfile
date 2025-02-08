FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 4000

# Jalankan aplikasi dengan Bun
CMD ["bun", "run", "src/server.ts"]
