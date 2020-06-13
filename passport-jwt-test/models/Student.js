import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
});

export default mongoose.model('student', StudentSchema);
