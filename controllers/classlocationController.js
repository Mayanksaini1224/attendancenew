const ClassLocation = require('../models/ClassLocation');

exports.setClassLocation = async (req, res) => {
  const { className, latitude, longitude, Roomnum } = req.body;

  try {
    let location = await ClassLocation.findOne({ className });

    if (location) {
      location.latitude = latitude;
      location.longitude = longitude;
      location.Roomnum = Roomnum;
      await location.save();
    } else {
      location = new ClassLocation({ className, latitude, longitude, Roomnum });
      await location.save();
    }

    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get location for a specific class
exports.getClassLocation = async (req, res) => {
  const { className } = req.params;
  try {
    const location = await ClassLocation.findOne({ className });
    if (!location) {
      return res.status(404).json({ message: 'Class location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving location', error });
  }
};

// Get all class locations (optional)
exports.getAllClassLocations = async (req, res) => {
  try {
    const locations = await ClassLocation.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving all locations', error });
  }
};
