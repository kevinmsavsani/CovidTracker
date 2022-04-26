# CovidTracker

● Here content is scraped from https://www.mohfw.gov.in/  - Used puppeteer for dynamic scrapping. Can be checked at server.js.  <br />
● I have not scraped website for every client request, added cache in server so it provide data from cache and regularly update cache. - used memory-cache to store data. It refreshs data after every 60 sec on new request. Can be checked at server.js. <br />
● Visualised the data on the frontend in a presentable manner. Cases, deaths, recovered etc. for India and for each state. - used react table and tailwind to style the table. Can be checked at src/container/covid/Table.jsx.  <br />
● The application is responsive, i.e. should display properly on mobile , tablets and desktop - used tailwind to make pages responsive <br />
● Implemented service workers and cache results for 2 minutes on the client side using service workers. implemented service worker and caching on client side. can be checked at service-worker.js ans src/client.js. <br />
● deployed the project on https://www.heroku.com/ - https://pwa-covid-tracker.herokuapp.com/   <br />
● Made the data interactive [ sorting, filtering etc.] using react table <br />
● visualised the same data on an interactive map - used react-leaflet to make interactive map. can be checked at src/map/CovidMap.jsx  <br />


