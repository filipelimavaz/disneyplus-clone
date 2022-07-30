const carouselList = document.querySelector('[data-carousel="list"]')
const carouselItens = document.querySelectorAll('[data-carousel="item"]')
const btnPrevious = document.querySelector('[data-carousel="btn-previous"]')
const btnNext = document.querySelector('[data-carousel="btn-next"]')

const state = {
    mouseDownPosition: 0,
    movement: 0,
    lastTranslatePosition: 0,
    currentSlidePosition: 0,
    currentItemIndex: 0,
    currentSlideIndex: 0
}

function preventDefault(event) {
    event.preventDefault()
}

function translateSlide(position) {
    state.lastTranslatePosition = position
    carouselList.style.transform = `translateX(${position}px)`
}

function getCenterPosition(slideIndex) {
    const item = carouselItens[state.currentItemIndex]
    const itemWidth = item.offsetWidth
    const bodyWidth = document.body.clientWidth
    const slideWidth = itemWidth * 5
    const margin = (bodyWidth - slideWidth)/2
    return margin - (slideWidth * slideIndex)
}

function animateTransition(active) {
    if(active) {
        carouselList.style.transition = 'transform 0.3s'
    } else {
        carouselList.style.removeProperty('transition')
    }
}

function setVisibleSlide(slideIndex) {
    state.currentSlideIndex = slideIndex
    const centerPosition = getCenterPosition(slideIndex)
    animateTransition(true)
    translateSlide(centerPosition)
}

function backwardSlide() {
    if(state.currentSlideIndex > 0) {
        setVisibleSlide(state.currentSlideIndex - 1)
    } else {
        setVisibleSlide(state.currentSlideIndex)
    }
}

function forwardSlide() {
    const lastItemIndex = carouselItens.length - 1
    const lastSlideIndex = Math.floor(lastItemIndex / 5)
    if(state.currentSlideIndex < lastSlideIndex) {
        setVisibleSlide(state.currentSlideIndex + 1)
    } else {
        setVisibleSlide(state.currentSlideIndex)
    }
}

function onMouseDown(event, index) {
    const item = event.currentTarget
    state.currentItemIndex = index
    state.mouseDownPosition = event.clientX
    state.currentSlidePosition = event.clientX - state.lastTranslatePosition
    animateTransition(false)
    item.addEventListener('mousemove', onMouseMove)

}

function onMouseUp(event) {
    if(state.movement > 150){
        backwardSlide()
    } else if(state.movement < -150) {
        forwardSlide()
    } else {
        setVisibleSlide(state.currentSlideIndex)
    }
    const item = event.currentTarget
    item.removeEventListener('mousemove', onMouseMove)
}

function onMouseMove(event) {
    state.movement = event.clientX - state.mouseDownPosition
    const position = event.clientX - state.currentSlidePosition
    translateSlide(position)
}

function onMouseLeave(event) {
    const item = event.currentTarget
    item.removeEventListener('mousemove', onMouseMove)

}

function setListeners() {
    btnNext.addEventListener('click', forwardSlide)
    btnPrevious.addEventListener('click', backwardSlide)
    carouselItens.forEach(function(item, index) {
        const link = item.querySelector('.movie-carousel_link')
        link.addEventListener('click', preventDefault)
        item.addEventListener('dragstart', preventDefault)
        item.addEventListener('mousedown', function(event) {
            onMouseDown(event, index)
        })
        item.addEventListener('mouseup', onMouseUp)
        item.addEventListener('mouseleave', onMouseLeave)
    })
}

function init() {
    setListeners()
    setVisibleSlide(0)
}

export default {
    init
}