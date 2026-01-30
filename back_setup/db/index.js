const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.mongo_URL, 
    //     {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }
)
    .then((data) => {
      console.log(`mongoDB connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;