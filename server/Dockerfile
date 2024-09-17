# Node.js 이미지 기반
FROM node:14

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 파일 복사
COPY . .

# 서버 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "server.js"]