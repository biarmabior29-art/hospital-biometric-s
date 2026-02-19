import express from 'express';
import Patient from '../models/Patient.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Simulate biometric scan
router.post('/verify', protect, async (req, res) => {
  try {
    const { patientId, biometricData } = req.body;
    
    const patient = await Patient.findById(patientId).select('+biometricTemplate');
    
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }
    
    if (!patient.biometricEnabled) {
      return res.status(400).json({ 
        success: false, 
        message: 'Biometric not registered for this patient' 
      });
    }
    
    // Simulate biometric verification (95% success rate)
    const isVerified = Math.random() < 0.95;
    
    if (isVerified) {
      res.json({
        success: true,
        message: 'Biometric verification successful',
        verified: true,
        patientId: patient._id
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Biometric verification failed',
        verified: false
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Register biometric data
router.post('/register', protect, async (req, res) => {
  try {
    const { patientId, biometricTemplate } = req.body;
    
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      {
        biometricEnabled: true,
        biometricTemplate
      },
      { new: true }
    );
    
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
