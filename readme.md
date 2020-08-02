# Select Unique

Given a group of HTML select elements with the same options, Select Unique will remove an option from the other select
elements when it's selected, and put it back when it's changed.

Checkout the demo [here](https://sshaw.github.io/select-unique#demo).

## Usage

* [webpack, etc...](#webpack-etc)
* [Client-side](#client-side)

### webpack, etc...

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

You can also retrieve what's currently selected or remaining:
```js
selects.remaining().forEach(option => {
    console.log(`text: ${option.text}  value: ${option.value}`);
});

selects.selected().forEach(option => {
    console.log(`text: ${option.text}  value: ${option.value}`);
});
```

### Client-side

Download `select-unique.min.js` from [Latest Releases](https://github.com/sshaw/select-unique/releases/latest) or build it
yourself via `npm run build:web` and include it in your html page:
```html
<div id="my-select-group">
  <!-- A bunch of selects -->
</div>

<script src="select-unique.min.js"></script>
<script>
  new SelectUnique('#my-select-group select');
</script>
```

## See Also

* [jquery-selectunique](https://github.com/sshaw/jquery-selectunique) from which this is based

## Author

Skye Shaw (skye.shaw -AT- gmail)

## License

Released under the MIT License: http://www.opensource.org/licenses/MIT
