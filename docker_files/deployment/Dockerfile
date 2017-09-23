FROM karakurifarmweb_web

RUN apk add --no-cache python3

RUN pip3 install --upgrade --user awscli && \
    echo 'export PATH=~/.local/bin:$PATH' > ~/.profile && \
    source ~/.profile && \
    aws configure set preview.cloudfront true

WORKDIR /app
