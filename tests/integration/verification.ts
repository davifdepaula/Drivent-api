import supertest from 'supertest';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';
import { generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotelTicketTypeNotRemote,
  createTicketTypeRemote,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import app from '@/app';

const server = supertest(app);

export default function enrollmentAndTicketValidation(
  route: string,
  verb: 'post' | 'put' | 'delete',
  errorCode: number,
  body?: { roomId: number },
) {
  it('should respond with status 404 if user dosent have enrollment yet', async () => {
    const token = await generateValidToken();

    const response = await server[verb](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if user doesnt have ticket yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await server[verb](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it(`should respond with status ${errorCode} if user's ticket is not paid`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server[verb](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(errorCode);
  });

  it(`should respond with status ${errorCode} if user's ticket is remote`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeRemote();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server[verb](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(errorCode);
  });
  it(`should respond with status ${errorCode} if user's ticket doesnt't includes hotel`, async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createHotelTicketTypeNotRemote();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server[verb](`${route}`).send(body).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(errorCode);
  });
}
