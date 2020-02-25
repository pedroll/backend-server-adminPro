BACKEND-SERVER para aplicacion adminPro, angular avanzado MEAN
======
La aplicacion utiliza como base de datos mongo para levantar el servidor:
``` bash
// con el shell alias
startmongo
// del comando
mongod --config /usr/local/etc/mongod.conf --fork
```
scripts:
```
"start": "node ./bin/www",
"startmon": "nodemon ./bin/www"
```
