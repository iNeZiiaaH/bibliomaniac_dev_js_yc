const API_KEY = 'AIzaSyBoK-BTaIZIRtzwIbFKmsCfK11_7LfURc0';
const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';

async function allBooks(query, maxResults = 30) {
    const url = `${API_URL}${query}&key=${API_KEY}&maxResults=${maxResults}`;

    showLoader();

    try {
        const response = await fetch(url);
        const { items = [] } = await response.json();
        await delay(2000);
        return items;
    } catch (error) {
        console.error('Erreur lors de la récupération des livres:', error);
        return [];
    } finally {
        hideLoader();
    }
}

function showLoader() {
    const loader = document.querySelector('.loader'); 
    loader.style.display = 'flex'; 
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'none'; 
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function resultsBooks(books) {
    const result = document.getElementById('results');
    result.innerHTML = '';

    if (!books.length) {
        result.innerHTML = '<p>Aucun livre trouvé.</p>';
        return;
    }

    books.forEach(book => {
        const { id: bookId, volumeInfo } = book;
        const title = volumeInfo.title || 'Titre non disponible';
        const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Auteur non disponible';
        const imgSrc = volumeInfo.imageLinks?.thumbnail || '';

        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        bookDiv.innerHTML = `
            <div class="book-content">
                ${imgSrc ? `<img src="${imgSrc}" alt="${title}" class="book-image">` : '<div class="no-image">Pas d\'image disponible</div>'}
                <h3 class="book-title">${title}</h3>
                <p class="book-authors">Auteur : ${authors}</p>
                <button class="details-button">Voir les détails</button>
            </div>
        `;

        bookDiv.querySelector('.details-button').addEventListener('click', (event) => {
            event.stopPropagation();
            const query = document.getElementById('searchInput').value;
            window.location.href = `one-book.html?bookId=${bookId}&query=${encodeURIComponent(query)}`;
        });

        bookDiv.addEventListener('click', () => {
            window.location.href = `one-book.html?bookId=${bookId}&query=${encodeURIComponent(query)}`;
        });

        result.appendChild(bookDiv);
    });
}

function getBookId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('bookId');
}

async function getDetails (bookId) {
    try {
        const API_URL_DETAIL = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`;
        const response = await fetch(API_URL_DETAIL);
        if(!response) {
            throw new Error('Error obtaining the book details')
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error connecting with the API')
    }
}

async function showDetails () {
    const BookId= getBookId();
    const bookDetails = await getDetails(BookId);
    const bookDetailDiv = document.getElementById('bookDetails')

    if(bookDetails) {
        const title = bookDetails.volumeInfo.title || 'Titre non disponible';
        const authors = bookDetails.volumeInfo.authors ? bookDetails.volumeInfo.authors.join(',') : 'autheur non disponible';
        const img = bookDetails.volumeInfo.imageLinks ? bookDetails.volumeInfo.imageLinks.extraLarge : '';
        const description = bookDetails.volumeInfo.description || 'Description non disponible';
        const publishedDate = bookDetails.volumeInfo.publishedDate || 'Date de publication non disponible';
           
        const textContainer = document.querySelector('.mybook__text');
        const imgContainer = document.querySelector('.mybook__img');
        const aboutContainer = document.querySelector('.mybook__about');
        
        if(img) {
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.alt = title;
            imgElement.classList.add('mybook__img--img');
            imgContainer.appendChild(imgElement);
        }
        
        const titleElement = document.createElement('h1');
        titleElement.classList.add('mybook__h1');
        titleElement.textContent = title;
        
        const authorsElement = document.createElement('h3');
        authorsElement.classList.add('mybook__about--h3');
        authorsElement.textContent = authors;

        const dateElement = document.createElement('p');
        dateElement.textContent = `Date de publication: ${publishedDate}`;

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('mybook__summary');
        descriptionElement.innerHTML = `Description : ${description}`;

        textContainer.appendChild(titleElement);
        textContainer.appendChild(dateElement);
        textContainer.appendChild(descriptionElement);
        aboutContainer.appendChild(authorsElement);

    } else {
        bookDetailDiv.innerHTML = '<p>Erreur lors de la récupération des détails du livre.</p>';
    }
}

function researchResults() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');

    if(query) {
        window.location.href = `allBooks.html?query=${encodeURIComponent(query)}`;
    } else {
        window.location.href = `allBooks.html`;
    }
}
document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const query = document.getElementById('searchInput').value;
    if (query) {
        const books = await allBooks(query);
        resultsBooks(books);
        console.log(books);
    } else {
        document.getElementById('results').innerHTML = '<p>Entrez une recherche.</p>';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');

    if(query) {
        document.getElementById('searchInput').value = query;
        const books = await allBooks(query);
        resultsBooks(books);
    }
});







