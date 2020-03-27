const storage = require('azure-storage')
const service = storage.createTableService()
const table = 'tasks'
var retryOperations = new azure.ExponentialRetryPolicyFilter(1);

const init = async () => (
    new Promise((resolve, reject) => {
        service.createTableIfNotExists(table, (error, result, response) => {
            !error ? resolve() : reject()
        }).withFilter(retryOperations);
    })
)

module.exports = {
    init
}