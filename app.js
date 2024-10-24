const API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';

async function allBooks (query) {
    try {
        const response = await fetch(`${API_URL}${query}`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
         console.error('erreur lors de la récuperation', error);
         return [];
    }
}

async function getDetails (bookId) {
    try {
        const API_URL_DETAIL = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
        const response = await fetch(API_URL_DETAIL);
        if(!response) {
            throw new Error('Error obtaining the book details')
        }
    } catch (error) {
        console.log('Error connecting with the API')
    }
}

function resultsBooks(books) {
    const result = document.getElementById('results');
    result.innerHTML = '';

    if (books.length ===0) {
        result.innerHTML = '<p> Aucun book trouvés </p>';
        return result;
    }

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const title = book.volumeInfo.title || 'Titre non disponible';
        const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(',') : 'autheur non disponible';
        const img = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';

        bookDiv.innerHTML = 
            `${img ? `<img src="${img}" alt="${title}">` : ''}
            <h3>${title}</h3>
            <p>Auteur : ${authors}</p>`;

        result.appendChild(bookDiv);

    })
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