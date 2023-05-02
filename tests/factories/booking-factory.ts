import faker from '@faker-js/faker';
import { createHotel, createRoomWithHotelId } from './hotels-factory';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}
