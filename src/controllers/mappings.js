const { Patient, Doctor, Mapping } = require('../models');
const s = require('../validators/schemas');
const { HttpError, asyncHandler } = require('../utils/http');

exports.create = asyncHandler(async (req, res) => {
  const { patientId, doctorId } = s.mapping.parse(req.body);

  const patient = await Patient.findByPk(patientId);
  if (!patient || patient.createdById !== req.user.id) throw new HttpError(404, 'Patient not found');

  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) throw new HttpError(404, 'Doctor not found');

  const mapping = await Mapping.create({ patientId, doctorId });
  res.status(201).json({ ...mapping.toJSON(), patient, doctor });
});

// All mappings for the logged-in user's patients
exports.list = asyncHandler(async (req, res) => {
  const mappings = await Mapping.findAll({
    include: [
      { model: Patient, as: 'patient', where: { createdById: req.user.id } },
      { model: Doctor, as: 'doctor' },
    ],
    order: [['id', 'DESC']],
  });
  res.json(mappings);
});

exports.byPatient = asyncHandler(async (req, res) => {
  const { patientId } = s.patientIdParam.parse(req.params);
  const patient = await Patient.findByPk(patientId, {
    include: [{ model: Mapping, as: 'mappings', include: [{ model: Doctor, as: 'doctor' }] }],
  });
  if (!patient || patient.createdById !== req.user.id) throw new HttpError(404, 'Patient not found');

  res.json({
    patient: { id: patient.id, name: patient.name },
    doctors: patient.mappings.map((m) => ({
      mappingId: m.id,
      assignedAt: m.createdAt,
      ...m.doctor.toJSON(),
    })),
  });
});

exports.remove = asyncHandler(async (req, res) => {
  const { id } = s.idParam.parse(req.params);
  const mapping = await Mapping.findByPk(id, { include: [{ model: Patient, as: 'patient' }] });
  if (!mapping || mapping.patient.createdById !== req.user.id) throw new HttpError(404, 'Mapping not found');

  await mapping.destroy();
  res.json({ message: 'Doctor removed from patient successfully' });
});
