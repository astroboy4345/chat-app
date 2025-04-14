const messageModel = require("../models/messageSchema");
module.exports.addMessage = async (req, res, next) => {
    try {
      const { from, to, message } = req.body;
  
      if (!from || !to || !message || message.trim() === "") {
        return res.status(400).json({ msg: "All fields are required." });
      }
  
      const data = await messageModel.create({
        message: { text: message }, 
        users: [from, to],
        sender: from,
      });
  
      if (data) {
        return res.json({ msg: "Message added successfully" });
      }
  
      return res.json({ msg: "Failed to send the message" });
  
    } catch (error) {
      next(error);
    }
  };
  

// Get all messages between two users
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await messageModel.find({
      users: { $all: [from, to] },
    }).sort({ updatedAt: 1 }); // sort by date/time ascending

    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    }));

    res.json(projectedMessages);
  } catch (error) {
    next(error);
  }
};
