const { z } = require('zod');

const id = z.coerce.number().int().positive();
const optionalText = z.string().trim().max(1000).optional();

const register = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
});

const login = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

const patient = z.object({
  name: z.string().trim().min(2).max(100),
  age: z.number().int().min(0).max(150),
  gender: z.enum(['male', 'female', 'other']),
  address: optionalText,
  medicalHistory: optionalText,
});

const doctor = z.object({
  name: z.string().trim().min(2).max(100),
  specialization: z.string().trim().min(2).max(100),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(7).max(20).optional(),
  experienceYears: z.number().int().min(0).max(80).optional(),
});

const nonEmpty = (obj) => Object.keys(obj).length > 0;
const patientUpdate = patient.partial().refine(nonEmpty, { message: 'Provide at least one field to update' });
const doctorUpdate = doctor.partial().refine(nonEmpty, { message: 'Provide at least one field to update' });

const mapping = z.object({ patientId: id, doctorId: id });
const idParam = z.object({ id });
const patientIdParam = z.object({ patientId: id });

module.exports = {
  register, login, patient, doctor, patientUpdate, doctorUpdate,
  mapping, idParam, patientIdParam,
};
