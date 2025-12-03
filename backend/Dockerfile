#FROM amazoncorretto:21
FROM public.ecr.aws/amazoncorretto/amazoncorretto:21

WORKDIR /app

COPY build/libs/*.jar app.jar

# PostgreSQL
EXPOSE 5432
# http
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]