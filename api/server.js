const express = require('express');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const sharp = require('sharp');
const app = express();
bodyParser = require("body-parser");
port = 3080;
app.use(cors()); // it enables all cors requests
app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../image-viewer/public')));
app.use(express.static(path.join(__dirname, './public')));

app.post('/loadPhotos', async (req, res) => {
    if (!req.body.files) {
        return res.status(500).send({
            msg: "file is not found"
        })
    }
    const myFiles = req.body.files
    const promises = [];
    if (!Array.isArray(myFiles)) {
        promises.push(readFile(myFiles))
    } else {
        for (let i = 0; i < myFiles.length; i++) {
            promises.push(readFile(myFiles[i]))
        }
    }
    Promise.all(promises).then(function (result) {
        res.send(result);
    });
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

function readFile(file) {
    return new Promise(function (resolve, reject) {
        console.log(file)
        return fs.readFile(file, function (err, data) {
            return fs.appendFile(`${__dirname}/public/${path.basename(file)}`, data, async function (error) {
                if (path.extname(path.basename(file)) === '.bmp') {
                    resolve({
                        name: path.basename(file),
                        path: `/${path.basename(file)}`,
                        metadata: {
                            name: path.basename(file),
                            format: 'bmp'
                        }
                    });
                } else {
                    const image = sharp(`${__dirname}/public/${path.basename(file)}`)
                    return await image
                        .metadata()
                        .then(function (metadata) {
                            result = {
                                name: path.basename(file),
                                path: `/${path.basename(file)}`,
                                metadata
                            }
                            resolve(result);
                        })
                }
            });
        });
    });
}