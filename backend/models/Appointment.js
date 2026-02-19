import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30
  },
  status: {
    type: String,
    enum: [
      'scheduled',
      'confirmed',
      'checked-in',
      'in-progress',
      'completed',
      'cancelled',
      'no-show'
    ],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: [
      'consultation',
      'follow-up',
      'emergency',
      'check-up',
      'procedure'
    ],
    default: 'consultation'
  },
  reason: {
    type: String,
    required: true
  },
  symptoms: [String],
  diagnosis: String,
  prescription: String,
  notes: String,
  verifiedByBiometric: {
    type: Boolean,
    default: false
  },
  biometricVerificationTime: Date,
  checkedInTime: Date,
  cancelledReason: String
}, {
  timestamps: true
});

export default mongoose.model('Appointment', appointmentSchema);
