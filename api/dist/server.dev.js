"use strict";

var express = require('express');

var path = require('path');

var fs = require('fs');

var fileUpload = require('express-fileupload');

var cors = require('cors');

var sharp = require('sharp');

var app = express();
bodyParser = require("body-parser");
port = 3080;
app.use(cors()); // it enables all cors requests

app.use(fileUpload());
app.use(bodyParser.json());
app.use(express["static"](path.join(__dirname, '../image-viewer/public')));
app.use(express["static"](path.join(__dirname, './public')));
app.post('/loadPhotos', function _callee(req, res) {
  var myFiles, promises, i;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.body.files) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", res.status(500).send({
            msg: "file is not found"
          }));

        case 2:
          myFiles = req.body.files;
          promises = [];

          if (!Array.isArray(myFiles)) {
            promises.push(readFile(myFiles));
          } else {
            for (i = 0; i < myFiles.length; i++) {
              promises.push(readFile(myFiles[i]));
            }
          }

          Promise.all(promises).then(function (result) {
            res.send(result);
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.listen(port, function () {
  console.log("Server listening on the port::".concat(port));
});

function readFile(file) {
  return new Promise(function (resolve, reject) {
    console.log(file);
    return fs.readFile(file, function (err, data) {
      return fs.appendFile("".concat(__dirname, "/public/").concat(path.basename(file)), data, function _callee2(error) {
        var image;
        return regeneratorRuntime.async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(path.extname(path.basename(file)) === '.bmp')) {
                  _context2.next = 4;
                  break;
                }

                resolve({
                  name: path.basename(file),
                  path: "/".concat(path.basename(file)),
                  metadata: {
                    name: path.basename(file),
                    format: 'bmp'
                  }
                });
                _context2.next = 8;
                break;

              case 4:
                image = sharp("".concat(__dirname, "/public/").concat(path.basename(file)));
                _context2.next = 7;
                return regeneratorRuntime.awrap(image.metadata().then(function (metadata) {
                  result = {
                    name: path.basename(file),
                    path: "/".concat(path.basename(file)),
                    metadata: metadata
                  };
                  resolve(result);
                }));

              case 7:
                return _context2.abrupt("return", _context2.sent);

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        });
      });
    });
  });
}