// took from: https://stackoverflow.com/questions/51419039/spdy-http2-push-throws-exception-in-angular-6-ssr
const fs = require('fs')
const path = require('path')
const file = path.join(
    process.cwd(),
    'node_modules/spdy-transport/lib/spdy-transport/priority.js'
)

const data = fs
    .readFileSync(file)
    .toString()
    .split('\n')
if (data.length < 190) {
    data.splice(73, 0, '/*')
    data.splice(75, 0, '*/')
    data.splice(
        187,
        0,
        `
    var index = utils.binarySearch(this.list, node, compareChildren);
    this.list.splice(index, 1);
`
    )
    const text = data.join('\n')

    fs.writeFile(file, text, function(err) {
        if (err) return console.log(err)
    })
}
