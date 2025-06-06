const express = require('express')
const cors = require('cors')
const path = require('path')
const pinoHttp = require('pino-http')

//宣告資料表路由的變數，賦值為載入個資料表的路由檔案資料給變數
const logger = require('./utils/logger')('App')
const creditPackageRouter = require('./routes/creditPackage')
const skillRouter = require('./routes/skill')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(pinoHttp({
  logger,
  serializers: {
    req (req) {
      req.body = req.raw.body
      return req
    }
  }
}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/healthcheck', (req, res) => {
  res.status(200)
  res.send('OK')
})
//在訪問使用api網址時會載入資料表的設定
app.use('/api/credit-package', creditPackageRouter)
app.use('/api/skill', skillRouter)
app.use('/api/users', userRouter)
app.use('/api/admin', adminRouter)

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  req.log.error(err)
  res.status(500).json({
    status: 'error',
    message: '伺服器錯誤'
  })
})

module.exports = app
