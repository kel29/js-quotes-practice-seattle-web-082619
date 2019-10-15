document.addEventListener('DOMContentLoaded', () => {
  fetchQuotes();
  addNewQuote();
});

const QUOTE_URL = "http://localhost:3000/quotes";
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

  const p = document.createElement('p');
  p.classList.add("mb-0", 'mt-5');
  p.textContent = quote.quote;

  const footer = document.createElement('footer');
  footer.classList.add('blockquote-footer')
  footer.textContent = quote.author;

  const br = document.createElement('br');

  const successBtn = document.createElement("button");
  successBtn.classList.add('btn-success');
  successBtn.innerHTML = "Likes: <span>"+ likesCount(quote) + "</span>";

  const dangerBtn = document.createElement('button');
  dangerBtn.classList.add('btn-danger');
  dangerBtn.textContent = "Delete";
  dangerBtn.addEventListener('click', () =>{
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

function deleteQuote(quote) {
  fetch(QUOTE_URL + "/" + quote.id, {
    method: "DELETE",
    headers: {
      "Content-Type": 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      quote: quote.quote,
      author: quote.author
    })
  })
  .then(console.log(quote))
}