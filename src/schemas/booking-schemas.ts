import Joi from 'joi';
import { BookingId, RoomId } from '@/services';

export const RoomIdSchema = Joi.object<RoomId>({
  roomId: Joi.number().required(),
});

export const BookingIdSchema = Joi.object<BookingId>({
  bookingId: Joi.number().required(),
});
