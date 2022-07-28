const fixDescription = (description, n = 500) => {
  if (typeof description === 'undefined') { return ('Sorry, this book description is not available') }
  else if (description.length > n) {
    // find gap after 50 then trim .indexOf(' ')
    const gapAt = description.slice(n).indexOf(' ');
    return (description.substring(n + gapAt, length) + '... ')
  }
  else { return description }
}

const manageCardsDIV = (msg = '') => {
  document.getElementById("cards").innerHTML = msg;
}

const createNewCard = (title, description, imgLink) => {
  const article = document.createElement("article");
  const header = document.createElement("header");
  const headLine = document.createElement("h2");
  const img = document.createElement("img");
  const content = document.createElement("div");
  const per = document.createElement("p");

  article.className = "card";
  content.className = "content";
  img.src = imgLink;
  img.alt = title

  const bookName = document.createTextNode(title);
  const bookDescription = document.createTextNode(fixDescription(description));

  headLine.appendChild(bookName);
  per.appendChild(bookDescription);

  header.appendChild(headLine)
  article.appendChild(header);

  article.appendChild(img);
  content.appendChild(per);
  article.appendChild(content);

  const cards = document.getElementById("cards")
  cards.appendChild(article);
}

const getBook = async () => {
  const sreachTerm = document.getElementById('searchBar')
  let query = sreachTerm.value
  manageCardsDIV('<h2 style="margin: 0 auto, padding: 1em;">Loading...</h2>')

  try {
    const res = await fetch('https://www.googleapis.com/books/v1/volumes?q=' + query.split(' ').join('+') + '&maxResults=15')
    const jsonRes = await res.json()
    manageCardsDIV('')
    var n = 0
    jsonRes.items.forEach((itm) => {
      try {
        if (n < 10) {
          const title = itm.volumeInfo.title
          const description = itm.volumeInfo.description // itm.searchInfo.textSnippet
          const img = itm.volumeInfo.imageLinks.thumbnail
          createNewCard(title, description, img)
          n += 1
        }
      } catch (error) {
        console.error(error)
      };
    })
  } catch {
    manageCardsDIV('<h2 style="margin: 0 auto, padding: 1em;">Could not find books for: ' + query + '</h2>')
  }
}

document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  if (keyName === 'Enter') {
    event.preventDefault();
    document.querySelector("button").click();
  }
})

const btn = document.querySelector('button');
btn.addEventListener('click', getBook);
