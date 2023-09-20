const GOTQuotes = {
    api: 'https://api.gameofthronesquotes.xyz/v1/random',
    quoteWrapper: document.querySelector('#quote-wrapper'),
    quoteContainer: document.querySelector('#quote'),

    async init() {
        setTimeout(async () => {
            this.showQuote(await this.getRandomQuote());
        }, 500);
    },

    async getRandomQuote() {
        const response = await fetch(this.api);
        const quote = await response.json();
        return quote;
    },

    showQuote(quote) {
        let index = 0;
        const { sentence } = quote;
        const len = sentence.length;
        const tm = 2000 / len * Math.sqrt(len) / 7;

        this.adjustContainer(sentence);

        const intervalId = setInterval(() => {
            const prev = sentence[index - 1];
            const char = sentence[index++];

            if (!char) {
                this.showAuthor(quote.character);
                return clearInterval(intervalId);
            }

            // Avoid breaking words while typing... work on this later
            if (prev === ' ') {
                const container = this.quoteContainer;
                const { height } = container.getBoundingClientRect();
                const span = document.createElement('span');
                let word = '';
                for (let char of sentence.slice(index - 1)) {
                    if (char === ' ') break;
                    word += char;
                }
                span.innerText = word;
                container.appendChild(span);
                const { height: newHeight } = container.getBoundingClientRect();

                if (height !== newHeight) {
                    console.log('br')
                    container.appendChild(document.createElement('br'));
                }

                span.remove();
            }

            // Add char
            this.addChar(char);
        }, tm);
    },

    addChar(char) {
        const span = document.createElement('span');
        span.innerHTML = char;
        this.quoteContainer.appendChild(span);
    },

    adjustContainer(quote) {
        // Get elems
        const container = this.quoteContainer;
        const wrapper = this.quoteWrapper;
        const { style } = wrapper;

        // Get quote size
        container.innerHTML = quote;
        const { height, width } = wrapper.getBoundingClientRect();

        // Foce size
        style.width = Math.ceil(width) + 'px';
        style.height = height + 'px';

        // Clean container
        container.innerHTML = '';
    },

    showAuthor(author) {
        const container = this.quoteWrapper;
        const authorDiv = document.createElement('div')
        authorDiv.innerText = '— ' + author.name;
        authorDiv.classList.add('author');
        container.appendChild(authorDiv);
    }
};

GOTQuotes.init();
