import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  recordType: {
    type: String,
    enum: ['consultation', 'lab-result', 'imaging', 'prescription', 'vaccination', 'surgery', 'discharge-summary'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  diagnosis: [String],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    prescribedDate: Date
  }],
  labResults: [{
    testName: String,
    result: String,
    normalRange: String,
    unit: String,
    testDate: Date
  }],
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    height: Number,
    weight: Number,
    bmi: Number
  },
  attachments: [{
    filename: String,
    fileUrl: String,
    uploadedAt: Date
  }],
  isConfidential: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// ✅ Export as ES module default
export default mongoose.model('MedicalRecord', medicalRecordSchema);
