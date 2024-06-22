const app = require('express');
const userController = require('../Controllers/userController.js');
const User = require('../models/user.js')
const Organizer = require('../models/organizer.js')
const Attendee = require('../models/attendee.js')
const auth = require('../middelware/auth.js')
const session = require('express-session')

const router = app.Router();

///////////Register///////////////////
router.post('/users/register', userController.register)


//////////your role//////////////////

router.get('/select-role', function(req, res) {
    res.render('selectRole');
})


router.post('/role', async function(req, res) {
  try {
      const { userId, role } = req.body;
      const user = await User.findById(userId); // Fetch the user details
      console.log('Request Body:', req.body);

      if (!user) {
          return res.status(404).send({ message: 'User not found' });
      }

      await User.findByIdAndUpdate(userId, { type: role });

      if (role === 'Organizer') {
          const organizer = new Organizer({ user_id: userId ,
            fname: user.fname,
              lname: user.lname,
              email: user.email,
              phone: user.phone,
              birthDayDate: user.birthDayDate,
              bankAccount: user.bankAccount,
              profileImg: user.profileImg,
              address: user.address,
              city: user.city
          });
          await organizer.save();
          res.status(200).send('You are an Organizer');
      } else {
          const attendee = new Attendee({
              user_id: userId,
              fname: user.fname,
              lname: user.lname,
              email: user.email,
              phone: user.phone,
              birthDayDate: user.birthDayDate,
              bankAccount: user.bankAccount,
              profileImg: user.profileImg,
              address: user.address,
              city: user.city
          });
          await attendee.save();
          res.status(200).send('You are an Attendee');
      }
  } catch (error) {
      if (!res.headersSent) {
          res.status(400).send({ message: error.message });
      } else {
          console.error('Error processing request:', error);
      }
  }
});

/////////////login/////////////////
router.post('/users/login', userController.login);


//////////////////GET//////////////////////////

router.get('/users', async (req, res) => {
  try {
      const users = await User.find({});
      res.status(200).send(users);
  } catch (e) {
      res.status(500).send(e);
  }
});

//////////////////////GET BY Email////////////////

router.get('/users/email/:email', async (req, res) => {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email }); // Find by email address
  
      if (!user) {
        return res.status(404).send('Unable to find user');
      }
      res.status(200).send(user);
    } catch (e) {
      res.status(500).send(e);
    }
  });

  //////////////////////GET BY ID////////////////

router.get('/users/id/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).send('Unable to find user');
      }
      res.status(200).send(user);
    } catch (e) {
      res.status(500).send(e);
    }
  });

//////////////PATCH//////////////////////////

const bcrypt = require('bcrypt');

// Route for updating email
router.patch('/users/update-email/:email', async (req, res) => {
  try {
    const { email } = req.params; // Extract email from URL parameters
    const { password, newEmail } = req.body; // Extract password and newEmail from request body

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('No user found');
    }
    
    // Check if the new email is the same as the current one
    if (newEmail === user.email) {
      return res.status(400).send('Please enter a new email');
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json("Incorrect password");
    }

    // Update the email field directly
    user.email = newEmail;
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    console.error('Error updating email:', error); // Log the error for debugging
    res.status(400).send(error.message || 'An error occurred');
  }
});

// Route for updating password
router.patch('/users/update-password/:email', async (req, res) => {
  try {
    const { email: userEmail } = req.params; // Rename to userEmail to avoid conflict
    const { password, newPassword } = req.body;

    // Check if password and new password are provided
    if (!password || !newPassword) {
      return res.status(400).send('Both current and new passwords are required');
    }

    const user = await User.findOne({ email: userEmail }); // Compare with userEmail from params
    if (!user) {
      return res.status(404).send('No user found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send('Incorrect current password');
    }

    // Check if the new password is the same as the current one
    const isNewPasswordSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isNewPasswordSameAsCurrent) {
      return res.status(400).send('Please enter a new password');
    }

    // Update the password field if newPassword is provided
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).send(user);
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(400).send(error.message || 'An error occurred');
  }
});

// Route for updating all

router.patch('/users/:email', async (req, res) => {
  const updates = Object.keys(req.body);

  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();
    res.status(200).send(user); // Respond with updated user data
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error:', error.errors);
      return res.status(400).send({ message: 'Validation error', error: error.errors });
    }
    console.error('Error updating user:', error);
    res.status(500).send({ message: 'Failed to update information', error: error.message });
  }
});

////////////////////////////////DELETE///////////////////////

router.delete('/users/:email', async (req, res) => {
  const { email } = req.params;
  const { password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, send 404 status
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, send 401 status
    if (!isPasswordMatch) {
      return res.status(401).send('Incorrect password');
    }

    // If passwords match, delete the user
    const deletedUser = await User.findOneAndDelete({ email });

    // If user deleted successfully, send 200 status with deleted user data
    if (deletedUser) {
      return res.status(200).send(deletedUser);
    } else {
      return res.status(500).send('Error deleting user');
    }
  } catch (error) {
    // If any error occurs, send 500 status with error message
    console.error('Error deleting user:', error);
    res.status(500).send('Internal server error');
  }
});


////////////////////DELETE ALL/////////

// Delete all users
router.delete('/users', async (req, res) => {
  try {
      const result = await User.deleteMany({});
      if (result.deletedCount === 0) {
          return res.status(404).send('No users found to delete');
      }
      res.status(200).send({ message: `Deleted ${result.deletedCount} users` });
  } catch (e) {
      res.status(500).send(e);
  }
});

///////////////LOG OUTT//////////////////
router.get('/users/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).send("Error occurred during logout.")
        } else {
          return res.status(200).send("Logout successful.")
        }
      })
    } else {
      return res.status(400).send("No active session to log out from.")
    }
  })

router.post('/users/verify-password', async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Incorrect password');
    }

    res.status(200).send('Password verified');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
