import React, { useEffect } from "react";
import { useState } from "react";
import Button from "./Button";
import styles from "./Form.module.css";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../src/Contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat,lng] = useUrlPosition();
  const {createCity} = useCities();
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji,setEmoji] = useState('')
  const [isLoadingGeoCoding,setIsLoadingGeoCoding] = useState(false);
  const [geoCodingError,setGeoCodingError] = useState('');


  useEffect(()=>{
    if(!lat && !lng ) return;
    const fetchCityData = async () => {
      
      try{
          setIsLoadingGeoCoding(true);
          setGeoCodingError('');
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`);
          const data = await res.json();
          if(!data.countryCode) throw new Error('That does not seem to be a country,click somewhere else');
          setCityName(data.city||data.locality||'');
          setCountry(data.countryName)
          setEmoji(convertToEmoji(data.countryCode))

      }
      catch(error){
        setGeoCodingError(error.message);
    }
      finally{
        setIsLoadingGeoCoding(false)

      }

    }
    fetchCityData();
  },
  [lat,lng]
);

  async function handleSubmit(e){
    e.preventDefault();
    console.log(e)

    if(!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position:{lat,lng},
      
    }
    await createCity(newCity);
    navigate('/app/cities');

  }
 if(isLoadingGeoCoding) return <Spinner />
 if(!lat && !lng) return <Message message='start by clicking somewhere on the map'/>
 if(geoCodingError) return <Message  message={geoCodingError}/>

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        { <span className={styles.flag}>{emoji}</span> }
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker id="date" onChange={selectedDate=>setDate(selectedDate)} selected={date} dateFormat={'dd/MM/yy'}/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
