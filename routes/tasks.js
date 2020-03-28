const router = require('koa-router')()
const store = require('../store')

router.prefix('/tasks')

router.post('/add', async (ctx, next) => {
    await store.createTask(ctx.request.body.title, ctx.request.body.description)
    ctx.redirect('/')
})

module.exports = router