const router = require('koa-router')()
const store = require('../store')

router.prefix('/tasks')

router.post('/add', async (ctx, next) => {
    var taskTitle = ctx.request.body.title
    if (taskTitle != null && taskTitle.length() > 0) {
        await store.createTask(ctx.request.body.title, ctx.request.body.description)
        ctx.redirect('/')
    } else {
        ctx.redirect('/error')
    }
})

module.exports = router