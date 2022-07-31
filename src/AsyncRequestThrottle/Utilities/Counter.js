export function Counter(defaultValue) {
    let counter = defaultValue ?? 0;

    this.increment = () => counter++;
    this.decrement = () => counter--;
    this.getValue = () => counter;
}