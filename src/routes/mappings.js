const router = require('express').Router();
const c = require('../controllers/mappings');

router.route('/').post(c.create).get(c.list);
// GET /:patientId lists doctors of a patient; DELETE /:id removes a mapping
router.get('/:patientId', c.byPatient);
router.delete('/:id', c.remove);

module.exports = router;
