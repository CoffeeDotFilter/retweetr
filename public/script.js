var idArray = [].slice.call(document.getElementsByClassName('hiddenID'));



idArray.map(function(x){
	console.log(x.id);
});

var tweetArray = [].slice.call(document.getElementsByClassName('tweet'));

tweetArray.forEach(function(tweet) {
	tweet.addEventListener('click', function(e) {
		console.log('clicked');
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			console.log(xhr.status, xhr.readyState);
			if (xhr.status === 200 && xhr.readyState === 4) {
				tweet.innerHTML = xhr.responseText;
			}
		};
		var url = '/retweet?tweet_id=' + tweet.id;
		console.log(url);
		xhr.open('GET', url );
		xhr.send();
		console.log('sent request');
	});
});