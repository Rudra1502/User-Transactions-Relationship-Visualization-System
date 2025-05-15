FROM node:20-alpine
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER appuser
ENV NODE_ENV=production
EXPOSE 8080
CMD ["npm", "start"]
