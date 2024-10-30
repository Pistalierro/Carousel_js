class Carousel {
	constructor(p) {
		const s = {...{containerID: '#carousel', slideID: '.slide', interval: 3000, isPlaying: true}, ...p}
		this.container = document.querySelector(s.containerID);
		if (!this.container) {
			throw new Error(`Container with ID ${s.containerID} not found.`);
		}

		this.slides = this.container.querySelectorAll(s.slideID);
		if (!this.slides.length) {
			throw new Error(`No slides found with ID ${s.slideID} in the container.`);
		}
		this.interval = s.interval;
		this.isPlaying = s.isPlaying;
	}

	_initProps() {
		this.currentSlide = 0;
		this.SLIDES_LENGTH = this.slides.length;
		this.FA_PAUSE = `<i class="fa-solid fa-pause"></i>`
		this.FA_PLAY = `<i class="fa-solid fa-play"></i>`
		this.FA_PREV = `<i class="fa-solid fa-arrow-left"></i>`
		this.FA_NEXT = `<i class="fa-solid fa-arrow-right"></i>`
		this.ARROW_LEFT = 'ArrowLeft'
		this.ARROW_RIGHT = 'ArrowRight'
		this.SPACE = 'Space'
	}

	_initControls() {
		const controls = document.createElement('div')
		controls.setAttribute('class', 'controls')

		const PAUSE_PLAY = `<span class="control control--pause">
																<span id="fa-pause-icon">${this.FA_PAUSE}</span>
																<span id="fa-play-icon">${this.FA_PLAY}</span>
															</span>`
		const PREV = `<span class="control control--prev">${this.FA_PREV}</span>`
		const NEXT = `<span class="control control--next">${this.FA_NEXT}</span>`

		controls.innerHTML = PAUSE_PLAY + PREV + NEXT

		this.pausePlayBtn = controls.querySelector('.control--pause')
		this.prevBtn = controls.querySelector('.control--prev')
		this.nextBtn = controls.querySelector('.control--next')

		this.pauseIcon = controls.querySelector('#fa-pause-icon')
		this.playIcon = controls.querySelector('#fa-play-icon')

		this.container.append(controls)

		this.isPlaying ? this._pauseVisible() : this._playVisible()
	}

	_initIndicators() {
		const indicators = document.createElement('ol')
		indicators.setAttribute('class', 'indicators')

		for (let i = 0; i < this.SLIDES_LENGTH; i++) {
			const indicator = document.createElement('li')
			indicator.setAttribute('class', i !== 0 ? 'indicator' : 'indicator active')
			indicator.dataset.slideTo = `${i}`
			indicators.append(indicator)
		}
		this.container.append(indicators)

		this.indicatorsContainer = document.querySelector('.indicators')
		this.indicators = document.querySelectorAll('.indicator')
	}

	_goToNth(n) {
		this.slides[this.currentSlide].classList.toggle('active');
		this.indicators[this.currentSlide].classList.toggle('active');
		this.currentSlide = (n + this.SLIDES_LENGTH) % this.SLIDES_LENGTH;
		this.slides[this.currentSlide].classList.toggle('active');
		this.indicators[this.currentSlide].classList.toggle('active');
	}

	_goToPrev() {
		this._goToNth(this.currentSlide - 1)
	}

	_goToNext() {
		this._goToNth(this.currentSlide + 1)
	}

	_pause() {
		clearInterval(this.timerID)
		this.isPlaying = false
		this._playVisible()
	}

	_play() {
		clearInterval(this.timerID)
		this._tick()
		this.isPlaying = true
		this._pauseVisible()
	}

	_pauseVisible(isVisible = true) {
		this.pauseIcon.style.opacity = isVisible ? 1 : 0
		this.playIcon.style.opacity = !isVisible ? 1 : 0
	}

	_playVisible() {
		this._pauseVisible(false)
	}

	_pressKey(e) {
		if (e.code === this.ARROW_LEFT) this.prev()
		if (e.code === this.ARROW_RIGHT) this.next()
		if (e.code === this.SPACE) this.pausePlay()
	}

	_indicate(e) {
		const target = e.target
		this._goToNth(+target.dataset.slideTo);
		this._pause()
	}

	_tick(flag = true) {
		if (!flag) return;
		this.timerID = setInterval(() => this._goToNext(), this.interval);
	}

	_initListeners() {
		this.pausePlayBtn.addEventListener('click', this.pausePlay.bind(this))
		this.prevBtn.addEventListener('click', this.prev.bind(this))
		this.nextBtn.addEventListener('click', this.next.bind(this))
		this.indicatorsContainer.addEventListener('click', this._indicate.bind(this))
		this.pausePlayBtn.addEventListener('mouseenter', this._pause.bind(this))
		this.pausePlayBtn.addEventListener('mouseleave', this._play.bind(this))
		document.addEventListener('keydown', this._pressKey.bind(this))
	}

	prev() {
		this._goToPrev()
		this._pause()
	}

	next() {
		this._goToNext()
		this._pause()
	}

	pausePlay() {
		this.isPlaying ? this._pause() : this._play()
	}

	init() {
		this._initProps()
		this._initControls()
		this._initIndicators()
		this._tick(this.isPlaying)
		this._initListeners()
	}
}

export default Carousel;