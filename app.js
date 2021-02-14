const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const selected = document.getElementById('selected');
const duration = document.getElementById('duration').value || 500;
const totalDuration = document.getElementById('totalDuration');

const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// Enter key pressed
document.getElementById("search").addEventListener("keypress", 
  function(event) 
  {
    if (event.key === 'Enter') 
    {
      document.getElementById("search-btn").click();
    }
  }
);

document.getElementById("duration").addEventListener("keypress", 
  function(event) 
  {
    if (event.key === 'Enter') 
    {
      document.getElementById("create-slider").click();
    }
  }
);

searchBtn.addEventListener('click', 
  function () 
  {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
  }
);

// show images 
const showImages = (images) => 
  {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => 
      {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2 mt-5';
        div.innerHTML = 
        `
        <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
        <p class="text-info text-center fw-bolder">${image.tags}</p>
        `;
        gallery.appendChild(div)
      }
    );
    toggleSpinner();
    document.getElementById('errorMessage').style.display = "none";
  }

const getImages = (query) => 
  {
  // input field empty warning message
    if (document.getElementById('search').value === '') 
    {
      displayError();
    }
    else 
    {
      fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
      .then(response => response.json())
      .then(data => showImages(data.hits))
      .catch(err => console.log(err))
      document.getElementById('search').value = '';
      toggleSpinner();
    }
  }

// toggle spinner
const toggleSpinner = () => 
  {
    const spinner = document.getElementById('loading-spinner');
    const ImgContainer = document.getElementById('img-container');
    spinner.classList.toggle('d-none');
    ImgContainer.classList.toggle('d-none');
  }

// selected image 
let sliders = [];
let slideIndex = 0;
const selectItem = (event, img) => 
  {
    let element = event.target;
    const toggleCount = element.classList.toggle('added');
    let item = sliders.indexOf(img);
    if (item === -1) 
    {
      sliders.push(img);
    } 
    else 
    {
      sliders.splice(item,1);
    }
    slideCount(toggleCount);
}

// duration can not be negative
const positiveNumberOnly = input => 
  {
    let onlyPositive = /[^0-9]/gi;
    //counting total duration
    input.value = input.value.replace(onlyPositive, '');
    document.getElementById('duration').addEventListener("keyup", 
      function()
      {
        let newDuration = document.getElementById('duration').value;
        totalDuration.innerText = newDuration/1000;
      }
    );
  }


let timer = 0;
const createSlider = () => 
  {
    // check slider image length
    if (sliders.length < 2) 
    {
      alert('Select at least 2 image.')
      return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = 
    ` 
    <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
    <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
    `;
    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';

    // hide image area
    imagesArea.style.display = 'none';

    sliders.forEach(slide => 
    {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = 
      `
      <img class="w-100" src="${slide}" alt="">
      `;
      sliderContainer.appendChild(item)
    }
    );

    changeSlide(0)
    timer = setInterval(
      function () 
      {
        slideIndex++;
        changeSlide(slideIndex);
      }, duration);
}

// change slider index 
const changeItem = index => 
{
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => 
  {
    const items = document.querySelectorAll('.slider-item');
    if (index < 0) 
    {
      slideIndex = items.length - 1
      index = slideIndex;
    };

    if (index >= items.length) 
    {
      index = 0;
      slideIndex = 0;
    }

    items.forEach(item => 
      {
        item.style.display = "none"
      }
    )

    items[index].style.display = "block"
  }

sliderBtn.addEventListener('click', 
function () 
  {
    createSlider()
  }
)

// display error
const displayError = () => 
{
  document.getElementById('errorMessage').style.display = "block";
  imagesArea.style.display = 'none';
}

// for counting selected slider image
const slideCount = isTrue => {
  const count = document.getElementById('selected').innerText;
  let slideCount = parseInt(count);
  if (isTrue) 
  {
      document.getElementById('selected').innerText = slideCount + 1;
  } 
  
  else 
  {
      document.getElementById('selected').innerText = slideCount - 1;
  }
}