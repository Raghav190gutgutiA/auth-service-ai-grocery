// const { subscribeToQueue } = require("./rabbit");
// const User = require("../models/User");
// require("dotenv").config();

// function startUserListener() {
//   subscribeToQueue("competition.won", async (msg) => {
//     const {
//       userId,
//       competitionId,
//       competitionName,
//       prizeAmount,
//       rank,
//     } = msg;

//     try {
//       await User.findByIdAndUpdate(
//         userId,
//         {
//           $push: {
//             competitionsWon: {
//               competitionId,
//               competitionName,
//               prizeAmount,
//               wonAt: new Date(),
//               rank,
//             },
//           },
//           $inc: {
//             totalEarnings: prizeAmount || 0,
//           },
//         },
//         { new: true }
//       );
//     } catch (error) {
//       console.error("User win update failed:", error.message);
//     }
//   });

//   subscribeToQueue("bid_accepted", async (msg) => {
//     const { freelancerId, amount } = msg;

//     try {
//       await User.findByIdAndUpdate(
//         freelancerId,
//         {
//           $inc: {
//             bidsAccepted: 1,
//             totalEarnings: amount || 0,
//           },
//         },
//         { new: true }
//       );
//     } catch (error) {
//       console.error("User bid update failed:", error.message);
//     }
//   });
// }

// module.exports = startUserListener;
