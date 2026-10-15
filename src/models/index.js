const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

const Patient = sequelize.define('Patient', {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  address: DataTypes.TEXT,
  medicalHistory: DataTypes.TEXT,
});

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING, allowNull: false },
  specialization: { type: DataTypes.STRING, allowNull: false },
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  experienceYears: DataTypes.INTEGER,
});

const Mapping = sequelize.define(
  'Mapping',
  {
    patientId: { type: DataTypes.INTEGER, allowNull: false },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { indexes: [{ unique: true, fields: ['patientId', 'doctorId'] }] }
);

// Relationships (foreign keys)
User.hasMany(Patient, { foreignKey: { name: 'createdById', allowNull: false }, onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'createdById' });

User.hasMany(Doctor, { foreignKey: { name: 'createdById', allowNull: false }, onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'createdById' });

Patient.hasMany(Mapping, { as: 'mappings', foreignKey: 'patientId', onDelete: 'CASCADE' });
Mapping.belongsTo(Patient, { as: 'patient', foreignKey: 'patientId' });

Doctor.hasMany(Mapping, { as: 'mappings', foreignKey: 'doctorId', onDelete: 'CASCADE' });
Mapping.belongsTo(Doctor, { as: 'doctor', foreignKey: 'doctorId' });

module.exports = { sequelize, User, Patient, Doctor, Mapping };
