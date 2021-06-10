import mongoose, { Schema, model } from 'mongoose';

const CourseStudentSchema = new Schema({
    'course': { ref: 'Person', type: Schema.Types.ObjectId },
    'student': { ref: 'Person', type: Schema.Types.ObjectId },
    'grade': { type: Number, default: 0 }
}, { timestamps: true });

export default model('CourseStudent', CourseStudentSchema);