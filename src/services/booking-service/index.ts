import { Booking } from '@prisma/client';
import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function lookingVerifications(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }
  if (ticket.status !== 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }
  console.log('pass');

  const room = await hotelRepository.findRoomByBookingId(roomId);
  if (!room) {
    throw notFoundError();
  }
  if (room.capacity <= room.Booking.length) {
    throw notFoundError();
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
  await lookingVerifications(userId, roomId);
  const booking = await bookingRepository.includeBooking(userId, roomId);
  return booking;
}

async function putBooking(userId: number, roomId: number, bookingId: number) {
  await lookingVerifications(userId, roomId);
  const checkIfexistbooking = await bookingRepository.getBookingByUserAndBooking(userId, bookingId);
  if (!checkIfexistbooking) {
    throw notFoundError();
  }

  const booking = await bookingRepository.updateBooking(userId, roomId, bookingId);
  return booking;
}

export type RoomIdParam = Pick<Booking, 'roomId'>;
export type BookingIdParam = { bookingId: number };

const bookingService = {
  getBooking,
  postBooking,
  putBooking,
};

export default bookingService;
