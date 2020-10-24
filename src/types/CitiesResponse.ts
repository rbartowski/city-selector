import City from './City';

type CitiesResponse = {
  data: City[];
  total: number;
  links: {
    first: string;
    next?: string;
    prev?: string;
    last: string;
  };
  filter?: string;
};

export default CitiesResponse;