const store = require('../store')
const router = require('koa-router')()
const moment = require("moment")

router.get('/', async (ctx, next) => {
  tasks = await store.listTasks()
  tasks.sort(function (a, b) {
    return a.modyficationDate - b.modyficationDate
  })

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].description == null) {
      tasks[i].description = "brak opisu"
    }
    tasks[i].modyficationDate = moment(tasks[i].modyficationDate).format('MMMM Do YYYY, h:mm:ss a');
  }

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
