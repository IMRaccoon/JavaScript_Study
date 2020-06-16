import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

UserSchema.statics.craete = function create({ username, password }) {
  this.create({ username, password }).save();
};

UserSchema.statics.findOneByUsername = (username) =>
  this.findOne({ username }).exec();

UserSchema.methods.verify = (password) => this.password === password;

UserSchema.methods.assignAdmin = () => {
  this.admin = true;
  return this.save();
};

export default mongoose.model('User', UserSchema);
