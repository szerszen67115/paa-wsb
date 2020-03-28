const router = require('koa-router')()
const store = require('../store')

router.prefix('/tasks')

router.post('/add', async (ctx, next) => {
    var taskTitle = ctx.request.body.title
    if (taskTitle != null && taskTitle.length > 0) {
        await store.createTask(ctx.request.body.title, ctx.request.body.description)
        ctx.redirect('/')
    } else {
        ctx.redirect('/error')
    }
})

router.post('/updateStatus', async (ctx, next) => {
    const { id, status } = ctx.request.body
    await store.updateTaskStatus(id, status)
    ctx.status = 200
})

router.post('/deleteTask', async (ctx, next) => {
    const { id } = ctx.request.body
    await store.deleteTask(id)
    ctx.status = 200
})

module.exports = router