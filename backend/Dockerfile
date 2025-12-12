#---- Build stage ----
FROM gradle:8.8-jdk21 AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
# 動作確認（任意）
RUN gradle --version
# 残りのソース
COPY src ./src
# ビルド
RUN gradle clean bootJar -x test

# ---- Run stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/build/libs/app.jar /app/app.jar
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
