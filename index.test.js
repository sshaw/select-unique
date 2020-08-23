import { fireEvent } from '@testing-library/dom';

import SelectUnique from './index.js';

function optionValues(options) {
    return Array.from(options).map(o => o.value);
}

beforeEach(() => {
    document.body.innerHTML = `
<select>
<option></option>
<option>A</option>
<option>B</option>
<option>C</option>
</select>
<select>
<option></option>
<option>A</option>
<option>B</option>
<option>C</option>
</select>
  `;
});

describe('when instantiated with no select elements', () => {
    test('an Error is thrown', () => {
        expect(() => new SelectUnique()).toThrow('No HTMLSelectElements found');
        expect(() => new SelectUnique([])).toThrow('No HTMLSelectElements found');

        const selects = document.getElementsByTagName('select');
        expect(() => new SelectUnique(selects[0].options)).toThrow('Only HTMLSelectElements are accepted: found OPTION');

        expect(() => new SelectUnique('option')).toThrow('Only HTMLSelectElements are accepted: found OPTION');
        expect(() => new SelectUnique('select')).not.toThrow();
    });
})

describe('when an option is selected', () => {
    test("the option with the same value is removed from the other selects' options", () => {
        const selects = document.getElementsByTagName('select');
        new SelectUnique(selects);

        fireEvent.change(selects[0], { target: { value: 'B' } });

        expect(optionValues(selects[0].selectedOptions)).toEqual(['B']);
        expect(optionValues(selects[0].options)).toEqual(['', 'A', 'B', 'C']);

        expect(optionValues(selects[1].selectedOptions)).toEqual(['']);
        expect(optionValues(selects[1].options)).toEqual(['', 'A', 'C']);

        fireEvent.change(selects[1], { target: { value: 'C' } });

        expect(optionValues(selects[1].selectedOptions)).toEqual(['C']);
        expect(optionValues(selects[1].options)).toEqual(['', 'A', 'C']);

        expect(optionValues(selects[0].selectedOptions)).toEqual(['B']);
        expect(optionValues(selects[0].options)).toEqual(['', 'A', 'B']);
    });
});

describe('when an option is deselected', () => {
    test("the option with the same value is added to the other selects' options", () => {
        const selects = document.getElementsByTagName('select');
        new SelectUnique(selects);

        fireEvent.change(selects[0], { target: { value: 'B' } });
        fireEvent.change(selects[1], { target: { value: 'A' } });

        expect(optionValues(selects[0].options)).toEqual(['', 'B', 'C']);
        expect(optionValues(selects[1].options)).toEqual(['', 'A', 'C']);

        fireEvent.change(selects[0], { target: { value: '' } });

        expect(optionValues(selects[0].options)).toEqual(['', 'B', 'C']);
        expect(optionValues(selects[1].selectedOptions)).toEqual(['A']);
        expect(optionValues(selects[1].options)).toEqual(['', 'A', 'B', 'C']);

        fireEvent.change(selects[1], { target: { value: 'C' } });

        expect(optionValues(selects[1].options)).toEqual(['', 'A', 'B', 'C']);
        expect(optionValues(selects[0].selectedOptions)).toEqual(['']);
        expect(optionValues(selects[0].options)).toEqual(['', 'A', 'B']);
    });
});

describe('a select with explicitly selected options', () => {
    test("options with the same value are removed from the other selects' options on construction", () => {
        const selects = document.getElementsByTagName('select');
        selects[0].selectedIndex = 2; // B
        selects[1].selectedIndex = 3; // C

        new SelectUnique(selects);

        expect(optionValues(selects[0].options)).toEqual(['', 'A', 'B']);
        expect(optionValues(selects[0].selectedOptions)).toEqual(['B']);
        expect(optionValues(selects[1].options)).toEqual(['', 'A', 'C']);
        expect(optionValues(selects[1].selectedOptions)).toEqual(['C']);
    });
});


describe('selected()', () => {
    test('returns an array of selected options', () => {
        const selects = document.getElementsByTagName('select'), su = new SelectUnique(selects);

        expect(su.remaining()).toMatchObject([
            { text: 'A', value: 'A' },
            { text: 'B', value: 'B' },
            { text: 'C', value: 'C' }
        ]);

        fireEvent.change(selects[0], { target: { value: 'B' } });

        expect(su.remaining()).toMatchObject([
            { text: 'A', value: 'A' },
            { text: 'C', value: 'C' }
        ]);

        fireEvent.change(selects[1], { target: { value: 'C' } });

        expect(su.remaining()).toMatchObject([
            { text: 'A', value: 'A' }
        ]);

        fireEvent.change(selects[1], { target: { value: '' } });

        expect(su.remaining()).toMatchObject([
            { text: 'A', value: 'A' },
            { text: 'C', value: 'C' }
        ]);
    });
});

describe('remaining()', () => {
    test('returns an array of options that have not been selected', () => {
        const selects = document.getElementsByTagName('select'), su = new SelectUnique(selects);

        expect(su.selected()).toEqual([]);

        fireEvent.change(selects[0], { target: { value: 'B' } });

        expect(su.selected()).toMatchObject([
            { text: 'B', value: 'B' }
        ]);

        fireEvent.change(selects[1], { target: { value: 'A' } });

        expect(su.selected()).toMatchObject([
            { text: 'B', value: 'B' },
            { text: 'A', value: 'A' }
        ]);

        fireEvent.change(selects[1], { target: { value: '' } });

        expect(su.selected()).toMatchObject([
            { text: 'B', value: 'B' }
        ]);
    });
});

describe('when an ignoreOption function is given', () => {
    test('the option is not added nor removed from other options when selected/deselected', () => {
        const selects = document.getElementsByTagName('select');
        new SelectUnique(selects, {ignoreOption: (option) => option.value === 'C'});

        fireEvent.change(selects[0], { target: { value: 'B' } });

        expect(optionValues(selects[0].options)).toEqual(['', 'A', 'B', 'C']);
        expect(optionValues(selects[1].options)).toEqual(['', 'A', 'C']);

        fireEvent.change(selects[1], { target: { value: 'C' } });

        expect(optionValues(selects[0].options)).toEqual(['', 'A', 'B', 'C']);
        expect(optionValues(selects[0].selectedOptions)).toEqual(['B']);
        expect(optionValues(selects[1].options)).toEqual(['', 'A', 'C']);
        expect(optionValues(selects[1].selectedOptions)).toEqual(['C']);

        fireEvent.change(selects[0], { target: { value: 'C' } });

        expect(optionValues(selects[0].options)).toEqual(['', 'A', 'B', 'C']);
        expect(optionValues(selects[0].selectedOptions)).toEqual(['C']);
        // FIXME: we should maintain original position here?!
        expect(optionValues(selects[1].options)).toEqual(['', 'A', 'C', 'B']);
        expect(optionValues(selects[1].selectedOptions)).toEqual(['C']);

        fireEvent.change(selects[1], { target: { value: '' } });

        expect(optionValues(selects[0].options)).toEqual(['', 'A', 'B', 'C']);
        expect(optionValues(selects[0].selectedOptions)).toEqual(['C']);
        // FIXME: we should maintain original position here too?!
        expect(optionValues(selects[1].options)).toEqual(['', 'A', 'C', 'B']);
        expect(optionValues(selects[1].selectedOptions)).toEqual(['']);
    });
});
