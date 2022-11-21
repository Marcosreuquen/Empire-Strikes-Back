import './App.scss';
import Species from './Species';
import {useEffect, useState} from 'react';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
  notFound:
    'https://png.pngitem.com/pimgs/s/485-4859809_star-wars-famous-death-star-png-download-star.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

function App() {
  const [species, setSpecies] = useState([]);

  const fetchSpecies = async () => {
    const res = await (await fetch(API_URL)).json();
    const arrayOfSpecies = await Promise.all(
      res.species.map(url => {
        return fetch(url).then(res => res.json());
      })
    );
    return arrayOfSpecies;
  };

  useEffect(() => {
    fetchSpecies().then(arr => setSpecies(arr));
  }, []);

  const cmToInches = cmString => {
    const cm = parseInt(cmString);
    if (cm) return `${Math.ceil(cm / CM_TO_IN_CONVERSION_RATIO)}''`;
    return cmString;
  };
  const findImage = name => {
    if (SPECIES_IMAGES[name]) return SPECIES_IMAGES[name];

    const key = Object.keys(SPECIES_IMAGES).find(key => {
      if (name.toLowerCase().includes(key)) return key;
    });
    if (!!key) return SPECIES_IMAGES[key];
    return SPECIES_IMAGES.notFound;
  };

  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {species
          ? species.map((data, id) => {
              return (
                <Species
                  name={data.name}
                  classification={data.classification}
                  designation={data.designation}
                  height={cmToInches(data.average_height)}
                  image={findImage(data.name.toLowerCase())}
                  numFilms={data.films.length}
                  language={data.language}
                  key={id}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}

export default App;
