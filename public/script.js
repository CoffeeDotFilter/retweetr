(function() {
	var tweetArray = [].slice.call(document.getElementsByClassName('tweet'));
	var retweetUrl = '/retweet?id=';
	var favoriteUrl = '/favorite?id=';
	var retweetOverlay = document.getElementById('retweet-success');
	var favoriteOverlay = document.getElementById('favorite-success');
	var retweetclick = document.getElementById('retweet-click');
	var favclick = document.getElementById('favclick-click');
	var deleteclick = document.getElementById('delete');


	function flashOverlay(successOverlay) {
		successOverlay.classList.remove('hide');
		setTimeout(function() {
			successOverlay.classList.add('hide');
		}, 2000);
	}

	var twitterRequest = function(urlFragment, tweet) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.status === 200 && xhr.readyState === 4) {
				if (urlFragment.indexOf('retweet') > -1) {
					flashOverlay(retweetOverlay);
				} else {
					flashOverlay(favoriteOverlay);
				}
			}
		};
		var url = urlFragment + tweet.id;
		xhr.open('GET', url );
		xhr.send();
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
		});

		hammerInstance.on('swipeleft', function() {
			removeTweet(el);
			el.style.transform = 'translateX(-100vw)';
		});

		hammerInstance.on('swipeup', function() {
			removeTweet(el);
			twitterRequest(retweetUrl, el);
			el.style.transform = 'translateY(-100vh)';
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

function footerretweet(retweetUrl, el) {
retweetclick.addEventListener('click', function() {
  twitterRequest(retweetUrl, el);
});
}

function footerdelete(el) {
deleteclick.addEventListener('click', function() {
  removeTweet(el);
});
}

function footerlike(favoriteUrl, el) {
favclick.addEventListener('click', function() {
  twitterRequest(favoriteUrl, el);
});
}
