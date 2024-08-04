import { OrderHistoryModel } from "../models/order-history-schema.js";

export const getOrderHistory = (req, res) => {
    const userId = req.params.uid; // Get UID from URL parameters
    OrderHistoryModel.find({ uid: userId }) // Filter orders by UID
        .then((orders) => {
            res.status(200).json(orders);
        })
        .catch((err) => {
            res.status(500).json({ message: err.message || "An error occurred while retrieving the order history." });
        });
};

    export const addOrderHistory = async (req, res) => {
        const { uid, email, paymentid, status, name, address, total } = req.body;
      
        try {
          const order = new OrderHistoryModel({
            uid,
            email,
            paymentid,
            status,
            name,
            address,
            total,
          });
      
          const savedOrder = await order.save();
      
          if (savedOrder) {
            res.status(200).json({ message: "New Order Created in DB" });
          } else {
            res.status(500).json({ message: "Unable to create new order in DB" });
          }
        } catch (err) {
          console.error("Error adding order:", err);
          res.status(500).json({ message: "Unable to create new order in DB" });
        }
      };