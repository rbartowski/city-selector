type PreferredCities = {
  data: number[];
  total: number;
  links: {
    first: string;
    next?: string;
    prev?: string;
    last: string;
  };
};

export default PreferredCities;