const { S3Client } = require("@aws-sdk/client-s3");

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

console.log("ACCESS 👉", process.env.R2_ACCESS_KEY);
console.log("SECRET 👉", process.env.R2_SECRET_KEY)
console.log("ACCOUNT 👉", process.env.R2_ACCOUNT_ID);


module.exports = r2;
