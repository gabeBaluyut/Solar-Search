const API_KEY = "EZoptKV6PYEMS96BDpgJH7QaTfMeRlvHD7Uf7RTq";
const URL = "https://developer.nrel.gov/api/solar/solar_resource/v1.json?";

async function fetchData(lat, lng) {
  let path = URL + "api_key=" + API_KEY + "&lat=" + lat + "&lon=" + lng;

  let data = await fetch(path).catch((err) => {
    console.log(
      "an error occurred while fetching the solar" + "radiation data." + err
    );
  });
  console.log(data);
}
