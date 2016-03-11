var swipeRight = document.getElementById('swipe-right');
var hammerRight = new Hammer(swipeRight, {});
hammerRight.on('swiperight', function () {
	swipeRight.style.transform = 'translateX(100vw)';
});

var swipeUp = document.getElementById('swipe-up');
var hammerUp = new Hammer(swipeUp, {});
hammerUp.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
hammerUp.on('swipeup', function () {
	swipeUp.style.transform = 'translateY(-100vh)';
});

var swipeLeft = document.getElementById('swipe-left');
var hammerLeft = new Hammer(swipeLeft, {});
hammerLeft.on('swipeleft', function () {
	swipeLeft.style.transform = 'translateX(-100vw)';
});
