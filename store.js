const storage = require('azure-storage')
var retryOperations = new azure.ExponentialRetryPolicyFilter(1);
const service = storage.createTableService().withFilter(retryOperations)
const table = 'tasks'

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