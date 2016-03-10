var tweetArray = [].slice.call(document.getElementsByClassName('tweet'));
console.log(tweetArray.id);

var retweetUrl = '/retweet?tweet_id=';
var favoriteUrl = '/favorite?id=';

var twitterRequest = function(urlFragment, tweet) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		// console.log(xhr.status, xhr.readyState);
		if (xhr.status === 200 && xhr.readyState === 4) {
			tweet.innerHTML = xhr.responseText;
		}
	};
	var url = urlFragment + tweet.id;
	// console.log(url);
	xhr.open('GET', url );
	xhr.send();
	// console.log('sent request');
};

// var mcHammer = document.getElementById('hammer-test');
// var testHammer = new Hammer(mcHammer, {});
// testHammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

function setHammers(hammerInstance, el, retweetUrl, favoriteUrl) {
	hammerInstance.on('swiperight', function() {
		twitterRequest(favoriteUrl, el);
		el.style.transform = 'translateX(300px)';
		console.log('swiped right!');
	});

	hammerInstance.on('swipeleft', function() {
		el.style.transform = 'translateX(-300px)';
		console.log('swiped left!');
	});

	hammerInstance.on('swipeup', function() {
		twitterRequest(retweetUrl, el);
		el.style.transform = 'translateY(-300px)';
		console.log('swiped up!');
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
