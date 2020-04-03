'use strict';

import allPosts from './posts';

const filters = {
  topSell: 'Топ Продажу',
  topRated: 'Кращі Товари по Рейтингу',
  newest: 'Новинки'
}

const ctaForm = document.getElementById('ctaForm');
const sliderControl = document.getElementById('sliderControl');

const postsSectionTopSell = document.getElementById('posts-top-sell');
const postsSectionTopRated = document.getElementById('posts-top-rated');
const postsSectionNewest = document.getElementById('posts-newest');



window.addEventListener('load', onWindowLoad)
ctaForm.addEventListener('submit', formSubmitHandler)
sliderControl.addEventListener('click', changeSliderSlides)

function formSubmitHandler(e) {
  e.preventDefault()
  console.log(e.target)
}

function changeSliderSlides(e) {
  let oldClass,
    newClass,
    controlsElement = e.target.parentElement,
    sliderElement = e.target.parentElement.parentElement;

  // console.log(controlsElement.getElementsByTagName('li'))

  collectionToArray(controlsElement.getElementsByTagName('li')).forEach((el, i) => {
    if (e.target === el) newClass = `slider--item-active-${i + 1}`;
  });
  sliderElement.classList.forEach(el => {
    if (/slider--item-active-\d/.test(el)) oldClass = el;
  });

  if (oldClass !== newClass) {
    collectionToArray(controlsElement.getElementsByTagName('li')).forEach(el => {
      el.classList.remove('active');
      if (e.target === el) el.classList.add('active');
    });
    sliderElement.classList.remove(oldClass);
    sliderElement.classList.add(newClass);
  }
}

function onWindowLoad() {
  fillSections()

  const postArrows = document.getElementsByClassName('posts__arrow');
  collectionToArray(postArrows).map(e => e.addEventListener('click', arrowsHandler))
}


function arrowsHandler(e) {
  let movedAlready, nextMove;

  let postsList = e.target.closest('.posts__wrapper')
  let postsItems = postsList.getElementsByClassName('posts__item')

  const moveLeft = e.target.classList.contains('posts__arrow--left')
  const moveRight = e.target.classList.contains('posts__arrow--right')
  const moveMax = postsItems.length - 4
  const moveMin = 0

  movedAlready = postsList.classList[postsList.classList.length - 1].split('---');
  movedAlready = +movedAlready[movedAlready.length - 1]

  if (!movedAlready) movedAlready = 0
  else postsList.classList.remove(postsList.classList[postsList.classList.length - 1])

  if (moveLeft) {
    nextMove = movedAlready - 1
    if (nextMove < moveMin) nextMove = moveMin
    if (nextMove === moveMin) hideArrow(e.target)
    if (nextMove < moveMax) showArrow(postsList.getElementsByClassName('posts__arrow--right')[0])

  }
  if (moveRight) {
    nextMove = movedAlready + 1
    if (nextMove > moveMax) nextMove = moveMax
    if (nextMove > moveMin) showArrow(postsList.getElementsByClassName('posts__arrow--left')[0])
    if (nextMove === moveMax) hideArrow(e.target)
  }

  collectionToArray(postsItems).map(e => e.style.marginRight = nextMove * 25 + "%")
  collectionToArray(postsItems).map(e => e.style.marginLeft = nextMove * -25 + "%")
  postsList.classList.add('move---' + nextMove)

  function showArrow(el) { el.style.opacity = 1 }
  function hideArrow(el) { el.style.opacity = 0 }
}

