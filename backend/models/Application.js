const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationNo: {
    type: String,
    required: true,
    unique: true,
    match: [/^DESH\d{11}$/, 'Invalid application number format']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  applicationType: {
    type: String,
    enum: ['fresh', 'reissue', 'diplomatic', 'official'],
    required: [true, 'Application type is required']
  },
  
  // Personal Information
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    middleName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    placeOfBirth: {
      type: String,
      required: [true, 'Place of birth is required'],
      trim: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required']
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed'],
      required: [true, 'Marital status is required']
    },
    citizenship: {
      type: String,
      enum: ['indian', 'dual', 'other'],
      required: [true, 'Citizenship is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    aadharNumber: {
      type: String,
      required: [true, 'Aadhar number is required'],
      match: [/^\d{4}\s?\d{4}\s?\d{4}$/, 'Please enter a valid Aadhar number']
    },
    panNumber: {
      type: String,
      match: [/^[A-Z]{5}\d{4}[A-Z]$/, 'Please enter a valid PAN number']
    }
  },
  
  // Address Information
  presentAddress: {
    houseNo: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true },
    pincode: { 
      type: String, 
      required: true,
      match: [/^\d{6}$/, 'Please enter a valid PIN code']
    }
  },
  
  permanentAddress: {
    houseNo: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true },
    pincode: { 
      type: String, 
      required: true,
      match: [/^\d{6}$/, 'Please enter a valid PIN code']
    }
  },
  
  // Family Details
  familyDetails: {
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    spouseName: { type: String, trim: true },
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String },
      address: { type: String, trim: true }
    }
  },
  
  // Document Information
  documents: {
    photograph: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    signature: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    birthCertificate: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    addressProof: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    identityProof: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    }
  },
  
  // Application Status
  status: {
    type: String,
    enum: [
      'draft',
      'submitted',
      'under_review',
      'documents_verified',
      'police_verification',
      'approved',
      'rejected',
      'completed',
      'cancelled'
    ],
    default: 'draft'
  },
  
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    remarks: String
  }],
  
  // Processing Information
  processingOffice: {
    type: String,
    trim: true
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Appointment Information
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  
  // Payment Information
  payment: {
    amount: {
      type: Number,
      required: [true, 'Payment amount is required']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentMethod: String,
    paidAt: Date
  },
  
  // Service Type
  serviceType: {
    type: String,
    enum: ['normal', 'tatkal'],
    default: 'normal'
  },
  
  passportType: {
    type: String,
    enum: ['36-pages', '60-pages'],
    default: '36-pages'
  },
  
  // Tracking Information
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Delivery Information
  delivery: {
    method: {
      type: String,
      enum: ['speed_post', 'courier', 'self_collection'],
      default: 'speed_post'
    },
    address: {
      houseNo: String,
      street: String,
      area: String,
      city: String,
      state: String,
      pincode: String
    },
    trackingId: String,
    deliveredAt: Date
  },
  
  // Additional Information
  submittedAt: Date,
  reviewedAt: Date,
  approvedAt: Date,
  completedAt: Date,
  
  remarks: [{
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
applicationSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.middleName || ''} ${this.personalInfo.lastName}`.trim();
});

// Virtual for processing time
applicationSchema.virtual('processingDays').get(function() {
  if (!this.submittedAt) return 0;
  const endDate = this.completedAt || new Date();
  return Math.ceil((endDate - this.submittedAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate application number
applicationSchema.pre('save', function(next) {
  if (!this.applicationNo) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.applicationNo = `DESH${timestamp}${random}`;
  }
  next();
});

// Pre-save middleware to update status history
applicationSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Indexes
applicationSchema.index({ applicationNo: 1 });
applicationSchema.index({ user: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ 'personalInfo.email': 1 });
applicationSchema.index({ 'personalInfo.aadharNumber': 1 });

module.exports = mongoose.model('Application', applicationSchema);