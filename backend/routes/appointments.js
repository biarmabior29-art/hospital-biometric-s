import express from 'express';
import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


// ==============================
// GET ALL APPOINTMENTS
// ==============================
router.get('/', protect, async (req, res) => {
  try {
    // Make sure req.user exists
    if (!req.user || !req.user._id || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'User not authorized or missing role'
      });
    }

    let query = {};

    // If patient, filter by appointments where patientId = logged-in user _id
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    }

    // If doctor, filter by appointments where doctorId = logged-in user _id
    if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    }

    // Fetch appointments safely
    const appointments = await Appointment.find(query)
      .populate('doctorId', 'firstName lastName email department') // populate doctor only
      .sort({ appointmentDate: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    console.error('GET /appointments error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching appointments'
    });
  }
});

// ==============================
// CREATE APPOINTMENT
// ==============================
router.post('/', protect, async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      type,
      reason,
      symptoms
    } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patientId'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctorId'
      });
    }

    // 🔥 Check patient exists
    const patientExists = await Patient.findById(patientId);

    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      type,
      reason,
      symptoms
    });

    return res.status(201).json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error('Create appointment error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ==============================
// VERIFY BIOMETRIC
// ==============================
router.post('/:id/verify-biometric', protect, async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.verifiedByBiometric = true;
    appointment.biometricVerificationTime = new Date();
    appointment.status = 'checked-in';
    appointment.checkedInTime = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: 'Biometric verification successful',
      appointment
    });

  } catch (error) {
    console.error('Biometric error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ==============================
// UPDATE STATUS
// ==============================
router.put('/:id/status', protect, async (req, res) => {
  try {
    const id = req.params.id;

    // ✅ Make sure req.body exists
    if (!req.body || !req.body.status) {
      return res.status(400).json({
        success: false,
        message: 'Status field is required in request body'
      });
    }

    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    return res.status(200).json({
      success: true,
      appointment
    });

  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;