function fillSections() {
  postsSectionTopSell.innerHTML = generateSection([...allPosts.filter(post => post.additional.top)], filters.topSell)
  postsSectionNewest.innerHTML = generateSection([...allPosts.filter(post => post.additional.new)], filters.newest)
  postsSectionTopRated.innerHTML = generateSection([...allPosts.sort((b, a) => a.additional.rating - b.additional.rating)], filters.topRated)

  function generateSection(postsList, filter) {
    let postsControls = '';

    if (postsList.length > 4)
      postsControls = `
          <div class="posts__arrow posts__arrow--left" style="opacity: 0;">›</div>
          <div class="posts__arrow posts__arrow--right">›</div>
        `

    return `
      <div class="container">
        <h2 class="posts__header section-title">
          ${filter}
          <span class="section-title__expander">Дивитись Всі</span>
        </h2>
        <div class="posts__wrapper">
          ${postsList.map(post => generateItem(post, filter)).join('')}
          ${postsControls}
        </div>
      </div>
    `
  }

  function generateItem(post, filter) {
    let filterData, postOptions;

    switch (filter) {
      case filters.newest:
        filterData = `
          <span class="post-card__emphasis post-card__emphasis--newest">Новинка</span>
        `
        break;
      case filters.topSell:
        filterData = `
          <span class="post-card__emphasis post-card__emphasis--top-sell">Топ продажу</span> 
        `
        break;
      case filters.topRated:
        filterData = `
          <span class="post-card__emphasis post-card__emphasis--rating" >
            ${[...Array(Math.ceil(post.additional.rating) - Math.round(post.additional.rating))].map(() => `
              <svg
                width="21"
                height="19"
                viewBox="0 0 21 19"
                fill="none"
                stroke="#FFC700"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 1.61804L12.3819 7.40983L12.4941 7.75532H12.8574H18.9473L14.0205 11.3348L13.7266 11.5484L13.8388 11.8939L15.7207 17.6857L10.7939 14.1061L10.5 13.8926L10.2061 14.1061L5.27931 17.6857L7.16118 11.8939L7.27344 11.5484L6.97954 11.3348L2.05275 7.75532H8.1426H8.50587L8.61813 7.40983L10.5 1.61804Z"
                />
              </svg>
            `).join('')}

            ${[...Array(Math.round(post.additional.rating))].map(() => `
              <svg
                width="21"
                height="19"
                viewBox="0 0 21 19"
                fill="#FFC700"
                stroke="#FFC700"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 1.61804L12.3819 7.40983L12.4941 7.75532H12.8574H18.9473L14.0205 11.3348L13.7266 11.5484L13.8388 11.8939L15.7207 17.6857L10.7939 14.1061L10.5 13.8926L10.2061 14.1061L5.27931 17.6857L7.16118 11.8939L7.27344 11.5484L6.97954 11.3348L2.05275 7.75532H8.1426H8.50587L8.61813 7.40983L10.5 1.61804Z"
                />
              </svg>
            `).join('')}
          </span >
        `
        break;

      default:
        filterData = ''
        break;
    }

    if (post.options.length)
      postOptions = `
      <ul class="one-click-buy__list">
        ${post.options.map(e => `
          <li class="one-click-buy__item">
            <img
              class="one-click-buy__image"
              src="${e.img}"
              alt="bed set variant"
            />
          </li>
        `).join('')}
      </ul>
      `
    else
      postOptions = ''

    return `
      <div class="posts__item">
        <div class="post-card">
          ${filterData}
          <figure class="post-card__figure">
            <img
              class="post-card__image"
              src="${post.img}"
              alt="bed sheets image"
            />
          </figure>
          <div class="post-card__content">
            <p>Артикул <b>${post.artikul}</b></p>
            <h4 class="post-card__title">
              ${post.title}
            </h4>
            <p>${post.description}</p>
            <span class="post-card__price">${post.price.value} <small>${post.price.currency}</small></span>
          </div>
          <div class="one-click-buy">
            <button class="one-click-buy__button post-card__btn btn btn--black">
              Купити в один клік ›
            </button>
            ${postOptions}
          </div>
  
          <button class="btn post-card__btn btn--action-add-to-cart">
            Додати до кошика
          </button>
        </div>
      </div>
    `
  }
}

const collectionToArray = (collection) => {
  let arr = [];
  for (let i = 0; i < collection.length; i++) {
    arr[i] = collection[i];
  }
  return arr;
}