const { urlRegex } = require("./constants");
const csvToString = require("csv-stringify");

const prepareXmlData = (data) => {
  if (!data || !data.urlset || !data.urlset.url) {
    throw new Error("Invalid xml object");
  }

  return data.urlset.url
    .filter((url) => url.loc.includes("/p/") || url.loc.includes("/c/"))
    .map((url) => decodeURI(url.loc).replace(" ", "-"));
};

const prepareCSVData = (urls) => {
  if (!urls || !urls.length) {
    throw new Error("Invalid data for csv generation");
  }

  const headers = ["Redirect from", "Redirect to"];
  const body = urls.map((url) => [
    url.replace(urlRegex, ""),
    url
      .replace(urlRegex, "")
      .replace("/c/", "/collections/")
      .replace("/p/", "/products/"),
  ]);

  return [headers, ...body];
};

// Promisified csv-stringify function
const csvStringify = (csvData) =>
  new Promise((resolve, reject) => {
    csvToString(csvData, (error, output) => {
      if (error) {
        return reject(error);
      }

      return resolve(output);
    });
  });

module.exports = { prepareXmlData, prepareCSVData, csvStringify };
