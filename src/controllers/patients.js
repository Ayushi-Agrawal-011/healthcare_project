const { Patient, Mapping, Doctor } = require('../models');
const s = require('../validators/schemas');
const { HttpError, asyncHandler } = require('../utils/http');

// Returns the patient only if it belongs to the logged-in user.
// 404 (not 403) so we don't reveal that another user's record exists.
const getOwned = async (id, userId, options = {}) => {
  const patient = await Patient.findByPk(id, options);
  if (!patient || patient.createdById !== userId) throw new HttpError(404, 'Patient not found');
  return patient;
};

exports.create = asyncHandler(async (req, res) => {
  const data = s.patient.parse(req.body);
  const patient = await Patient.create({ ...data, createdById: req.user.id });
  res.status(201).json(patient);
});

exports.list = asyncHandler(async (req, res) => {
  const patients = await Patient.findAll({
    where: { createdById: req.user.id },
    order: [['id', 'DESC']],
  });
  res.json(patients);
});

exports.getOne = asyncHandler(async (req, res) => {
  const { id } = s.idParam.parse(req.params);
  const patient = await getOwned(id, req.user.id, {
    include: [{ model: Mapping, as: 'mappings', include: [{ model: Doctor, as: 'doctor' }] }],
  });
  res.json(patient);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = s.idParam.parse(req.params);
  const data = s.patientUpdate.parse(req.body);
  const patient = await getOwned(id, req.user.id);
  await patient.update(data);
  res.json(patient);
});

exports.remove = asyncHandler(async (req, res) => {
  const { id } = s.idParam.parse(req.params);
  const patient = await getOwned(id, req.user.id);
  await patient.destroy();
  res.json({ message: 'Patient deleted successfully' });
});
