const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Dika Was Here",
      email: "dika@example.com",
      phoneNumber: "081234567890",
      password: "password123",
      isActive: true,
    },
  });
  console.log("User created:", user);

  const airline = await prisma.airlines.create({
    data: {
      name: "Garuda Indonesia",
    },
  });
  console.log("Airline created:", airline);

  const airport = await prisma.airports.create({
    data: {
      name: "Soekarno-Hatta International Airport",
      city: "Jakarta",
      terminal: "T3",
    },
  });
  console.log("Airport created:", airport);

  // data ke tabel flight
  const flight = await prisma.flight.create({
    data: {
      airlinesId: airline.id,
      airportId: airport.id,
      departure: new Date("2024-12-01T10:00:00Z"),
      return: new Date("2024-12-10T15:00:00Z"),
      price: 1500000.0,
      capacity: 200,
      class: "Economy",
      information: "Non-stop flight to Bali",
    },
  });
  console.log("Flight created:", flight);

  //data ke talble seat
  const seat = await prisma.seat.create({
    data: {
      flightId: flight.id,
      status: "available", // Sesuai enum SeatStatus
      seatNumber: "A1",
    },
  });
  console.log("Seat created:", seat);

  // masukan data ke tabel passanger
  const passenger = await prisma.passenger.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      birthDate: new Date("1990-01-01"),
      nationality: "Indonesian",
      passportNumber: "A1234567",
      passportExpiry: new Date("2030-01-01"),
    },
  });
  console.log("Passenger created:", passenger);

  // masukkan data ke tabel seat
  await prisma.seat.update({
    where: { id: seat.id },
    data: {
      passengerId: passenger.id,
      status: "booked",
    },
  });
  console.log("Seat updated with passenger ID.");

  // masukkan data ke tabel booking
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      flightId: flight.id,
      bookingDate: new Date(),
      totalPrice: 1500000.0,
      totalPassenger: 1,
    },
  });
  console.log("Booking created:", booking);

  // data ke tabel bookingpsngger
  const bookingPassenger = await prisma.bookingPassenger.create({
    data: {
      bookingId: booking.id,
      passengerId: passenger.id,
      seatId: seat.id,
    },
  });
  console.log("Booking Passenger created:", bookingPassenger);

  //deta ke tabel notification
  const notification = await prisma.notification.create({
    data: {
      userId: user.id,
      name: "Flight Reminder",
      detail: "Your flight is scheduled on 2024-12-01 at 10:00 AM.",
    },
  });
  console.log("Notification created:", notification);
}

// Jalankan fungsi utama
main()
  .catch((e) => {
    console.error("Error occurred:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
