var fs = require('fs')

const checkpointFile = './config/checkpoints.json'
const settingsFile = './config/settings.json'

module.exports.checkpoints = JSON.parse(fs.readFileSync(checkpointFile, 'utf8'))
var settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'))
module.exports.pythonPath = settings.pythonPath;
module.exports.generatorScript = settings.generatorScript;
module.exports.port = settings.port;

console.log('Settings Loaded')