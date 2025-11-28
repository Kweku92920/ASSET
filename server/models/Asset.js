import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const DeviceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
    },
    deviceType: {
      type: String,
      required: true,
      trim: true,
    },
    customDeviceType: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const AssetSchema = new mongoose.Schema(
  {
    staffDetails: {
      fullName: { type: String, required: true, trim: true },
      staffId: { type: String, required: true, trim: true },
      position: { type: String, required: true, trim: true },
      department: { type: String, required: true, trim: true },
      dateTime: { type: String, required: true },
    },
    devices: {
      type: [DeviceSchema],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'At least one device is required.',
      },
    },
    termsAccepted: {
      type: Boolean,
      required: true,
    },
    signatures: {
      staffSignature: { type: String, required: true },
      adminSignature: { type: String, required: true },
    },
    submittedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  },
);

AssetSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

const Asset = mongoose.model('Asset', AssetSchema);

export default Asset;


