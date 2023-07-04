import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './fetchImages';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
let query = '';
let page = 1;
const loadMore = document.querySelector('.load-more');

const simpleLightBox = new SimpleLightbox('.gallery a');
searchForm.addEventListener('submit', onSearchForm);
loadMore.addEventListener('click', onclick);

function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  fetchImages(query, page)
    .then(data => {
      renderGallery(data.hits);
      simpleLightBox.refresh();
      loadMore.style.display = 'block';
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    })
    .finally(() => {
      searchForm.reset();
    });
}
function onclick() {
  page += 1;

  fetchImages(query, page)
    .then(data => {
      renderGallery(data.hits);
      simpleLightBox.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(error => {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.style.display = 'none';
    });
}

function renderGallery(images) {
  const markup = images
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
         <a class="gallery__link" href="${largeImageURL}">
           <div class="gallery-item" id="${id}">
             <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
             <div class="info">
               <p class="info-item"><b>Likes</b>${likes}</p>
               <p class="info-item"><b>Views</b>${views}</p>
               <p class="info-item"><b>Comments</b>${comments}</p>
               <p class="info-item"><b>Downloads</b>${downloads}</p>
             </div>
           </div>
         </a>
       `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
