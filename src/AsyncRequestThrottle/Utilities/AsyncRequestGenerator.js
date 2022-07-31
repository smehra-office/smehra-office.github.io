export function AsyncRequestGenerator() {
    // PUBLIC
    this.mockAsyncRequest = (url) => {
        return new Promise((res) => {
            setTimeout(() => res(url), RandomNumberGenerator(10000));
        });
    }

    // PRIVATE
    const RandomNumberGenerator = (maxRange) => {
        return Math.ceil(Math.random() * maxRange);
    }
}
