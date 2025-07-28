const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const admin = require("firebase-admin");

const app = express();
const PORT = 3001;

const serviceAccount = require("./survey-js-75a12-firebase-adminsdk-fbsvc-df87577998.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://survey-js-75a12-default-rtdb.firebaseio.com",
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

app.post("/api/send-push", async (req, res) => {
  const { token, title, body } = req.body;
  
  if (!token || !title || !body) {
    return res.status(400).json({ error: "Missing token, title, or body" });
  }

  try {
    const response = await admin.messaging().send({
      token: token,
      notification: {
        title: title,
        body: body,
      },
    });

    console.log("✅ Push sent:", response);
    res.status(200).json({ success: true, messageId: response });
  } catch (err) {
    console.error("❌ Push error:", err);
    res.status(500).json({ error: "Push failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Push server running at http://localhost:${PORT}`);
});
