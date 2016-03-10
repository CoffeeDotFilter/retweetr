(function() {
	var tweetArray = [].slice.call(document.getElementsByClassName('tweet'));
	var retweetUrl = '/retweet?tweet_id=';
	var favoriteUrl = '/favorite?id=';
	var retweetOverlay = document.getElementById('retweet-success');
	var favoriteOverlay = document.getElementById('favorite-success');

	var twitterRequest = function(urlFragment, tweet) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			// console.log(xhr.status, xhr.readyState);
			if (xhr.status === 200 && xhr.readyState === 4) {
				if (urlFragment.indexOf('retweet') > -1) {
					retweetOverlay.classList.remove('hide');
					setTimeout(function() {
						retweetOverlay.classList.add('hide');
					}, 2000);
				} else {
					favoriteOverlay.classList.remove('hide');
					setTimeout(function() {
						favoriteOverlay.classList.add('hide');
					}, 2000);
				}
			}
		};
		var url = urlFragment + tweet.id;
		// console.log(url);
		xhr.open('GET', url );
		xhr.send();
		// console.log('sent request');
	};

	function removeTweet(el) {
		setTimeout(function() {
			el.style.display = 'none';
		}, 500);
	}

	function setHammers(hammerInstance, el, retweetUrl, favoriteUrl) {
		hammerInstance.on('swiperight', function() {
			twitterRequest(favoriteUrl, el);
			removeTweet(el);
			el.style.transform = 'translateX(100vw)';
			// console.log('swiped right!');
		});

		hammerInstance.on('swipeleft', function() {
			removeTweet(el);
			el.style.transform = 'translateX(-100vw)';
			// console.log('swiped left!');
		});

		hammerInstance.on('swipeup', function() {
			removeTweet(el);
			twitterRequest(retweetUrl, el);
			el.style.transform = 'translateY(-100vh)';
			// console.log('swiped up!');
		});
	}

	// for each tweet we create a new hammer instance (so the swipe event listeners can be added)
	// create a new hammer instance for each
	// pass this into the setHammers function

	// two of the three listeners send twitter requests
	// the third just swipes left

	tweetArray.forEach(function(tweet) {
		var tweetHammer = new Hammer(tweet, {});
		tweetHammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
		setHammers(tweetHammer, tweet, retweetUrl, favoriteUrl);
	});
}());
