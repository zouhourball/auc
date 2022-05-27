# Build front-end files
FROM node:10 AS app-fe
WORKDIR /fecode
COPY . /fecode

ARG NPM_AUTH_TOKEN
ARG BUILD_PROFILE_NAME

# COPY package.json pnpm-lock.yaml ./

RUN curl -L https://unpkg.com/@pnpm/self-installer | node\
    && echo -e "@target-energysolutions:registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > .npmrc \
    && pnpm install

RUN pnpm run build

#RUN echo $BUILD_PROFILE_NAME && echo -e "@target-energysolutions:registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > .npmrc \
#    && yarn && yarn build

FROM registry.tespkg.in/library/nginx:alpine 
COPY --from=app-fe /fecode/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./nginx_proxy.conf /etc/nginx/nginx_proxy.conf
EXPOSE 80
RUN rm /usr/share/nginx/html/index.html.gz
ENV ENVA_ENV_FILES="/usr/share/nginx/html/index.html"
CMD ["nginx", "-g", "daemon off;"]

