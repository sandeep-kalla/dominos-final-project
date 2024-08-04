import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true},
  displayName: { type: String, required: true },
  photoURL: { type: String, required: true },
  cartItems: { type: Array, default: [] },
});

const userModel = mongoose.model('google-users', userSchema);

export default userModel;
