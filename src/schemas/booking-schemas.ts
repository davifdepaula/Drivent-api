import Joi from 'joi';
import { BookingIdParam, RoomIdParam } from '@/services';

export const RoomIdSchema = Joi.object<RoomIdParam>({
  roomId: Joi.number().required(),
});

export const BookingIdSchema = Joi.object<BookingIdParam>({
  bookingId: Joi.number().required(),
});
