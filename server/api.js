const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);
const testSchema = new mongoose.Schema({
  time: {
    type: Date,
    default: Date.now,
  },
  speeds: {
    download: Number,
    upload: Number,
    originalDownload: Number,
    originalUpload: Number,
  },
  client: {
    ip: String,
    lat: Number,
    lon: Number,
    isp: String,
    isprating: Number,
    rating: Number,
    ispdlavg: Number,
    ispulavg: Number,
  },
  server: {
    host: String,
    lat: Number,
    lon: Number,
    location: String,
    country: String,
    cc: String,
    sponsor: String,
    distance: Number,
    distanceMi: Number,
    ping: Number,
    id: String,
  },
});

const SpeedTest = mongoose.model('SpeedTest', testSchema);

const connectionPromise = new Promise((resolve) => {
  mongoose.connection.on('open', () => {
    console.log('open');
    resolve();
  });
});

module.exports = (req, res) => {
  SpeedTest.find({}, (err, tests) => {
    console.log(tests);
    res.json({
      tests
    });
  });
};
