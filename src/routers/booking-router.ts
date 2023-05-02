import { Router } from 'express';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { getBooking, postBooking, putBooking } from '@/controllers/booking-controllers';
import { BookingIdSchema, RoomIdSchema } from '@/schemas/booking-schemas';

const bookingRoutes = Router();

bookingRoutes
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(RoomIdSchema), postBooking)
  .put('/:bookingId', validateParams(BookingIdSchema), validateBody(RoomIdSchema), putBooking);

export { bookingRoutes };
