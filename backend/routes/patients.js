import express from 'express';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all patients
router.get('/', protect, authorize('admin', 'doctor', 'nurse', 'receptionist'), async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('userId', 'firstName lastName email phoneNumber');
    res.json({
      success: true,
      count: patients.length,
      patients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single patient
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('userId', 'firstName lastName email phoneNumber dateOfBirth address');
    
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }
    
    res.json({
      success: true,
      patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create patient
router.post('/', protect, async (req, res) => {
  try {
    const { userId, medicalRecordNumber, bloodType, allergies, emergencyContact, insuranceInfo } = req.body;
    
    const patient = await Patient.create({
      userId,
      medicalRecordNumber,
      bloodType,
      allergies,
      emergencyContact,
      insuranceInfo
    });
    
    res.status(201).json({
      success: true,
      patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update patient
router.put('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }
    
    res.json({
      success: true,
      patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Register biometric
router.post('/:id/biometric', protect, async (req, res) => {
  try {
    const { biometricTemplate } = req.body;
    
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        biometricEnabled: true,
        biometricTemplate
      },
      { new: true }
    );
    
    await User.findByIdAndUpdate(patient.userId, {
      biometricRegistered: true
    });
    
    res.json({
      success: true,
      message: 'Biometric registered successfully',
      patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
