const { spawn } = require('child_process')

var generateProcesses = []
var workQueue = []

// Dequeues from the work queue and manages the work assigned to processes
function manageWorkQueue()
{
    if (workQueue.length > 0)
    {
        // Find a process that is not working on anything right now
        var availableGenerateProcess
        for (let idx = 0; idx < generateProcesses.length; ++idx) {
            if (!generateProcesses[idx].working)
            {
                availableGenerateProcess = generateProcesses[idx]
                break
            }
        }

        // Assign work to the process if there is one available
        if (availableGenerateProcess != null)
        {
            const workItem = workQueue.shift()
            availableGenerateProcess.working = true
            availableGenerateProcess.stdout.removeAllListeners('data')
            availableGenerateProcess.stdout.addListener('data', workItem.callback)
            availableGenerateProcess.stdout.addListener('data', function(data)
            {
                availableGenerateProcess.working = false
            })

            availableGenerateProcess.stdin.write(workItem.file + '\n')
        }
        // Call this again quickly
        setTimeout(manageWorkQueue, 10)
    }
    else
    {
        // Wait for 100ms if nothing is coming in right now, should lower server costs a little
        setTimeout(manageWorkQueue, 100)
    }
}

module.exports.push = function(element)
{
    workQueue.push(element)
}

module.exports.start = function(pythonPath, generator, processCount)
{
    // Create processes on startup
    for (let idx = 0; idx < processCount; idx++) {
        // Runs python on the script at generator/test.py with a pipe set up to stdin and stdout, 
        // stderr goes directly to the console
        generateProcesses[idx] = spawn(pythonPath, [generator], 
            {stdio: ['pipe', 'pipe', 'inherit']})
        generateProcesses[idx].working = false
    }
    console.log('Initailized ' + generateProcesses.length + ' generator processes')

    manageWorkQueue()
}
