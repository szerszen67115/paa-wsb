const moment = require("moment")
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

const updateTaskStatus = async (id, status) => (
    new Promise((resolve, reject) => {
        const generator = storage.TableUtilities.entityGenerator
        const modyficationDate = Date.now()
        const task = {
            PartitionKey: generator.String('task'),
            RowKey: generator.String(id),
            modyficationDate: modyficationDate,
            status
        }

        service.mergeEntity(table, task, (error, result, response) => {
            !error ? resolve() : reject()
        })
    })
)

const deleteTask = async (id) => {
    new Promise((resolve, reject) => {
        const generator = storage.TableUtilities.entityGenerator
        const task = {
            PartitionKey: generator.String('task'),
            RowKey: generator.String(id)
        }
        service.deleteEntity(table, task, (error, result, response) => {
            !error ? resolve() : reject()
        })
    })
}

const createTask = async (title, description) => (
    new Promise((resolve, reject) => {
        const generator = storage.TableUtilities.entityGenerator
        const modyficationDate = Date.now()
        const task = {
            PartitionKey: generator.String('task'),
            RowKey: generator.String(uuid.v4()),
            title: title,
            description: description,
            modyficationDate: modyficationDate,
            status: 'open'
        }

        service.insertEntity(table, task, (error, result, response) => {
            !error ? resolve() : reject()
        })
    })
)

const listTasks = async () => (
    new Promise((resolve, reject) => {
        const query = new storage.TableQuery()
            .select(['RowKey','title', "description", "modyficationDate", 'status'])
            .where('PartitionKey eq ?', 'task')

        service.queryEntities(table, query, null, (error, result, response) => {
            !error ? resolve(result.entries.map((entry) => ({
                id: entry.RowKey._,
                title: entry.title._,
                description: entry.description._,
                modyficationDate: entry.modyficationDate._,
                status: entry.status._
            }))) : reject()
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
    createTask,
    listTasks,
    updateTaskStatus,
    deleteTask
}