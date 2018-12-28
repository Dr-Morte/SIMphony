var express = require('express')
var exphbs = require('express-handlebars')
var app = express()
var config = require('./server_js/configManager')
var workerQueue = require('./server_js/workerQueue')

var serveCount = 0

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Try to serve compressed static content
app.get('**/*.js', function (req, res, next)
{
    res.set('Content-Type', 'application/javascript')
    if (req.acceptsEncodings('br') != false)
    {
        req.url = req.url + '.br'
        res.set('Content-Encoding', 'br')
        next()
    }
    else if (req.acceptsEncodings('gzip') != false)
    {
        req.url = req.url + '.gz'
        res.set('Content-Encoding', 'gzip')
        next()
    }
    else
    {
        next()
    }
})
app.get('*.css', function (req, res, next)
{
    res.set('Content-Type', 'text/css')
    if (req.acceptsEncodings('br') != false)
    {
        req.url = req.url + '.br'
        res.set('Content-Encoding', 'br')
        next()
    }
    else if (req.acceptsEncodings('gzip') != false)
    {
        req.url = req.url + '.gz'
        res.set('Content-Encoding', 'gzip')
        next()
    }
    else
    {
        next()
    }
})
// "public" folder gives static content
app.use(express.static('public'))

// Main page get request
app.get('/', function (req, res)
{
    // Render the home.handlebars file through the default main.handlebars layout
    res.render('home', 
    {
        checkpoints: config.checkpoints
    })
})

// GET requests to the simphony/generate url with a file name argument at the end
app.get('/generate/:file', function(req, res)
{
    console.log('recieved request ' + (++serveCount))

    // Add work to the queue, process data recieved in the callback function
    workerQueue.push({file: req.params.file, callback: function(data)
        {
            res.set('Content-Type', 'application/octet-stream')
            
            var byteArray = new Uint8Array(data)
            
            res.send(byteArray.join(' '))
        }})
})

workerQueue.start(config.pythonPath, config.generatorScript, 4)

// Listen for REST API requests on port 80 (the internet port)
app.listen(config.port)