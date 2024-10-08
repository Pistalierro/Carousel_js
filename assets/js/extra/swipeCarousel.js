import Carousel from './carousel.js';

class SwipeCarousel extends Carousel {
	_initListeners() {
		super._initListeners();
		this.container.addEventListener('touchstart', this._swipeStart.bind(this));
		this.container.addEventListener('touchend', this._swipeEnd.bind(this));
	}

	_swipeStart(e) {
		this.swipeStartX = e.changedTouches[0].clientX
	}

	_swipeEnd(e) {
		this.swipeEndX = e.changedTouches[0].clientX
		this.swipeStartX - this.swipeEndX < 50 && this.prev()
		this.swipeStartX - this.swipeEndX > 50 && this.next()
	}
}

export default SwipeCarousel;