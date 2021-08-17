
class PhotoGallery {
  constructor() {
    this.API_key = '563492ad6f9170000100000156dff257fac2427e9f5534e73e51b9e7';
    this.galleryDiv = document.querySelector('.gallery');
    this.searcchForm = document.querySelector('.header form');
    this.loadMore = document.querySelector('.load-more');
    this.logo = document.querySelector('.logo');
    this.pageIndex = 1;
    this.searchValueGlobal = '';
    this.eventHandle();
  }
  eventHandle() {
    document.addEventListener('DOMContentLoaded', () => {
      this.getImage(1);
    });
    this.searcchForm.addEventListener('submit', (e) => {
      this.pageIndex = 1;
      this.getSearchedImages(e);
    });
    this.logo.addEventListener('click', () => {
      this.pageIndex = 1;
      this.galleryDiv.innerHTML = '';
      this.getImage(this.pageIndex);
    });
    this.loadMore.addEventListener('click', (e) => {
      this.loadMoreImages(e);
    });
  }

  async getImage(index) {
    this.loadMore.setAttribute('data-img', 'curated');
    const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
    const data = await this.fetchImages(baseURL);
    this.genarateHtml(data.photos);
    console.log(data);
  }

  async fetchImages(baseURL) {
    const response = await fetch(baseURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: this.API_key
      }
    });
    const data = await response.json();
    return data;
  }

  genarateHtml(photos) {
    photos.forEach(photo => {
      const item = document.createElement('div');
      item.classList.add('item');
      item.innerHTML = `
        <a href="#">
          <img src="${photo.src.medium}">
          <h3>${photo.photographer}</h3>
        </a>
      `;
      this.galleryDiv.appendChild(item);
    });
  }

  async getSearchedImages(e) {
    this.loadMore.setAttribute('data-img', 'search');
    e.preventDefault();
    this.galleryDiv.innerHTML = '';
    const searchValue = e.target.querySelector('input').value;
    this.searchValueGlobal = searchValue;
    const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`;
    const data = await this.fetchImages(baseURL);
    this.genarateHtml(data.photos);
    e.target.reset();
  }

  async getMoreSearchedImages(index) {
    // const searchValue = this.searcchForm.querySelector('input').value;
    const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`;
    const data = await this.fetchImages(baseURL);
    this.genarateHtml(data.photos);
  }

  loadMoreImages(e) {
    let index = ++this.pageIndex;
    const loadMoreData = e.target.getAttribute('data-img');
    if (this.loadMoreData === 'curated') {
      // Load page 2 for curated 
      this.getImage(index);
    } else {
      // Load pagee 2 for search
      this.getMoreSearchedImages(index);
    }
  }
}

const gallery = new PhotoGallery;