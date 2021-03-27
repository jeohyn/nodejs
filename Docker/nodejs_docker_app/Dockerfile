#useing node, version 10
#node:one of basic images that has npm
FROM node:10

#structure image
#save app files in workdir, not with base image
WORKDIR /usr/src/app

#package.json을 컨테이너(./) 안에 넣어줌
#만약 app의 코드가 변할 때도 여기서 package.json 대신 ./을 넣으면
#app 코드 변할 때마다 계속 종속성(package.json)을 모두 다시 다운받게됨=>비효율적
#여기에 ./ 대신 package.json을 넣으면 
#package.json이 변경되지 않는 한 RUN명령 수행 후 COPY 시 종속성을 다시 다운받지 않고 캐시에 저장된 종속성을 사용하게 됨
COPY package.json ./


RUN npm install

#현 디렉터리의 모든 파일(./)(package.json, server.js, Dockerfile, ...)을 컨테이너(두번째 ./) 안에 넣어줌
COPY ./ ./

CMD ["node", "server.js"]