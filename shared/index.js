const Fs = require('fs');
const Mime = require('mime')
const Path = require('path')

const imagesDir = `${__dirname}/../assets/`;

module.exports = {
    certificate: {
        key: Fs.readFileSync(`${__dirname}/../certificate/localhost.key`),
        cert: Fs.readFileSync(`${__dirname}/../certificate/localhost.crt`)
    },
    getFiles: () => {
        const files = new Map()

        Fs.readdirSync(imagesDir).forEach((fileName) => {
          const filePath = Path.join(imagesDir, fileName)
          const fileDescriptor = Fs.openSync(filePath, 'r')
          const stat = Fs.fstatSync(fileDescriptor)
          const contentType = Mime.getType(filePath)
      
          files.set(`/${fileName}`, {
            filePath,
            fileDescriptor,
            headers: {
              'content-length': stat.size,
              'last-modified': stat.mtime.toUTCString(),
              'content-type': contentType
            }
          })
        })
      
        return files
    },
    getFileHttp1: (reqPath) => {
        const filePath = Path.join(imagesDir, reqPath);
        const content = Fs.readFileSync(filePath);
        return {
            content,
            contentType: Mime.getType(filePath)
        }
    }
}
