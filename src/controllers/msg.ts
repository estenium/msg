import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../helpers/error';
import { isReqValid } from '../helpers/http';
import logger from '../helpers/logger';

// export const getRooms = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = req.query.userId as string;
//   if (!userId) {
//     return next(new HttpError('Invalid user id', 409));
//   }

//   try {
//     // Get the user's rooms sorted by `updatedAt` in descending order (fresh first)
//     const userRooms = await RoomModel.find({ members: userId }, null, {
//       sort: { updatedAt: -1 },
//     });

//     if (!userRooms.length) {
//       res.status(200).json({
//         data: {
//           roomItems: [],
//           roomMembers: [],
//         },
//       });
//       return;
//     }

//     const roomItems = await configureRoomItems(userRooms, userId);

//     // Get room members
//     let roomMembers: RoomMember[] = [];
//     // Create room member id array
//     const roomMemberIdSet: Set<string> = new Set();
//     for (let r of roomItems) {
//       roomMemberIdSet.add(r.memberId);
//     }
//     const roomMemberIdArr: string[] = Array.from(roomMemberIdSet);
//     // Create room member array
//     const users = await UserModel.find({
//       _id: { $in: roomMemberIdArr },
//     }).select('account.name account.imageUrl publicKey');
//     if (!users.length) {
//       return next(new HttpError('Unable to get users.', 500));
//     }
//     roomMembers = users.map((user: any) => ({
//       id: user._id.toString(),
//       name: user.account.name,
//       imageUrl: user.account.imageUrl,
//       publicKey: user.publicKey,
//     }));

//     res.status(200).json({
//       data: {
//         roomItems,
//         roomMembers,
//       },
//     });
//   } catch (err: any) {
//     logger.error('getRooms', err);
//     return next(new HttpError('Unable to get rooms.', 500));
//   }
// };

export const postMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isReqValid(req, next)) return;

  const { phoneNumber, message } = req.body;
  const phoneNumWithCode = `+380${phoneNumber}`;

  try {
    res.status(201).json({
      data: {
        phoneNumber: phoneNumWithCode,
        message,
      },
    });
  } catch (err) {
    logger.error('postMessage', err);
    return next(new HttpError('Unable to send a message.', 500));
  }
};
