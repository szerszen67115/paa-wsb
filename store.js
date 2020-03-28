const storage = require('azure-storage')
var retryOperations = new storage.ExponentialRetryPolicyFilter(1);
const service = storage.createTableService().withFilter(retryOperations)
const table = 'tasks'

function LoggingFilter() {
    this.handle = (requestOptions, next) => {
        console.log(requestOptions)
        next(requestOptions, (returnObject, finalCallback, next) => {
            console.log(returnObject)
        })
    }
}

const init = async () => (
    new Promise((resolve, reject) => {
        service.createTableIfNotExists(table, (error, result, response) => {
            !error ? resolve() : reject()
        })
    })
)

module.exports = {
    init
}