
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function handler(req, res) {
  try{
    const body = JSON.parse(req.body)
    const alreadyBooked = await prisma.booking.findUnique({
      where:{
        phonenumber: body.phonenumber
      }
    })
    const enoughTime = await prisma.booking.count({
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
    const newBooking = await prisma.booking.create({
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
  } catch (e) {
    res.status(400).json({ message: "Something went wrong" });
  }
  
    
  }