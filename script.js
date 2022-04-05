let automaticImageSwitcher = setInterval(() => displayNextImage(), 5000);

const resetImageSwitcherInterval = () => {
    clearInterval(automaticImageSwitcher);
    automaticImageSwitcher = setInterval(() => displayNextImage(), 5000);
};

const getTransformOfLastImage = () => {
    const sliderImages = document.querySelectorAll('.slider-image');
    /**
    * first image position in the X axis is 0
    * increasing or decreasing by 100 depending on the direction
    */
    return (sliderImages.length * (-100)) + 100;
}

// private counter variable
const initTransformCounter = () => {
    let count = 0;
    return {
        getCounter: () => count,
        setCounter: (value) => count = value,
        increment: () => count += 100,
        decrement: () => count -= 100,
    };
};

const transformCounter = initTransformCounter();

const setActiveNavigationDot = () => {
    // spread operator to convert nodelist to array
    const dots = [...document.querySelectorAll('.dot')];
    /**
    * get the index of dot by dividing the current counter by 100
    * Math.abs method to convert to an absolute number, so it converts negative to positive
    */
    const dotIndex = Math.abs((transformCounter.getCounter() / 100));

    dots.forEach(dot => dot.classList.remove('active'));
    dots[dotIndex].classList.add('active');
};

const setWrapperTransform = (value) => {
    const wrapper = document.querySelector('.wrapper');
    wrapper.style.transform = `translateX(${value}%)`;
    // update active dot when switching images
    setActiveNavigationDot();
};

const displayNextImage = () => {
    return (transformCounter.getCounter() === getTransformOfLastImage()) 
            ? setWrapperTransform(transformCounter.setCounter(0))
            : setWrapperTransform(transformCounter.decrement());
}

const displayPreviousImage = () => {
    return (transformCounter.getCounter() === 0) 
            ? setWrapperTransform(transformCounter.setCounter(getTransformOfLastImage()))
            : setWrapperTransform(transformCounter.increment());
}

// event delegation functions
const navigationArrowsEvent = (e) => {
    if (e.target.matches('.next-arrow')) {
        displayNextImage();
        resetImageSwitcherInterval();
    }

    if (e.target.matches('.prev-arrow')) {
        displayPreviousImage();
        resetImageSwitcherInterval();
    } 
};

const navigationDotsEvent = (e) => {
    if (e.target.matches('.dot')) {
        const targetDotTransform = -(parseInt(e.target.dataset.index) * 100);
        setWrapperTransform(transformCounter.setCounter(targetDotTransform));
        resetImageSwitcherInterval();
    }
};

// IIFE to create navigation dots on page load
const createNavigationDots = (() => {
    const sliderImages = document.querySelectorAll('.slider-image');
    const navigationDots = document.querySelector('.navigation-dots');

    for (let i = 0; i < sliderImages.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.dataset.index = i;
        navigationDots.appendChild(dot);
    }
})();

document.addEventListener('click', (e) => {
    navigationArrowsEvent(e);
    navigationDotsEvent(e);
});

setActiveNavigationDot();
