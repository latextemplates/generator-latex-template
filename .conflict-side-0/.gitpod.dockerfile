FROM gitpod/workspace-full

COPY . /home/gitpod

RUN npm run-script build

RUN npm install -g yo
