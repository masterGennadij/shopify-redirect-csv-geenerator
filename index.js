const express = require("express");
const fetch = require("node-fetch");
const parser = require("fast-xml-parser");

const { urlRegex } = require("./constants");

const { prepareCSVData, prepareXmlData, csvStringify } = require("./utils");

const port = process.env.PORT || 8000;

(async () => {
  const server = express();

  server.use(express.json());

  server.get("/", async (req, res) => {
    try {
      const { url } = req.query;

      if (!url || !urlRegex.test(url)) {
        return res.status(400).send("Invalid url in params");
      }

      const rawData = await fetch(url);
      const xmlString = await rawData.text();
      const xmlObject = await parser.parse(xmlString);
      const routesArray = prepareXmlData(xmlObject);
      const csvData = prepareCSVData(routesArray);
      const csvFile = await csvStringify(csvData);

      res.set("Content-Type", "application/octet-stream");
      res.attachment("routes.csv");
      return res.send(csvFile);
    } catch (error) {
      return res.status(500).send({ error: error.message || "Internal error" });
    }
  });

  await server.listen(port);
  console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line
})();
