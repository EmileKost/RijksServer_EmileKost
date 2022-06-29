
# Rijks Kunstwerken Bibliotheek

## Inleiding
Voor dit project heb ik mijn WAFS's project verder ontwikkelt en omgebouwd tot een server side gerenderde webapp. Hiervoor heb ik Node.js en EJS gebruikt gecombineerd met verschillende dependencies om zo tot dit werkende eindproduct te zijn gekomen. De Rijks Kunstwerken Bibliotheek laat de gebruiker browsen naar kunstwerken. Ook kan de gebruiker zoeken naar kunstwerken en kan hij de detailpagina van elk kunstwerk bezoeken. De kunstwerken komen uit de Rijksmuseum API.

## User Story
* As an art lover, I want to be able to search and view art from the Rijksmuseum at home, so that I can still enjoy art during a lockdown.

## Installeer dit project
````
git clone https://github.com/EmileKost/RijksServer_EmileKost
````
* Open het project
* Npm install om alle packages te kunnen gebruiken
* Npm start om de website te activeren
* Website te vinden op localhost:3000

## Features
* 10 Willekeurige kunstwerken
* 10 Kunstwerken offline beschikbaar
* Zoeken naar kunstwerken
* Detailpagina voor elk kunstwerk

## Server Side
Dit project heb ik voor het eerst een website server side ontwikkeld. De webapp wordt op de server gerenderd in plaats van op de browser. Dit zorgt voor een betere perfromance en zorgt ervoor dat de internet connectie van de gebruiker een stuk minder zal uitmaken en de app dus een stuk vaker te gebruiken zal zijn.
````
const http = require('http');
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
````
Om de server op te stellen heb ik aangegeven op welke poort de website moet draaien. Ook wordt er aangegeven dat de app op deze poort moet reageren en hierop moet worden gerenderd.

## Activity Diagram
![162421890-f41681b0-fae5-4bc7-bc7b-95c9c9b49b2b](https://user-images.githubusercontent.com/70690100/176430670-54544bf1-e612-425b-934b-9b076556f207.png)

## Uitleg code
Hieronder wordt per functionaliteit de code die daarvoor is gebruikt uitgelegd. Voor verschillende functionailiteiten zijn externe packages en libraries nodig. Deze zijn gemakkelijk terug te vinden in het package.json bestand. 

### Tien willekeurige kunstwerken op de home pagina
Op de home pagina moeten er tien verschillende kunstwerken voor de gebruiker zichtbaar zijn. Allereerst zal de API server side moeten worden opgehaald door middel van node-fetch. Na het ophalen van de data moet de home pagina worden gerenderd.

#### Ophalen van de API
````
app.get('/', (req, res) => {
  const rijksAPI = 'https://www.rijksmuseum.nl/api/nl/collection?&imgonly=true&key=xvdOJegg';
  fetch(rijksAPI)
    .then(async response => {
      const collection = await response.json();
      res.render('index', {
        pageTitle: 'Art Museum',
        data: collection.artObjects
      });
    })
    .catch(err => res.send(err))
})
````
In de app.get van de home pagina staat de rijksAPI variabele gelijk aan de url die nodig is om de data van het Rijksmuseum op te halen. Om fetch() server side met Node js te kunnen gebruiken is de package node-fetch nodig. Door middel van node-fetch kan nu de data uit de API worden opgehaald. Dit is een promise die asynchronous runt omdat het wat tijd kost om de data op te halen. Na het fetchen wordt de promise afgehandelt met een response Hierbij wordt het variabele collection aangemaakt en wordt de response is JSON formaat meegegeven. Nu kan de indexpagina worden gerenderd en wordt de data in een object meegegeven.

#### Renderen van de kunstwerken
Voor het renderen van de kunstwerken heb ik gebruik gemaakt van Express en EJS. Ejs maakt het mogelijk om client side Javascript in de HTML te schrijven wat het een stuk gemakkelijker maakt om de objecten uit Javascript te renderen.
````
   <ul>
     <% data.forEach((artObject) => { %>
    <li>
        <h2>
            <%=artObject.longTitle%>
           </h2>
           <div>
            <a href="<%=artObject.objectNumber%>">
                <img src=<%=artObject.webImage.url.slice(0, -3)+"=s500"%> alt=<%=artObject.title%>>
             </a>
           </div>
        <p>
            <%=artObject.title%>
        </p>
        </li>
    <% }) %>   
</ul>
````
Door middel van een forEach kan per kunstwerk het juiste formaat worden gerenderd. De layout is voor elk kunstwerk nu exact hetzelfde en elk kunstwerk zal een voor een worden gerenderd.

### Zoekfunctie
Naast het browsen van kunstwerken is het voor de gebruiker ook mogelijk om te zoeken naar kunstwerken in de API. Bij de zoekfunctie wordt bijna dezelfde functie uitgevoerd, alleen wordt door middel van een request de waarde vanuit de zoekbalk die is ingvuld opgehaald.
````
app.get('/search', (req, res) => {
  const rijksAPI = `https://www.rijksmuseum.nl/api/nl/collection?&imgonly=true&key=xvdOJegg&q=${req.query.q}`;
  fetch(rijksAPI)
    .then(async response => {
      const collection = await response.json();
      res.render('index', {
        pageTitle: 'Art Museum',
        data: collection.artObjects
      });
    })
    .catch(err => res.send(err))
})
````
Na het opahelen van het id van het kunstwerk wordt dezelfde fetch methode uitgevoerd om de data op te halen. Echter wordt er nu een specifiekere url gebruikt vanuit de API omdat we alleen de data willen van een specifieke zoekterm. Deze zoekterm wordt toegevoegd aan de url. Na het ophalen van de data kan opnieuw de indexpagina worden gerenderd. Dit maal alleen met de resultaten vanuit de zoekopdracht.

### Detailpagina
Als de gebruiker extra informatie nodig heeft kan die van elk kunstwerk de detailpagina bezoeken. Op de detailpagina is extra informatie te vinden over het kunstwerk.
````
  fetch(`https://www.rijksmuseum.nl/api/nl/collection/${req.params.id}?key=xvdOJegg&ps=25&imgonly=true`)
  .then(response => {
    return response.json();
  })
  .then(detailed => {
    res.render('detail', {
      data: detailed.artObject,
      pageTitle: 'Details Rijksmuseum',
    })
  })
})
````
Bij de detailpagina kan de juiste content worden ingeladen omdat het objectId van het kunstwerk vanuit de url wordt opgehaald. Dit id kan aan de url worden toegevoegd zodat alleen voor het desbetreffende kunstwerk de data wordt opgehaald. Als het id is toegevoegd wordt de data met dezelfde methode opgehaald en gerenderd. Dit maal wordt de detail pagina gerenderd met daarin de extra informatie voor het kunstwerk.

