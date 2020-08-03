FROM node:11-alpine
RUN apk add --update bash && rm -rf /var/cache/apk/*


COPY . /opt/

VOLUME ["/config"]
VOLUME ["/data"]



ENTRYPOINT ["node" ,"/opt/lib/index.js"]

CMD [] 
#RUN ["node", "/opt/lib/index.js"]
