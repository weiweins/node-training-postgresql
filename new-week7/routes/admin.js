const express = require('express')

const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Admin')
const admin = require('../controllers/admin')

const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})
const isCoach = require('../middlewares/isCoach')

function isUndefined (value) {
  return value === undefined
}

function isNotValidSting (value) {
  return typeof value !== 'string' || value.trim().length === 0 || value === ''
}

function isNotValidInteger (value) {
  return typeof value !== 'number' || value < 0 || value % 1 !== 0
}

//新增教練課程資料
router.post('/coaches/courses', auth, isCoach, admin.postCourse)

router.get('/coaches/revenue', auth, isCoach, admin.getCoachRevenue)

router.get('/coaches/courses', auth, isCoach, admin.getCoachCourses)

//編輯教練課程資料
router.get('/coaches/courses/:courseId', auth, admin.getCoachCourseDetail)

router.put('/coaches/courses/:courseId', auth, admin.putCoachCourseDetail)

//資格確認及變更教練權限
router.post('/coaches/:userId', admin.postCoach)
router.put('/coaches', auth, isCoach, admin.putCoachProfile)

router.get('/coaches', auth, isCoach, admin.getCoachProfile)

module.exports = router