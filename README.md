# Rijksmuseum PWA Emile Kost

### Inleiding
Bij het vak Progressive Web App heb ik mijn eerder gemaakte website voor het Rijksmuseum omzetten naar een Progressive Web App door middel van server
side rendering door gebruik te maken van Node js en Express, en door service worker te installeren zodat de content ook offline beschikbaar is door 
middel van cache. Als laatste is de Rijksmuseum app geoptimaliseerd naar een betere performance.

### User Story
* As an art lover, I want to be able to search and view art from the Rijksmuseum at home, so that I can still enjoy art during a lockdown.

### Installeer dit project 
`git clone https://github.com/EmileKost/progressive-web-apps-2122`
* Ga door middel van `cd` naar de juiste folder
* Installeer Node.js
* Installeer Express
* Installeer Ejs
* Installeer Node-mon
* `npm start` om te beginnen

### Server
Om de app te kunnen runnen heb ik een server aangemaakt in het app.js bestand. 

<img width="323" alt="Schermafbeelding 2022-04-08 om 07 50 13" src="https://user-images.githubusercontent.com/70690100/162372898-80627742-7d83-44f1-8c78-98957eeaf7dd.png">

<img width="508" alt="Schermafbeelding 2022-04-08 om 07 50 59" src="https://user-images.githubusercontent.com/70690100/162372976-6d6d4f30-23d0-4135-8e12-bf0438588fc8.png">

De app luistert op localhost:3000.

Om verder gaan in het omzetten naar een server side app moesten er verschillende packages worden geinstalleerd. De app is voornamelijk met Node.js,
Express en EJS gebouwd.

<img width="340" alt="Schermafbeelding 2022-04-08 om 07 53 57" src="https://user-images.githubusercontent.com/70690100/162373275-6226bc76-29ca-41fc-b24a-fc683f12bc1e.png">

Als de packages eenmaal geinstalleerd zijn door middel van `npm install package` moeten deze nog geactiveerd worden in het app.js file. Ook moet
er nog een template engine worden gecreeerd, en moet er worden aangegeven waar de file's te vinden zijn.
<img width="355" alt="Schermafbeelding 2022-04-08 om 07 57 15" src="https://user-images.githubusercontent.com/70690100/162373634-7a1e9513-31bc-47b7-a5ad-4bdb0b264897.png">

### Fetch Ten Art Objects
Toen de server eenmaal was opgezet kon ik gaan beginnen met het fetchen van de data van de Rijksmuseum API. De API key had ik nog, en ik kon mijn code refactoren naar server side code. Dit is gedaan door middel van `app.get` met een request en een response. Hieronder de code van het ophalen van de kunstwerken.
<img width="850" alt="Schermafbeelding 2022-04-08 om 08 01 15" src="https://user-images.githubusercontent.com/70690100/162374101-057f3908-cd37-4f45-bf67-c77ca5f61e86.png">
`app.get` zorgt ervoor dat de '/' pagina een request en response heeft. In dit geval staat '/' voor de homepagina en '/search' voor de zoekpagina. 
 Op de index pagina wordt de API gefetched en kan de response deze data renderen. De response is `res.render` wat er voor zorgt dat de index.ejs pagina wordt ingeladen, met daarbij de gefetchde kunstwerken.

### Zoekfunctie
Naast het ophalen van willekeurige kunstwerken is er ook nog een zoekfunctie. De zoekfunctie heeft een request. Deze request is wilt weten wat de query in de url van de API is. Door deze query op te halen kunnen de juiste kunstwerken gerendert worden en kan de response de '/search' pagina renderen.
<img width="964" alt="Schermafbeelding 2022-04-08 om 08 09 30" src="https://user-images.githubusercontent.com/70690100/162375050-35d55cf0-2e34-4b78-ae64-106ff7b07bec.png">

### Details pagina
Als de gebruiker meer informatie wilt zien is er nog een detailspagina beschikbaar waar hij meer informatie over de kunstwerken kan weten. Dit is haalbaar geworden door de `${req.params.id}` daarna wordt in het detail.ejs bestand de detail informatie gerendert.
<img width="935" alt="Schermafbeelding 2022-04-08 om 12 55 22" src="https://user-images.githubusercontent.com/70690100/162422238-5b68b50e-27ca-4195-89b4-3cb9<img width="935" alt="Schermafbeelding 2022-04-08 om 12 55 22" src="https://user-images.githubusercontent.com/70690100/162422448-388a2cc8-ccd9-4d42-8424-b052c4ab76aa.png">
30f070c7.png">
![Uploading Schermafbeelding 2022-04-08 om 12.55.22.png…]()


