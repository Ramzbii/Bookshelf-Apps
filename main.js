document.addEventListener('DOMContentLoaded', function (){
  const books = [];
  const RENDER_EVENT = 'render-book';
  const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event){
      event.preventDefault();
      addBook();
    })
  function addBook(){
    const titlebook = document.getElementById('inputBookTitle').value;
    const authorbook = document.getElementById('inputBookAuthor').value;
    const yearbook = document.getElementById('inputBookYear').value;
    const readbook = document.getElementById('inputBookIsComplete').checked;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titlebook, authorbook, yearbook, readbook);
    books.push(bookObject);
    saveBooksToLocalStorage(); 
    document.dispatchEvent(new Event(RENDER_EVENT));
    
  }
  function generateId(){
    return +new Date();
  }
  function generateBookObject(id, title, author, year, isComplete){
    return {
      id,
      title,
      author,
      year,
      isComplete,
    }
  }

  document.addEventListener(RENDER_EVENT, function(){
    const uncompleteBooks = document.getElementById('incompleteBookshelfList');
    uncompleteBooks.innerHTML='';
    const completeBooks = document.getElementById('completeBookshelfList');
    completeBooks.innerHTML = '';
    for (const bookItem of books){
      const bookElement = makeBook(bookItem);
    if(!bookItem.isComplete){
      uncompleteBooks.append(bookElement)
    }
    else {
      completeBooks.append(bookElement)
    }
    }
  })

  function makeBook(bookObject){
    const makeTitle = document.createElement('h3');
    makeTitle.innerText = bookObject.title;
    const makeAuthor = document.createElement('p');
    makeAuthor.innerText = "Penulis : " + bookObject.author;
    const makeYear = document.createElement('p');
    makeYear.innerText = "Tahun :" + bookObject.year;
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    const buttonDone = document.createElement('button');
    buttonDone.classList.add('green')
    buttonDone.innerText = bookObject.isComplete ? "Belum dibaca" : "Selesai dibaca"
    buttonDone.addEventListener('click', function(){
      moveBook(bookObject.id);
    })  

    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('red')
    buttonDelete.innerText = "Hapus Buku"
    buttonDelete.addEventListener('click', function (){
      const ok = confirm("Apakah kamu yakin akan menghapus buku ini?")
      if(ok){

        deleteBook(bookObject.id);
      }
    })

    const buttonEdit = document.createElement('button');
    buttonEdit.classList.add('blue');
    buttonEdit.innerText = 'Edit';
    buttonEdit.addEventListener('click', function () {
      editBook(bookObject.id);
    });

    buttonContainer.append(buttonDone, buttonDelete, buttonEdit);
    const container = document.createElement('article')
    container.classList.add('book_item');
    container.append(makeTitle, makeAuthor , makeYear, buttonContainer);

    return container
  }

  function moveBook(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null ) return ;

    if (bookTarget.isComplete === false) {
      bookTarget.isComplete = true;
    } else {
      bookTarget.isComplete = false;
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBooksToLocalStorage(); 
  }

  function findBook(bookId){
    for (const bookItem of books ){
      if (bookItem.id === bookId){
        return bookItem
      }
    }
    return null;
  }

  function deleteBook(bookId){
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1 ) return ;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBooksToLocalStorage(); 
  }
  function findBookIndex(bookId){
    for (const index in books){
      if(books[index].id === bookId){
        return index;
      }
    }
    return -1
  }

  function saveBooksToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
  }

  function loadBooksFromLocalStorage() {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      books.push(...JSON.parse(storedBooks));
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  }

  loadBooksFromLocalStorage();
  function searchBook() {
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const allBooks = [...incompleteBookshelfList.children, ...completeBookshelfList.children];

    allBooks.forEach(function (book) {
      const title = book.querySelector('h3').innerText.toLowerCase();
      const isMatch = title.includes(searchTitle);

      if (isMatch) {
        book.style.display = '';
      } else {
        book.style.display = 'none';
      }
    });
  }

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });

  function editBook(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    const newTitle = prompt('Masukkan judul baru:', bookTarget.title);
    const newAuthor = prompt('Masukkan penulis baru:', bookTarget.author);
    const newYear = prompt('Masukkan tahun baru:', bookTarget.year);

    if (newTitle !== null && newAuthor !== null && newYear !== null &&
      newTitle.trim() !== '' && newAuthor.trim() !== '' && newYear.trim() !== '') {
      bookTarget.title = newTitle;
      bookTarget.author = newAuthor;
      bookTarget.year = newYear;
      alert ("Buku berhasil diubah")
      saveBooksToLocalStorage(); 

      document.dispatchEvent(new Event(RENDER_EVENT));
    }
    else{
      alert("Data tidak boleh kosong, Periksa kembali data yang anda masukkan!")
    }
    
  }
})
