# Select Unique

[![Build Status](https://travis-ci.org/sshaw/select-unique.svg?branch=master)](https://travis-ci.org/sshaw/select-unique)

Given a group of HTML select elements with the same options, Select Unique will remove an option from the other select
elements when it's selected, and put it back when it's changed.

Checkout the demo [here](https://sshaw.github.io/select-unique#demo).

## Usage

* [Babel, webpack, etc...](#babel-webpack-etc)
* [Client-side](#client-side)

### Babel, webpack, etc...

```
npm install select-unique
```

Or:
```
yarn install select-unique
```

Then:
```js
import SelectUnique from 'select-unique';

const selects = new SelectUnique('.some-group select');
```

You can also give it some `HTMLSelectElement`s:
```js
const elements = [
    document.querySelector('select:nth-of-type(2)'),
    document.querySelector('select:nth-of-type(4)')
]

const selects = new SelectUnique(elements);
```

Or even a `NodeList`:
```js
const selects = new SelectUnique(document.querySelectorAll('select.question'));
```

If you want to ignore certain options:
```js
const selects new SelectUnique(selector, {
    ignoreOption: option => option.value === 'ignore_me_buddy'
});
```

You can also retrieve what's currently selected or remaining within the group:
```js
selects.remaining().forEach(option => {
    console.log(`text: ${option.text}  value: ${option.value}`);
});

selects.selected().forEach(option => {
    console.log(`text: ${option.text}  value: ${option.value}`);
});
```

### Client-side

Include it in your html page (from jsdelivr or cdnjs):
```html
<div id="my-select-group">
  <!-- A bunch of selects -->
</div>

<script src="https://cdn.jsdelivr.net/npm/select-unique@VERSION/dist/select-unique.min.js"></script>
<script>
  new SelectUnique('#my-select-group select');
</script>
```

Replace `VERSION` in the `src` URL with the desired version.

## See Also

* [jquery-selectunique](https://github.com/sshaw/jquery-selectunique) from which this is based

## Author

Skye Shaw (skye.shaw -AT- gmail)

## License

Released under the MIT License: http://www.opensource.org/licenses/MIT
