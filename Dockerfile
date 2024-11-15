FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno install
RUN deno task build

CMD ["run", "--allow-env", "--env-file", "--allow-read", "--allow-net", "api/main.ts"]
