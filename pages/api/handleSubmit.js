import prisma from '@/lib/prisma'

export default async function handler(req, res) {
    // Get data submitted in request's body.
    const body = JSON.parse(req.body)
    
    const newBooking = await prisma.Booking.create({
        data:{
        name: body.name,
        phonenumber: body.phonenumber,
        email: body.email,
        date: body.date
        },
      })
      if(newBooking){
        res.status(200);
      }
  }