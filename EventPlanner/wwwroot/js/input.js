class InputHandler {
    constructor(formName, groupName, complexInputs=[]) {
        this.formName = formName;
        this.groupName = groupName;
        this.complexInputs = complexInputs;
        this.isChanged = false;
        this.changesCount = 0;
        this.form = document.querySelector(`.${this.formName}`);
        this.bindInputs();
    }

    bindInputs() {
        const groups = document.querySelectorAll(`.${this.groupName}`);
        for (const group of groups)
        {
            if (group.classList.length > 1 && group.classList.contains(group.classList[1]))
            {
                this.bindComplexInputs(group);
                continue;
            }
            const value = group.querySelector(`.${this.groupName}-value`);
            const input = group.querySelector(`.${this.groupName}-input`);
            value.addEventListener('click', () => {
                setTimeout(() => input.focus(), 1);
                group.classList.add(`${this.groupName}--active`);
            });
            this.bind(group, input, value, value.textContent);
        }
    }

    bind(group, input, value, initialValue) {
        let canAdd = true;
        input.value = initialValue;
        input.addEventListener('focusout', () => {
            value.textContent = input.value;
            if (initialValue != input.value.trim())
            {
                if (canAdd)
                {
                    this.changesCount++;
                    canAdd = false;
                }
                this.form.classList.add(`${this.formName}--changed`);
            } else if (!canAdd) {
                this.changesCount--;
                canAdd = true;
            }
            console.log(this.changesCount);
            if (this.changesCount == 0)
                this.form.classList.remove(`${this.formName}--changed`);
            group.classList.remove(`${this.groupName}--active`);
        });
    }

    bindComplexInputs(group) {
        const value = group.querySelector(`.${this.groupName}-value`);
        const inputs = group.querySelector(`.${this.groupName}-inputs`).children;
        value.addEventListener('click', () => {
            setTimeout(() => inputs[0].focus(), 1);
            group.classList.add(`${this.groupName}--active`);
        });
        for (const input of inputs) {
            this.bindComplex(input);
        }
    }

    bindComplex(input) {
        let canAdd = true;
        input.addEventListener("input", () => {
            if (input.value.length >= input.minLength) {
                if (canAdd)
                {
                    this.changesCount++;
                    canAdd = false;
                }
                this.form.classList.add(`${this.formName}--changed`);
            } else if (!canAdd) {
                this.changesCount--;
                canAdd = true;
            }
            if (this.changesCount == 0)
                this.form.classList.remove(`${this.formName}--changed`);
        });
    }
}