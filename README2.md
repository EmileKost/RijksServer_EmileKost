
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


