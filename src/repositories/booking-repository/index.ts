import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findBooking(userId: number): Promise<Booking & { Room: Room }> {
  return prisma.booking.findFirst({ where: { userId }, include: { Room: true } });
}

async function getBookingByUserAndBooking(userId: number, bookingId: number): Promise<Booking> {
  return prisma.booking.findFirst({ where: { userId, id: bookingId } });
}

async function includeBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({ data: { userId, roomId } });
}

async function updateBooking(userId: number, roomId: number, bookingId: number): Promise<Booking> {
  return prisma.booking.update({ where: { id: bookingId }, data: { userId, roomId } });
}

const bookingRepository = {
  findBooking,
  getBookingByUserAndBooking,
  includeBooking,
  updateBooking,
};

export default bookingRepository;