### Server Worker
Om zometeen offline content te kunnen leveren aan de gebruiker heb ik gebruik gemaakt van een service worker. De service worker kan verschillende soorten content fetchen en in een cache zetten. Dit zorgt ervoor dat de gebruiker offline ook nog content beschikbaar heeft. De code van de service worker zit in een apart sw.js bestand. Mijn server worker zorgt voor:
* Offline kunnen zien van 10 verschillende kunstwerken
* Styling van CSS kan worden gebruikt
* Fonts kunnen worden ingeladen
* Index pagina kan worden gerendert

#### Install event Service Worker
<img width="472" alt="Schermafbeelding 2022-04-08 om 08 12 55" src="https://user-images.githubusercontent.com/70690100/162375551-85e27bb2-0ee9-4ad2-b4e2-f6ce3f850b54.png">
Hier wordt de service worker geinstalleerd.

#### Activate event Service Worker
<img width="585" alt="Schermafbeelding 2022-04-08 om 08 14 59" src="https://user-images.githubusercontent.com/70690100/162375655-d014134d-3e2a-48dc-892b-ec495b5e1751.png">
Hier wordt de service worker geactiveerd.

#### Fetch event Service Worker
<img width="570" alt="Schermafbeelding 2022-04-08 om 08 15 52" src="https://user-images.githubusercontent.com/70690100/162375766-4fde86b6-7277-44c5-a0f7-5c4f77f8cdbb.png">
Hier wordt het fetch event aangemaakt. Dit zorgt ervoor dat de service worker de asseets (cache items) kan fetchen zodat de gebruiker deze content offline beschikbaar zal hebben.

#### Cache van items
<img width="405" alt="Schermafbeelding 2022-04-08 om 08 17 05" src="https://user-images.githubusercontent.com/70690100/162375916-6d79654a-c652-4783-a279-33fa59b56315.png">
Om items te cachen moest ik eerst een cacheName aanmaken waar de content ik kan worden opgeslagen. Daarna heb ik een array gemaakt met assets met bestanden 
die ik in de cache wil zetten.

### Activity diagram!
![activityDiagram](https://user-images.githubusercontent.com/70690100/162421890-f41681b0-fae5-4bc7-bc7b-95c9c9b49b2b.png)

### Optimilization
#### Compress
<img width="435" alt="Schermafbeelding 2022-04-08 om 08 26 24" src="https://user-images.githubusercontent.com/70690100/162377123-3169563e-ddf2-46d6-a0ae-9b80998047f4.png">
Ik heb compress gebruikt voor een betere performance

#### Cache Headers
<img width="637" alt="Schermafbeelding 2022-04-08 om 12 57 41" src="https://user-images.githubusercontent.com/70690100/162422604-5b8192ea-33be-463e-b231-9b90e55f2c80.png">
Cache headers is gebruikt om te optimaliseren.

#### Image slice
<img width="733" alt="Schermafbeelding 2022-04-08 om 08 27 20" src="https://user-images.githubusercontent.com/70690100/162377247-19a7f3fd-7082-4ef6-9302-03b69e2611ec.png">
Ik heb .slice gebruikt zodat de images niet op hun optimale resolutie worden ingeladen omdat dit heel veel tijd en internet kost.

#### Inital Server Response Time
<img width="745" alt="Schermafbeelding 2022-04-08 om 08 29 06" src="https://user-images.githubusercontent.com/70690100/162377470-3d2e1cc9-6737-49f6-a702-6aace658e0b0.png">
Vanwege deze opportunity schommelt de performance tussen de 90 en 100. Het is ongeveer 60% van de tijd 100% en 40% van de tijd rond de 90%.
Ik ben er helaas niet uitgekomen hoe ik dit zou moeten oplossen, dit omdat mij uitgelegd is dat het probleem ook kan liggen bij de server van het Rijksmuseum zelf. 
<img width="700" alt="Schermafbeelding 2022-04-08 om 08 28 42" src="https://user-images.githubusercontent.com/70690100/162377681-34c769d1-9da2-4c62-b2df-77ec2a7f207a.png">

### Wishlist
- Ik had graag nog de Server Response Time willen verbeteren, maar met gebrek aan kennis en tijd is dit helaas nog niet gelukt.
- Ik had mij beter willen verdiepen in optimaliseren
- Ik had graag nog gewild dat de detailpagina offline had kunnen worden geladen door middel van de service worker



