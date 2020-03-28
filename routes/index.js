const store = require('../store')
const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  tasks = await store.listTasks()
  console.log(tasks);
  await ctx.render('index', { tasks })
})

router.get('/error', async (ctx, next) => {
  await ctx.render('error', {
    messages: 'Tytuł nie może być pusty.'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
