import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePreferredCities } from '../../actions/cities';
import City from '../../types/City';
import './CityListItem.scss';

type CityProps = {
  city: City,
  isChecked: boolean,
  searchTerm: string | undefined
}

const CityListItem =  (props: CityProps) => {
  const { city, isChecked, searchTerm } = props;

  const [InputChecked, updateChecked] = useState<boolean>(isChecked);
  useEffect(() => {
    updateChecked(isChecked);
  }, [isChecked]);

  const dispatch = useDispatch();
  const handleInputChange = (e: SyntheticEvent<HTMLInputElement>, city: City) => {
    updateChecked(e.currentTarget.checked);
    const payload: City[] = [{
      ...city,
      selected: e.currentTarget.checked
    }];
    dispatch(updatePreferredCities(payload));
  }

  const getHighlightedText = (text: string | undefined, highlight: string | undefined) => {
    if (!text) {
      return '';
    }

    if (!highlight) {
      return <span>{text}</span>;
    }

    // split the text usign a regex to match the search term, case insensitive
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <span>
      {parts.map((part, index) => part.toLowerCase() === highlight.toLowerCase() ?
        <b key={`${part}_${index}`}>{part}</b> :
        part)
      }
    </span>;
  }

  return (
    <div key={city.geonameid} className="CityListItem">
      <div className="CityListItem__description">
        <p className="CityListItem__description-name">{getHighlightedText(city.name, searchTerm)}</p>
        <p className="CityListItem__description-country">
          {getHighlightedText(city.subcountry, searchTerm)} - {getHighlightedText(city.country, searchTerm)}
        </p>
      </div>
      <div className="CityListItem__actions">
        <input type="checkbox"
               onChange={(e: SyntheticEvent<HTMLInputElement>) => handleInputChange(e, city)}
               checked={InputChecked}/>
      </div>
    </div>
  );
};

export default CityListItem;