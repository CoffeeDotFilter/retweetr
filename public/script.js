(function () {
	var tweetArray = [].slice.call(document.getElementsByClassName('tweet'));
	var retweetUrl = '/retweet?id=';
	var favoriteUrl = '/favorite?id=';
	var retweetOverlay = document.getElementById('retweet-success');
	var favoriteOverlay = document.getElementById('favorite-success');
	var retweetclick = document.getElementById('retweet-click');
	var favclick = document.getElementById('fav-click');
	var deleteclick = document.getElementById('delete-click');

	// Show retweet or favorite overlay for 2 seconds (on successful request)
	function flashOverlay(successOverlay) {
		successOverlay.classList.remove('hide');
		setTimeout(function () {
			successOverlay.classList.add('hide');
		}, 2000);
	}

	function toggleOverlay(url) {
		if (url.indexOf('retweet') > -1) {
			flashOverlay(retweetOverlay);
		} else {
			flashOverlay(favoriteOverlay);
		}
	}

	// Send request to /retweet or /favorite route
	var twitterRequest = function (urlFragment, tweet) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.status === 200 && xhr.readyState === 4) {
				toggleOverlay(urlFragment);
			}
		};
		var url = urlFragment + tweet.id;
		xhr.open('GET', url);
		xhr.send();
	};

	// Remove tweet after timeout (fired on swipes)
	function removeTweet(el) {
		setTimeout(function () {
			el.parentElement.removeChild(el);
			// deleteEl = 'none';
		}, 500);
	}

	// Set hammer instances for right, left and up swipes, with transforms
	function setHammers(hammerInstance, el, retweetUrl, favoriteUrl) {
		hammerInstance.on('swiperight', function () {
			twitterRequest(favoriteUrl, el);
			removeTweet(el);
			el.style.transform = 'translateX(100vw)';
		});

		hammerInstance.on('swipeleft', function () {
			removeTweet(el);
			el.style.transform = 'translateX(-100vw)';
		});

		hammerInstance.on('swipeup', function () {
			removeTweet(el);
			twitterRequest(retweetUrl, el);
			el.style.transform = 'translateY(-100vh)';
		});
	}

	// Apply new hammer and call setHammers for each tweet on the page
	tweetArray.forEach(function (tweet) {
		var tweetHammer = new Hammer(tweet, {});
		tweetHammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
		setHammers(tweetHammer, tweet, retweetUrl, favoriteUrl);
	});

	retweetclick.addEventListener('click', function() {
		var tweetElements = document.getElementById('tweet-array');
		var deleteEl = tweetElements.lastChild.previousElementSibling;
		deleteEl.style.transform = 'translateY(-100vh)';
		twitterRequest(retweetUrl, deleteEl);
		removeTweet(deleteEl);
	});

	deleteclick.addEventListener('click', function() {
		var tweetElements = document.getElementById('tweet-array');
		var deleteEl = tweetElements.lastChild.previousElementSibling;
		deleteEl.style.transform = 'translateX(-100vw)';
		removeTweet(deleteEl);
	});

	favclick.addEventListener('click', function() {
		var tweetElements = document.getElementById('tweet-array');
		var deleteEl = tweetElements.lastChild.previousElementSibling;
		deleteEl.style.transform = 'translateX(100vw)';
		twitterRequest(favoriteUrl, deleteEl);
		removeTweet(deleteEl);
	});

}());
