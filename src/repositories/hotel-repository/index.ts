import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

async function findRoomByBookingId(id: number): Promise<Room & { Booking: Booking[] }> {
  return prisma.room.findUnique({
    where: { id },
    include: { Booking: true },
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findRoomByBookingId,
};

export default hotelRepository;
