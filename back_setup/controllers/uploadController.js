const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const r2 = require("../utilis/r2");

exports.getUploadUrl = async (req, res) => {
  try {
    const { quizId } = req.body;

    if (!quizId) {
      return res.status(400).json({ msg: "quizId is required" });
    }

    const fileName = `/recordings/${quizId}-${Date.now()}.webm`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      ContentType: "video/webm",
      // 🔥 THIS IS THE FIX
      ChecksumAlgorithm: undefined,
    });

    const uploadUrl = await getSignedUrl(r2, command, {
      expiresIn: 60 * 5, // 5 minutes
    });

    res.json({
      uploadUrl,
      fileUrl: `${process.env.R2_PUBLIC_URL}/${fileName}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to generate upload URL" });
  }
};
