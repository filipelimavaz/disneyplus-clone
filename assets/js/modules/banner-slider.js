const sliderItens = document.querySelectorAll('[data-banner="item"]')
const slider = document.querySelector('[data-banner="slider"]')
const btnNext = document.querySelector('[data-banner="btn-next"]')
const btnPrevious = document.querySelector('[data-banner="btn-previous"]')
const btnControls = document.querySelectorAll('[data-banner="btn-control"]')
const imgTitles = document.querySelectorAll('[data-banner="img-title"]')

const state = {
    mouseDownPosition: 0,
    movementPosition: 0,
    lastTranslatePosition: 0,
    currentSliderPosition: 0,
    currentSlideIndex: 0
}

function preventDefault(event) {
    event.preventDefault()
}

function translateSlide(position) {
    state.lastTranslatePosition = position
    slider.style.transform = `translateX(${position}px)`
}

function forwardSlide() {
    if(state.currentSlideIndex < sliderItens.length - 1) {
        setVisibleSlide(state.currentSlideIndex + 1)
    } else {
        setVisibleSlide(state.currentSlideIndex)
    }
}

function backwardSlide() {
    if(state.currentSlideIndex > 0) {
        setVisibleSlide(state.currentSlideIndex - 1)
    } else {
        setVisibleSlide(state.currentSlideIndex)
    }
}

function activeBtnControlButton(index) {
    btnControls.forEach(function(item) {
        item.classList.remove('active')
    })
    const btnControl = btnControls[index]
    btnControl.classList.add('active')
}

function activeImageTitle(index) {
    imgTitles.forEach(function(item) {
        item.classList.remove('active')
    })
    const imgTitle = imgTitles[index]
    imgTitle.classList.add('active')
}

function setVisibleSlide(index) {
    state.currentSlideIndex = index
    slider.style.transition = 'transform 0.25s'
    const position = getCenterPosition(index)
    translateSlide(position)
    activeBtnControlButton(index)
    activeImageTitle(index)
}

function getCenterPosition(index) {
    const slide = sliderItens[index]
    const margin = (window.innerWidth - slide.offsetWidth)/2
    const centerPosition = margin - (slide.offsetWidth * index)
    return centerPosition
}

function onMouseDown(event, index) {
    const slide = event.currentTarget
    state.currentSliderPosition = event.clientX - state.lastTranslatePosition
    state.mouseDownPosition = event.clientX
    state.currentSlideIndex = index
    slide.addEventListener('mousemove', onMouseMove)
}

function onMouseUp(event) {
    const slide = event.currentTarget
    if(state.movementPosition > 150){
        backwardSlide()
    } else if (state.movementPosition < -150) {
        forwardSlide()
    } else {
        setVisibleSlide(state.currentSlideIndex)
    }
    slide.removeEventListener('mousemove', onMouseMove)
}

function onMouseLeave(event) {
    const slide = event.currentTarget
    slide.removeEventListener('mousemove', onMouseMove)
}

function onMouseMove(event) {
    state.movementPosition = event.clientX - state.mouseDownPosition
    translateSlide(event.clientX - state.currentSliderPosition)
}

function onControlButtonClick(index) {
    activeBtnControlButton(index)
    setVisibleSlide(index)
}

function setListeners(){
    btnNext.addEventListener('click', forwardSlide)
    btnPrevious.addEventListener('click', backwardSlide)
    sliderItens.forEach(function(slide, index) {
        const bannerLink = slide.querySelector('.banner-slider_link')
        bannerLink.addEventListener('click', preventDefault)
        bannerLink.addEventListener('dragstart', preventDefault)

        slide.addEventListener('mousedown', function(event) {
            onMouseDown(event, index)
        })
        slide.addEventListener('mouseup', onMouseUp) 
        slide.addEventListener('mouseleave', onMouseLeave)
        btnControls[index].addEventListener('click', function() {
            onControlButtonClick(index)
        })
    })
}

function init() {
    setVisibleSlide(1)
    setListeners()    
}

export default {
    init
}