import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father's Name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile Number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email Address is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Method to remove sensitive password hash when returning JSON
StudentSchema.methods.toJSON = function () {
  const student = this.toObject();
  delete student.passwordHash;
  return student;
};

export const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
export default Student;
