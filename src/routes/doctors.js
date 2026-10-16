const router = require('express').Router();
const c = require('../controllers/doctors');

router.route('/').post(c.create).get(c.list);
router.route('/:id').get(c.getOne).put(c.update).delete(c.remove);

module.exports = router;
