const booksApp = []
const RENDER_EVENT = 'render-bookApp'
const SAVED_EVENT = 'saved-bookApp';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
      id,
      title,
      author,
      year,
      isCompleted,
  }
}

function findBook(bookId) {
  for (const bookItem of booksApp) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in booksApp) {
    if (booksApp[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function search() {
  let value, book_item, bookTitle, i;
 
  value = document.getElementById('searchBookTitle').value.toLocaleLowerCase();
  book_item = document.getElementsByClassName('book_item');
 
  for (i =0; i < book_item.length; i++) {
    bookTitle = book_item[i].getElementsByTagName('h3');
    if(bookTitle[0].innerHTML.toLocaleLowerCase().indexOf(value) > -1){
      book_item[i].style.display = '';
    } else {
      book_item[i].style.display = 'none';
    }
  }
};

function checkButton() {
  const span = document.querySelector('span');
  if (inputBookIsComplete.checked) {
      span.innerText = 'Selesai dibaca';
  } else {
      span.innerText = 'Belum selesai dibaca';
  }
}

function isStorageExist()  {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(booksApp);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      booksApp.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const booktitle = document.createElement('h3');
  booktitle.innerText = 'Judul : '+ bookObject.title;

  const bookauthor = document.createElement('p');
  bookauthor.innerText = 'Penulis : '+ bookObject.author;

  const bookyear = document.createElement('p');
  bookyear.innerText = 'Tahun : '+ bookObject.year;

  const bookAction = document.createElement('div');
  bookAction.classList.add('action');

  const container = document.createElement('article');
  container.classList.add('book_item');
  

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');

  container.append(booktitle, bookauthor, bookyear, );
  container.append(buttonContainer);

  container.setAttribute('id', `book$-{bookObject.id}`);


  if (bookObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('green');
      undoButton.innerText = ('Belum selesai dibaca');
   
      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(bookObject.id);
      });
   
      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = ('Hapus buku');
   
      trashButton.addEventListener('click', function () {
        if (confirm('Yakin hapus data buku?')) {
        removeTaskFromCompleted(bookObject.id);
        alert('Data buku berhasil dihapus!')
      } else {
        return;
      }
      });
   
      buttonContainer.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('green');
      checkButton.innerText = ('Sudah dibaca');
      
      checkButton.addEventListener('click', function () {
        addTaskToCompleted(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = ('Hapus buku');
   
      trashButton.addEventListener('click', function () {

      if (confirm('Yakin hapus data buku?')) {
        removeTaskFromCompleted(bookObject.id);
        alert('Data buku berhasil dihapus!')
      } else {
        return;
      }
      })

      buttonContainer.append(checkButton, trashButton);
    }  
  return container;
}

function addBook () {
  const uncompleteBOOKList = document.getElementById('incompleteBookshelfList');
  const completeBOOKList = document.getElementById('completeBookshelfList');

  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete');


  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete.checked);
  booksApp.push(bookObject);

  if (isComplete.checked) {
    completeBOOKList.append(bookObject);
  }else {
    uncompleteBOOKList.append(bookObject);
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
  
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  booksApp.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");

  submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
  });

  inputBookIsComplete.addEventListener('input', function (event) {
    event.preventDefault();
    checkButton();
  });

  const searchBookTitle = document.getElementById('searchBook');
  searchBookTitle.addEventListener('submit',function(event){
    event.preventDefault();
    search();
  });


  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log();
});

document.addEventListener(RENDER_EVENT, function() {
 
    const incompletedBookList = document.getElementById('incompleteBookshelfList');
    incompletedBookList.innerHTML = '';
 
    const completeBookList = document.getElementById('completeBookshelfList');
    completeBookList.innerHTML = '';
 
 
    for (const bookItem of booksApp) {
        const bookElement = makeBook(bookItem);

    if (!bookItem.isCompleted) {
        incompletedBookList.append(bookElement);
    } else 
        completeBookList.append(bookElement);
    }
});


 







 

 


 




 



