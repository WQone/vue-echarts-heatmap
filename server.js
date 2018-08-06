const http = require('http');
const fs = require('fs');

const mineType = require('./mineType');

const documentRoot = './dist/';

const server = http.createServer((req, res) => {
  const url = req.url;
  let file = documentRoot + url;

  const arr = url.split('/');

  // console.log(arr);

  if (arr.length > 1 && (!arr[1] || /\?/.test(arr[1]))) {
    file = `${documentRoot}index.html`;
  } else if (arr[arr.length - 1].indexOf('.') === -1 || /\?/.test(arr[arr.length - 1])) {
    file = `${documentRoot}${url}index.html`;
  }

  // console.log('url', url, file, documentRoot);

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHeader(404, {
        'content-type': 'text/html;charset="utf-8"',
      });
      res.write('<h1>404</h1>');
      res.end();
    } else {
      const nameReg = new RegExp(/(\.([^.]+))$/);
      const name = url.match(nameReg);
      if (name && mineType[name[0]]) {
        res.writeHeader(200, {
          'content-type': `${mineType[name[0]]};charset="utf-8"`,
        });
      } else {
        res.writeHeader(200, {
          'content-type': 'text/html;charset="utf-8"',
        });
      }
      res.write(data);
      res.end();
    }
  });
}).listen(8585);

console.log('------------------------------------');
console.log('server run');
