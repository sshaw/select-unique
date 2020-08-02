const KEY_SELECTED = 'selectUniqueSelected';

class SelectUnique {
    constructor(selector, config) {
        this.config = Object.assign({}, config);
        this.optionPosition = {};
        this.optionPool  = {};
        this.selectElements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
        this.selectChanged = this.selectChanged.bind(this);

        if(!this.selectElements.length)
            throw new Error('No HTMLSelectElements found');

        for(let e of this.selectElements) {
            if(!(e instanceof HTMLSelectElement))
                throw new Error(`Only HTMLSelectElement are accepted, found ${e}`);
        };

        const allOptions = Array.from(this.selectElements).flatMap(select => Array.from(select.options));
        this.uniqueOptions(allOptions).forEach((option, index) => {
            const id = this.optionId(option);

            this.optionPool[id] = option;
            this.optionPosition[id] = index;
        });

        for(let e of this.selectElements) {
            e.addEventListener('change', this.selectChanged, false);

            if(e.selectedIndex !== -1) this.optionSelected(e);
        };
    }

    ignoreOption(option) {
        return option.value.trim() === '' || typeof this.config.ignoreOption === 'function' && this.config.ignoreOption(option);
    }

    optionId(option) {
        return `${option.value}-${option.text}`;
    }

    sortOptions(select) {
        const selected = select.selectedOptions[0],
              options = Array.from(select.options).sort(
                  (a, b) => this.optionPosition[this.optionId(a)] - this.optionPosition[this.optionId(b)]
              );

        select.length = 0;

        options.forEach(option => {
            // on Chrome, detached options are always selected so explicitly set
            if(option.value === selected.value)
                option.selected = true;
            else
                option.selected = false;

            select.add(option);
        });
    }

    uniqueOptions(options) {
        const unique = [], seen = new Set();

        for(let option of options) {
            const key = this.optionId(option);

            if(!seen.has(key) && !this.ignoreOption(option)) {
                seen.add(key);
                unique.push(option);
            }
        };

        return unique;
    }

    selectChanged(event) {
        if(KEY_SELECTED in event.target.dataset) {
            const prevOption = this.optionPool[event.target.dataset[KEY_SELECTED]];

            if(!prevOption)
                throw new Error(`Cannot find previously selected option ${event.target.dataset[KEY_SELECTED]}`);

            for(let select of this.selectElements) {
                if(select === event.target) continue;

                select.options[select.options.length] = prevOption.cloneNode(true);
                this.sortOptions(select);
            };
        }

        this.optionSelected(event.target);
    }

    optionSelected(select) {
        for(let selectedOption of select.options) {
            if(!selectedOption.selected)
                continue;

            if(this.ignoreOption(selectedOption)) {
                delete select.dataset[KEY_SELECTED];
                break;
            }

            select.dataset[KEY_SELECTED] = this.optionId(selectedOption);

            // Remove selectedElement from the other selects in this set
            for(let e of this.selectElements) {
                if(e === select) continue;

                for(let i = 0; i < e.options.length; i++) {
                    // Ignore value, we only care about what the user sees. This allows for cases
                    // where the text is the same but the value is dependent on the select it's in.
                    // (What use case is that?!)
                    if(selectedOption.text === e.options[i].text) {
                        e.remove(i);
                        break;
                    }

                }
            }
        }
    }

    selected() {
        const selected = [];

        for(let select of this.selectElements) {
            // We don't support multi-selects so just use the element at 0
            if(select.selectedOptions.length && !this.ignoreOption(select.selectedOptions[0]))
                selected.push({text: select.selectedOptions[0].text, value: select.selectedOptions[0].value});
        }

        return selected;
    }

    remaining() {
        const remaining = [];

        for(let option of this.selectElements[0]) {
            if(!option.selected && !this.ignoreOption(option))
                remaining.push({text: option.text, value: option.value});
        }

        return remaining;
    }
}


export default SelectUnique;
