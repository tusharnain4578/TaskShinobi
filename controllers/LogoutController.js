const express = require("express");
const router = express.Router();

//* Logout Controller

router.post("/", async (req, res) => {
  try {
    req.session.destroy();

    res.status(200).send({
      success: true,
      message: "Logout Successful!",
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Something went wrong!",
    });
  }
});

module.exports = router;
