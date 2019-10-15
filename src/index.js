document.addEventListener('DOMContentLoaded', () => {
  fetchQuotes();
  addSortButton();
  addNewQuote();
});

const QUOTE_URL = "http://localhost:3000/quotes";
const LIKE_URL = "http://localhost:3000/likes"
const quoteList = document.getElementById('quote-list');

function fetchQuotes() {
  fetch(QUOTE_URL + "?_embed=likes")
  .then(resp => resp.json())
  .then(json => iterateOverQuotes(json))
}

function iterateOverQuotes(quotes) {
  quotes.forEach( quote => displayQuote(quote));
}

function displayQuote(quote) {
  const li = document.createElement('li');
  li.classList.add('quote-card');

  const blockquote = document.createElement('blockquote');
  blockquote.classList.add("blockquote");
  blockquote.id = quote.id;

  const p = document.createElement('p');
  p.classList.add("mb-0", 'mt-3');
  p.textContent = quote.quote;

  const footer = document.createElement('footer');
  footer.classList.add('blockquote-footer')
  footer.textContent = quote.author;

  const br = document.createElement('br');

  const successBtn = document.createElement("button");
  successBtn.classList.add('btn-success');
  successBtn.innerHTML = "Likes: <span>" + likesCount(quote) + "</span>";
  successBtn.addEventListener('click', () => {
    likeQuote(quote);
  })

  const dangerBtn = document.createElement('button');
  dangerBtn.classList.add('btn-danger');
  dangerBtn.textContent = "Delete";
  dangerBtn.addEventListener('click', () => {
    deleteQuote(quote)
  })

  blockquote.appendChild(p);
  blockquote.appendChild(footer);
  blockquote.appendChild(br);
  blockquote.appendChild(successBtn);
  blockquote.appendChild(dangerBtn);

  quoteList.appendChild(blockquote);
}

function addNewQuote() {
  const form = document.getElementById('new-quote-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    author = form.author.value
    quote = form['new-quote'].value

    fetch(QUOTE_URL, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        quote: quote,
        author: author
      })
    })
    .then(resp => resp.json())
    .then(json => {
      displayQuote(json)
    })
  })
}

function likesCount(quote) {
  if (quote.likes) {
    return quote.likes.length
  } else {
    return 0
  }
}

function likeQuote(quote) {
  fetch(LIKE_URL, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      quoteId: quote.id,
      createdAt: new Date()
    })
  })
  .then(resp => resp.json())
  .then(() => {
    const currentQuote = document.getElementById(quote.id);
    const likesSpan = currentQuote.querySelector('span');
    let likes = parseInt(likesSpan.textContent, 10);
    likes += 1;
    likesSpan.textContent = likes;
  });
}

function deleteQuote(quote) {
  const currentQuote = document.getElementById(quote.id)
  fetch(QUOTE_URL + "/" + quote.id, {
    method: "DELETE",
    headers: {
      "Content-Type": 'application/json',
      Accept: 'application/json'
    }
  })
  .then(quoteList.removeChild(currentQuote));
}

function addSortButton() {
  const sortBtn = document.createElement('button');
  const sortDiv = document.getElementById('sort-button');
  sortBtn.classList.add('btn-primary', 'mt-3', 'ml-4');
  sortBtn.textContent = 'Sort by Author';
  sortBtn.addEventListener('click', () => {
    toggleSortButton(sortBtn);
  })
  sortDiv.appendChild(sortBtn);
}

function toggleSortButton(sortBtn) {
  if (sortBtn.textContent === 'Sort by Author') {
    sortBtn.classList.add('btn-secondary');
    sortBtn.classList.remove('btn-primary');
    sortBtn.textContent = 'Sort by Creation';
    clearCurrentQuotes();
    sortByAuthor();
  } else {
    sortBtn.classList.remove('btn-secondary');
    sortBtn.classList.add('btn-primary');
    sortBtn.textContent = 'Sort by Author';
    clearCurrentQuotes();
    sortByCreation();
  }
}

function clearCurrentQuotes() {
  while (quoteList.firstChild) {
    quoteList.removeChild(quoteList.firstChild)
  }
}

function sortByAuthor() {
  fetch(QUOTE_URL + "?_embed=likes")
  .then(resp => resp.json())
  .then(json => {
    const authorSort = json.sort((a, b) => (a.author > b.author) ? 1 : -1 );
    iterateOverQuotes(authorSort);
  })
}

function sortByCreation() {
  fetch(QUOTE_URL + "?_embed=likes")
  .then(resp => resp.json())
  .then(json => {
    const creationSort = json.sort((a, b) => (a.id > b.id) ? 1 : -1 );
    iterateOverQuotes(creationSort)
  })
}