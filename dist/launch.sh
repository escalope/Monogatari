docker run  -p 443:443 \
   -v $PWD:/usr/share/nginx/html \
   -v $PWD:/etc/nginx/html \
   -v $PWD/sample.conf:/etc/nginx/conf.d/sample.conf \
   -v $PWD/certs:/certs \
   nginx  
