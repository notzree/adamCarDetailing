import prisma from '@/lib/prisma'

export default async function handler(req, res) {
    // Get data submitted in request's body.
    const body = JSON.parse(req.body)
    const alreadyBooked = await prisma.Booking.findUnique({
      where:{
        phonenumber: body.phonenumber
      }
    })
    const enoughTime = await prisma.Booking.count({
      where:{
        date: body.date
      }
    })
     if (enoughTime >=2){
      res.status(402).json({response : "alreadyBooked"});
      return;
     }
    if(alreadyBooked!=null){
      res.status(403).json({response : "alreadyBooked"});
      return;
    }
    const newBooking = await prisma.Booking.create({
        data:{
        name: body.name,
        phonenumber: body.phonenumber,
        email: body.email,
        date: body.date
        },
      })
      if(newBooking){
        res.status(200).json({response : "Success"});
      }
  }