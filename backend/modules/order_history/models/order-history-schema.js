import mongoose, { SchemaTypes } from 'mongoose';
const OrderHistorySchema = mongoose.Schema({
    uid: { type: SchemaTypes.String, required: true },
    email:{type:SchemaTypes.String},
    paymentid:{type:SchemaTypes.String},
    status:{type:SchemaTypes.String},
    name:{type:SchemaTypes.String},
    address:{type:SchemaTypes.String},
    total:{type:SchemaTypes.Number},
  });
  export const OrderHistoryModel = mongoose.model('orders', OrderHistorySchema);