import { Booking } from '@prisma/client';
import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function lookingVerifications(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }
  if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  return;
}

async function roomVerifications(roomId: number) {
  const room = await hotelRepository.findRoomByBookingId(roomId);
  if (!room) {
    throw notFoundError();
  }
  if (room.capacity <= room.Booking.length) {
    throw forbiddenError();
  }
  return;
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}

async function postBooking(userId: number, roomId: number) {
  await lookingVerifications(userId);
  await roomVerifications(roomId);
  const booking = await bookingRepository.includeBooking(userId, roomId);
  return booking;
}

async function putBooking(userId: number, roomId: number, bookingId: number) {
  await lookingVerifications(userId);
  const checkIfexistbooking = await bookingRepository.findBooking(userId);
  if (!checkIfexistbooking) {
    throw forbiddenError();
  }

  await roomVerifications(roomId);

  const booking = await bookingRepository.updateBooking(userId, roomId, bookingId);
  return booking;
}

export type RoomId = Pick<Booking, 'roomId'>;
export type BookingId = { bookingId: number };

const bookingService = {
  getBooking,
  postBooking,
  putBooking,
};

export default bookingService;
