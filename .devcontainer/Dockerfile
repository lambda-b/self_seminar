ARG VARIANT="jammy"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

ENV TZ=Asia/Tokyo
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=${PNPM_HOME}:${PATH}
ARG NODE_VERSION="24.12.0"
ARG PNPM_VERSION="10.25.0"

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
  && echo $TZ > /etc/timezone \
  && apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl xz-utils \
  && curl -fsSL https://raw.githubusercontent.com/tj/n/master/bin/n -o /usr/local/bin/n \
  && chmod +x /usr/local/bin/n \
  && n ${NODE_VERSION} \
  && corepack enable \
  && corepack prepare pnpm@${PNPM_VERSION} --activate \
  && pnpm add -g @openai/codex \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

CMD ["bash"]
