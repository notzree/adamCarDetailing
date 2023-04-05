import { GoogleSpreadsheet } from 'google-spreadsheet'
export default async function handler(req, res) {
    //put ur spreadsheet shit inside here
    const body = JSON.parse(req.body)
    const addToSpreadSheet = async (name, number, email, date) => {
        const doc = new GoogleSpreadsheet(
          process.env.GOOGLE_SPREADSHEET_ID
        );
  
        await doc.useServiceAccountAuth({
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(
            /\\n/g,
            "\n"
          ),
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle["Sheet1"];
        await sheet.loadCells();
        await sheet.addRow({ Name: name, Number: number, Email: email, Date: date })
      }
      const formattedDate = new Date(body.date).toLocaleString()
      console.log(formattedDate);
      const response = await addToSpreadSheet(body.name, body.phonenumber, body.email, formattedDate)
      .then(()=>{
        res.status(200).json({response : "Success"});
      })
  }