## Service worker
In de Rijks Kunstwerken Bibilotheek heb ik gebruik gemaakt van een service worker. Een service worker draait op de achtergrond en zorgt ervoor dat er data offline kan worden opgeslagen. Door de service worker is er er voor de gebruiker altijd een deel van de content zichtbaar, ook als deze geen of slecht internet heeft.
De service worker heeft drie verschillende events. 

### 1. Install event
````
self.addEventListener('install', (event) => {
    event.waitUntil( 
     caches.open(staticCacheName)
        .then(cache => {
        console.log('I am caching items!');
        cache.addAll(assets);
        })
    ); 
});
````
````
const staticCacheName = 'Static-Website-v1';
const assets = [
    '/',
    'CSS/style.css',
    'pleuris.js',
    'images/logoRijks.png',
    'error.html',
];
````
Het eerste event is het install event. Deze functie wordt één keer uitgevoerd. In het install event wordt de service worker geinstalleerd. Dit is de eerste stap voor het activeren van de serivce worker. Als de service worker is geinstalleerd kunnen alle aangegeven items in de cache worden geplaats voor offline gebruik. Door middel van .addAll worden alle aangegeven items in de cache geplaats voor offline gebruik. In de assets array is aangegeven welke elementen er aan de cache moeten worden toegevoegd.


### 2. Activate event
````
self.addEventListener('activate', (event) => {
  event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
                )
        })
    )
});
````
In het activate event wordt de huidige cache vergeleken met eventueel veranderde content. Het activate event zorgt ervoor dat de cache wordt geupdatet en de gebruiker de meest huidige versie van de webapp te zien krijgt. Alle eerder opgeslagen content dat is verandert wordt verwijdert en vervangen door de meest nieuwe versie.

### 3. Fetch event
````
self.addEventListener('fetch', (event)=> {
    // console.log('An fetch event has taken place', event);
    event.respondWith(
        caches.match(event.request).then(cacheResponse => {
            return cacheResponse || fetch(event.request)
        })
    );
})
````
Bij het fetch event gaat de request vanuit de client eerst naar de sevice worker. De service worker kan de al bestaande content in de cache terug leveren aan de gebruiker met de cacheResponse. 

## Optimilization

<img width="483" alt="Schermafbeelding 2022-06-29 om 15 42 41" src="https://user-images.githubusercontent.com/70690100/176451454-4593ee35-4351-438b-aaba-15c8d6d857d9.png">
Voordat ik ben begonnen met het optimaliseren van de webapp heb ik eerst op de browser Google Chrome een Lighthouse rapport kunnen doen. De uitslag van het rapport was niet verschrikkelijk met een score vaan 85 op performance. Het grootste probleem is het ophalen van de hoge resolutie foto's vanuit de Rijksmuseum API. Tevens werd aangegeven dat de fotos geen expliciete grootte hebben. Het is belangrijk dat de foto's een mindere resolutie krijgen en dat een deel van de content in de cache wordt gezet. 
Voor het optimaliseren heb ik drie verschillende dingen gedaan:

### 1. Compression
De eerste oplossing voor een betere performance is de middleware genaamd compression. Compression zorgt ervoor dat de grootte van de data dat naar de gebruiker moet worden gestuurd zo klein mogelijk is.
```
$ npm install compression
````
````
const compression = require('compression');

app.use(compression());
````
Eerst moet de middleware worden gedownload door middel van npm. Daarna moet er een variabele van compression worden gemaakt en kan er aangegeven worden dat de app compression moet gebruiken door middel van app.use .

### 2. Caching headers
Met hulp uit mensen van de klas heb ik caching headers kunnen gebruiken. Caching headers zorgt ervoor dat automatisch na een bepaalde tijd elementen uit de cache worden gehaald. 
````
let setCache = function (req, res, next) {
  const period = 60 * 60 * 24 * 365; 
    if (req.method == 'GET') {
      res.set('Cache-control', `public, max-age=${period}`)
  } else {
      res.set('Cache-control', `no-store`)
  }
  next()
}

app.use(setCache)
````

### 3. Verminder de resolutie en geef een vaste grootte
Om het grootste pijnpunt weg te halen moest de resolutie van de verkregen data worden vermindert. Dit kan door in de html .slice te gebruiken. Dit zorgt voor een kortere laad tijd en zal de performance verbeteren. Tevens hebben de foto's nu een vaste breedte zodat de structuur van de pagina minder vaak hoeft te veranderen wat ook weer zorgt voor een betere performance.
````




