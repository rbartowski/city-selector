# city-selector
City Selector implementation

# Build instructions

```sh
$ npm install && npm start
```

# UX Notes

The original UI has some UX issues regarding the current selected cities visibility. It's very easy to miss which ones are your currently selected cities as they clean up on every search/filtering. So, I've implemented a little box that will always show those selected items. Also, I've moved the checkbox to the right, usually the CTAs are placed on the right, because they have more weight over there. ('cause we usually read from left to right).

## side notes

A little side note for this implementation, it would be better to have the preferred API returning an array of cities. This would avoid chained calls to get the city details, in order to display more than the geonameid on the selected ones on the first load.

Unfortunately, I don't have too much time left to put on the project, but I'd include as a next step the implementation of preferred cities pagination in the CitySelected component, pretty similar to how the CityList is implemented. It sounds a good candidate for a HOC or a custom hook, extracting the scrolling functionality there. Also, I'd include some unit tests on the components.
