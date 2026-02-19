import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalRecordNumber: {
    type: String,
    unique: true,
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  allergies: [{
    type: String
  }],
  chronicConditions: [{
    condition: String,
    diagnosedDate: Date,
    status: String
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    groupNumber: String
  },
  biometricEnabled: {
    type: Boolean,
    default: false
  },
  biometricTemplate: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

// ✅ Export as ES module default
export default mongoose.model('Patient', patientSchema);
