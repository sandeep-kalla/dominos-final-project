import userModel from '../../users/models/user.model.js';

export const getCart = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await userModel.findOne({ uid }, { cartItems: 1 });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ error: 'Failed to fetch cart data' });
  }
};

export const saveCart = async (req, res) => {
  try {
    const { uid } = req.params;
    const { cartItems } = req.body;

    const user = await userModel.findOneAndUpdate(
      { uid },
      { cartItems },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(user);
  } catch (error) {
    console.error('Error saving cart data:', error);
    res.status(500).json({ error: 'Failed to save cart data' });
  }
};