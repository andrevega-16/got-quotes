const GOTQuotes = {
    api: 'https://api.gameofthronesquotes.xyz/v1/random',
    quoteContainer: document.querySelector('#quote'),

    async init() {
        this.showQuote(await this.getRandomQuote());
    },

    async getRandomQuote() {
        const response = await fetch(this.api);
        const quote = await response.json();
        return quote;
    },

    showQuote(quote) {
        this.quoteContainer.innerHTML = quote.sentence
    }
};

GOTQuotes.init();
