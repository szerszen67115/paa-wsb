const storage = require('azure-storage')
const uuid = require('uuid')
var retryOperations = new storage.ExponentialRetryPolicyFilter(1);
const service = storage.createTableService() //.withFilter(retryOperations).withFilter(LoggingFilter)
const table = 'tasks'

function LoggingFilter() {
    this.handle = (requestOptions, next) => {
        console.log("Request: " + JSON.stringify(requestOptions, null, 1))
        next(requestOptions, (returnObject, finalCallback, next) => {
            console.log("Response: " + JSON.stringify(returnObject, null, 1))
            finalCallback()
        })
    }
}

const createTask = async (title) => (
    new Promise((resolve, reject) => {
        const generator = storage.TableUtilities.entityGenerator
        const task = {
            PartitionKey: generator.String('task'),
            RowKey: generator.String(uuid.v4()),
            Title: title
        }

        service.insertEntity(table, task, (error, result, response) => {
            !error ? resolve() : reject()
        })
    })
)

const init = async () => (
    new Promise((resolve, reject) => {
        service.createTableIfNotExists(table, (error, result, response) => {
            !error ? resolve() : reject()
        })
    })
)

module.exports = {
    init,
    createTask
}