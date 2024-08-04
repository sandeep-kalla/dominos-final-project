import userModel from '../models/user.model.js';

// save user
export const saveUser = async (req, res) => {
  try {
    console.log('Incoming user data:', req.body);
    const { uid, displayName, photoURL } = req.body;

    if (!uid || !displayName || !photoURL) {
      return res.status(400).json({ error: 'Missing required user fields' });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ uid });
    console.log('Existing user found:', existingUser);

    if (existingUser) {
      // If the user exists, update their information
      existingUser.displayName = displayName;
      existingUser.photoURL = photoURL;
      await existingUser.save(); // Save the updated user
      return res.status(200).json(existingUser);
    } else {
      // If the user does not exist, create a new user
      const newUser = new userModel({ uid, displayName, photoURL });
      await newUser.save(); // Save the new user
      return res.status(201).json(newUser);
    }
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.username) {
      console.error('Duplicate key error:', error);
      res.status(400).json({ error: 'Duplicate key error: User already exists' });
    } else {
      console.error('Error saving user data:', error);
      res.status(500).json({ error: 'Failed to save user data' });
    }
  }
}

// get user
export const getUser = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ error: 'Missing uid parameter' });
    }

    const user = await userModel.findOne({ uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
}