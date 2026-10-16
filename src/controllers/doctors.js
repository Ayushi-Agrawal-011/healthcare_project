const { Doctor } = require('../models');
const s = require('../validators/schemas');
const { HttpError, asyncHandler } = require('../utils/http');

// Doctors are readable by any authenticated user, but only the creator can modify/delete.
const getForWrite = async (id, userId) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) throw new HttpError(404, 'Doctor not found');
  if (doctor.createdById !== userId) throw new HttpError(403, 'You can only modify doctors you created');
  return doctor;
};

exports.create = asyncHandler(async (req, res) => {
  const data = s.doctor.parse(req.body);
  const doctor = await Doctor.create({ ...data, createdById: req.user.id });
  res.status(201).json(doctor);
});

exports.list = asyncHandler(async (req, res) => {
  res.json(await Doctor.findAll({ order: [['id', 'DESC']] }));
});

exports.getOne = asyncHandler(async (req, res) => {
  const { id } = s.idParam.parse(req.params);
  const doctor = await Doctor.findByPk(id);
  if (!doctor) throw new HttpError(404, 'Doctor not found');
  res.json(doctor);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = s.idParam.parse(req.params);
  const data = s.doctorUpdate.parse(req.body);
  const doctor = await getForWrite(id, req.user.id);
  await doctor.update(data);
  res.json(doctor);
});

exports.remove = asyncHandler(async (req, res) => {
  const { id } = s.idParam.parse(req.params);
  const doctor = await getForWrite(id, req.user.id);
  await doctor.destroy();
  res.json({ message: 'Doctor deleted successfully' });
});
