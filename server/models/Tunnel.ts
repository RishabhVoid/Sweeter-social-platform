import mongoose from "mongoose";

const tunnelSchema = new mongoose.Schema({
  _id: String,
  buckets: {
    type: [
      {
        timePeriod: {
          type: {
            start: {
              type: String,
              required: true,
            },
            end: {
              type: String,
              required: true,
            },
          },
        },
        liquid: {
          type: [
            {
              timeStamp: String,
              textMessage: String,
              senderEmail: String,
            },
          ],
        },
      },
    ],
  },
});

const Tunnel = mongoose.model("Tunnel", tunnelSchema);

export default Tunnel;
