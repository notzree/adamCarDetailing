import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import GoogleMapReact from "google-map-react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Prisma, PrismaClient } from "@prisma/client";
import { itemData } from "./itemData";
const prisma = new PrismaClient();
export async function getServerSideProps(context) {
  const dates = await prisma.booking.findMany({
    select: {
      date: true,
    },
  });
  const datesObject = JSON.stringify(Object.assign({}, dates));


  return {
    props: {
       datesObject 
    }, 
  }
}
export default function Home({datesObject}) {
  var bookedDates = Object.values(JSON.parse(datesObject)).map(item => item.date);
      bookedDates = bookedDates.map(i => dayjs(i))
  

  const theme = createTheme({
    palette: {
      primary: {
        main: "#F87272",
        light: "#F87272",
        dark: "#F87272",
      },
    },
    typography: {
      fontFamily: ["sans-serif"].join(","),
    },
  });

  const defaultProps = {
    center: {
      lat: 43.785935943655645,
      lng: -79.35213241898423,
    },
    zoom: 15,
  };

  const LocationPin = ({ text }) => (
    <div>
      <Icon icon="mdi:map-marker" className="pin-icon text-3xl text-error" />
    </div>
  );

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [date, setDate] = useState(dayjs().set('minute',0))
  const nineAM = dayjs().set('hour', 9)
  const eightPM = dayjs().set('hour', 20)
  const april10th = dayjs('2023-04-10');
  const april7th = dayjs('2023-04-7'); //starts 2pm
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
    if (!validatePhoneNumber(number)) {
      setPhoneNumberError("Please enter a valid phone number.");
    } else {
      setPhoneNumberError("");
    }
    if (!validateEmail(email) || !validatePhoneNumber(number)) {
      return;
    }
    const data = {
      name: name,
      phonenumber: number,
      email: email,
      date: date,
    };
    const response = await fetch("/api/handleSubmit", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => {
      if (!response.ok) {
        if (response.status == 403) {
          toast.error(
            "Sorry, we are currently only taking 1 booking per customer."
          );
        } else if (response.status ==402){
          toast.error(
            "Sorry, that timeslot is full."
          );
        }
        else {
          toast.error("Something went wrong.");
        }
      } else {
        toast.success("Thank you for booking!");
      }
    });
  };
  
  return (
    <>
      <Head>
        <title>A + Y</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-primary">
        <div className="p-10 flex flex-col md:flex-row md:gap-[28vw] gap-[5vw] justify-center items-center text-accent">
          <div className="flex flex-col text-center md:text-start">
            <h1 className="text-5xl my-2 font-bold">ADAM AND YOUSEF</h1>
            <h2 className="text-xl">Free Car Detailing</h2>
          </div>
          <a href="#booking"><button className="btn btn-error">BOOK NOW</button></a>
        </div>
        <div className="p-8 pb-20 text-primary flex flex-col justify-center items-center w-full h-full bg-accent">
          <h1 className="text-4xl pb-8">OUR WORK</h1>
          <div className="w-full h-full flex justify-center items-center">
            <Box sx={{ width: "80%", height: "100%" }}>
              <ImageList variant="masonry" cols={2} gap={8}>
                {itemData.map((item) => (
                  <ImageListItem key={item.img}>
                    <img
                      src={`${item.img}?w=248&fit=crop&auto=format`}
                      srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      alt={item.title}
                      
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </div>
        </div>
        <div  id="booking" className="p-10 w-full h-full bg-primary text-accent gap-6 flex flex-col justify-center items-center">
          <h1 className="text-4xl">BOOK NOW</h1>
          <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
            <div className="flex flex-col gap-2 w-[85%] md:w-2/5 h-full">
              <h3 className="text-xl">What happens next?</h3>
              <p>
                Once you fill out the form, we'll send you a booking
                confirmation. At the date and time of your booking, come to the
                location below with your vehicle. The detailing will take about an hour. You will be informed once your vehicle is ready for pickup.
              </p>
              <h3 className="text-xl pt-5">Business Information</h3>
              <p>
                <span>Address</span>: 3030 Don Mills Rd., North York, ON M2J 3B6
              </p>
              <p className="pb-3">
                <span>Note</span>: Located at the intersection of Van Horne and
                Don Mills, 6 minutes away from the Mosque.
              </p>
              <div className="h-[30vh] w-full bg-secondary overflow-hidden rounded-lg">
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
                  }}
                  defaultCenter={defaultProps.center}
                  defaultZoom={defaultProps.zoom}
                >
                  <LocationPin
                    lat={43.785935943655645}
                    lng={-79.35213241898423}
                  />
                </GoogleMapReact>
              </div>
            </div>
            <div className="w-[85%] md:w-fit">
              <h3 className="text-xl pb-4">Your contact details</h3>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 md:w-[35vw] "
              >
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First and last name"
                  className="placeholder-accent ph placeholder-opacity-50 bg-secondary input w-full"
                />
                {phoneNumberError && (
                  <span className="text-error">{phoneNumberError}</span>
                )}
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Phone number"
                  className="placeholder-accent ph placeholder-opacity-50 bg-secondary input w-full"
                />
                {emailError && (
                  <span className="text-error">{emailError}</span>
                )}
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="placeholder-accent ph placeholder-opacity-50 bg-secondary input w-full"
                />

                <h3 className="text-xl pt-2">Select a time</h3>
                <ThemeProvider theme={theme}>
                  <MobileDateTimePicker
                  onChange={(e) =>{
                    if(e!=null){
                      setDate(e.$d);
                    }
                  }}
                  minDate={april7th}
                  maxDate={april10th}
                  maxTime={eightPM}
                  minTime={nineAM}
                  shouldDisableTime={(value, view) => {
                    var bool = false
                    bookedDates.forEach(function(it, id){
                      if (value - it ==0){
                        bool = true
                      }
                    })
                    return view === 'minutes' && value.minute() >=0 || view === 'hours' && bool 
                  }
                  }
                    className="bg-secondary rounded-lg hover:ring-{2}"
                    sx={{
                      ".MuiInputBase-input": { color: "#c1c1c1" },
                      ".MuiOutlinedInput-notchedOutline": {
                        border: "None"
                      },
                    }}
                  />
                </ThemeProvider>
                <button
                  className="btn bg-accent border-none text-primary text-base "
                  type="submit"
                >
                  Submit Booking
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="w-full h-full bg-primary p-10">
          <div></div>
          <h1 className="md:px-5 text-xl text-center md:text-end text-accent">© <a className="text-error no-underline hover:underline" href='https://www.richard-zhang.ca/' target="_blank">RICHARD</a> & <a className="text-error no-underline hover:underline" href='https://www.anniecai.com/' target="_blank">ANNIE</a> 2023</h1>
        </div>
      </main>
    </>
  );
}
