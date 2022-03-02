// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get

const { google } = require('googleapis');
const sheets = google.sheets('v4');

async function main() {
  const authClient = await authorize();
  // console.log(`https://docs.google.com/spreadsheets/d/${process.env.spreadsheetId}/edit#gid=0\n`);

  const request = {
    spreadsheetId: process.env.spreadsheetId,
    range: `${process.env.sheetName}!A1:Z`,
    auth: authClient,
  };
  const data = await doGet(request);
  console.log(JSON.stringify(data));
  return JSON.stringify(data);
}

async function authorize() {
  const authClient = await google.auth.getClient({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  if (authClient == null) {
    throw Error('authentication failed');
  }
  return authClient;
}

async function doGet(request) {
  try {
    const response = (await sheets.spreadsheets.values.get(request)).data.values;
    const keys = response[0];
    const values = response.slice(1);
    if (values.length) {
      let array = [];
      values.map((value) => {
        let map = {};
        keys.forEach((key, index) => {
          map[key] = value[index];
        });
        array.push(map);
      });
      return array;
    } else {
      console.log('No data found.');
      return
    }
  } catch (err) {
    console.error(err);
    throw Error("response exception");
  }
}

main();
