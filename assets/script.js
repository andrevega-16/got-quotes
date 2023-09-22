const GOTQuotes = {
    api: 'https://api.gameofthronesquotes.xyz/v1/random',
    quoteWrapper: document.querySelector('#quote-wrapper'),
    quoteContainer: document.querySelector('#quote'),
    modeContainer: document.querySelector('#mode'),
    mode: localStorage.getItem('mode'),
    loading: false,

    async getRandomQuote() {
        const response = await fetch(this.api);
        const quote = await response.json();
        return quote;
    },

    async init() {
        this.loading = true;
        setTimeout(async () => {
            await this.showQuote(await this.getRandomQuote());
            this.loading = false;
        }, 500);

        this.setMode();
        this.handleQuoteRefresh();
    },

    handleQuoteRefresh() {
        this.quoteContainer.addEventListener('click', async () => {
            // Do nothing if loading another quote
            if (this.loading) return;
            this.loading = true;
            await this.cleanUp();
            await this.showQuote(await this.getRandomQuote());

            this.loading = false;
        });
    },

    setMode() {
        const img = this.createImg();
        this.setModeIcon(img);
        this.setModeClass();

        this.modeContainer.addEventListener('click', () => {
            this.mode = this.mode === 'dark' ? 'light' : 'dark';
            this.setModeIcon(img);
            this.setModeClass();
            localStorage.setItem('mode', this.mode);

            this.animateIcon('rot', img);
        });
    },

    animateIcon(animation, icon, tm = 350) {
        icon.style.animation = `${animation} ${tm}ms`;
        const cleanStyle = () => icon.removeAttribute('style');
        setTimeout(cleanStyle, tm);
    },

    createImg() {
        const img = document.createElement('img');
        this.setModeIcon(img);
        this.modeContainer.appendChild(img);
        return img;
    },

    setModeIcon(img) {
        const icon = this.mode === 'dark' ? 'light' : 'dark'
        img.src = `./assets/img/moon-${icon}.png`;
    },

    setModeClass() {
        document.body.classList.toggle('dark', this.mode === 'dark');
    },

    cleanUp() {
        return new Promise(resolve => {
            const chars = this.quoteContainer.querySelectorAll('span');
            let index = 0;

            const intervalID = setInterval(() => {
                chars[index++].classList.add('fade-out');

                if (index === chars.length) {
                    clearInterval(intervalID);
                    this.quoteWrapper.querySelector('.author').classList.add('fade-out');

                    setTimeout(() => {
                        // ...
                        document.querySelector('.author')?.remove();
                        this.quoteWrapper.removeAttribute('style');
                        this.quoteContainer.innerHTML = '';

                        resolve();
                    }, 500);
                }
            }, 20);
        });
    },

    showQuote(quote, callback) {
        return new Promise(resolve => {
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
                    if (typeof callback === 'function') {
                        callback();
                    }
                    resolve();
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
                        container.appendChild(document.createElement('br'));
                    }

                    span.remove();
                }

                // Add char
                this.addChar(char);
            }, tm);
        })
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

/*
GOTQuotes.cleanUp()
GOTQuotes.showQuote({ sentence: 'Las funciones se llaman cómo? Con paréntesis', character: { name: 'Sabio anónimo' }}, () => {
    setTimeout(alert, 1000, 'Frase sabia mostrada.')
})
*/