import { GoogleSpreadsheet } from 'google-spreadsheet'
export default function handler(req, res) {
    //put ur spreadsheet shit inside here
    const body = JSON.parse(req.body)
    const addToSpreadSheet = async (name, number, email, date) => {
        const doc = new GoogleSpreadsheet(
          process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID
        );
  
        await doc.useServiceAccountAuth({
          client_email: process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY.replace(
            /\\n/g,
            "\n"
          ),
        });
  
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle["Sheet 1"];
        await sheet.loadCells();
        await sheet.addRow({ Name: name, Number: number, Email: email, Date: date })
      }

      const response = await addToSpreadSheet(body.name, body.phonenumber, body.email, body.date);
      res.status(200).json({response : "Success"});
  }