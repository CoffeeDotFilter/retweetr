# Retweetr

![retweetr](https://files.gitter.im/JackTierney/ThreeLoops/zMGl/retweetr-logo-01.png)

Retweetr is a tinder style app for liking and retweeting tweets

Check out the app on [www.retweetr.herokuapp.com](http://retweetr.herokuapp.com/)

### Why?

Because we are learning how to implement Oauth with a 3rd party service, we'll be allowing users to login via their twitter accounts for this app. For gold standard security, we will be using JSON web tokens (JWTs) to authenticate our users

### How?

We'll be building Retweetr using:

+ Node.js with Hapi - our server technology
+ Handlebars - to render our views
+ Authentication using Oauth2 and JWT
+ Hammer.js - a gesture library for swiping tweets

The main feature of the app will be to show the user their news feed of most recent tweets (displayed as a card), which the user can swipe right to like the tweet, swipe up to retweet or swipe left to ignore it

These are the initial sketches:

![img_479213553](https://cloud.githubusercontent.com/assets/14013616/13633654/548e1444-e5e8-11e5-9c32-4dead481b452.JPG)
![img_479213559](https://cloud.githubusercontent.com/assets/14013616/13633655/548f1498-e5e8-11e5-85d0-14f5fa39d3f8.JPG)

This is the high fidelity mockup:

![retweetr5-01](https://cloud.githubusercontent.com/assets/14013616/13683885/23eb8a50-e701-11e5-8f2d-a8d392af8514.png)

A strectch goal could be to filter the tweets via the user selecting followers they'd like to see tweets of

### Data structures

Our main data structure will be the tweet data:

These tweets could be stored as hashes that could look something like:

```js
{
  "TweetID": "1234567",
  "User": "Andrew MacMurray",
  "TwitterHandle": "@A_MacMurray",
  "Body": "@founderscoders you guys are the best",
  "Date": "09-03-2016",
  "Likes": "89",
  "Retweets": "120",
}
```

We can use this data to render elements to the page and even store a history of liked, retweeted or ignored tweets.


![img_479213564](https://cloud.githubusercontent.com/assets/14013616/13633656/549045c0-e5e8-11e5-998c-e15bb58cd165.JPG)

### Running the app locally and making changes

To run the app locally, clone the repo using
```shell
$ git clone https://github.com/CoffeeDotFilter/retweetr.git
```

and run:

```shell
$ npm install
```

to install the dependencies.

You'll also need a `config.env` file in your root directory with the following properties:

```
CONSUMER_KEY='your key goes here'
CONSUMER_SECRET='your secret goes here'
JWT_SECRET='choose any secret you like'
```

Sign up via twitter to register your own app to get a consumer key and consumer secret (make sure you enter a dummy link and callback url on the signup page)

You can then run the app by starting the server with:

```shell
$ npm start
```

And visiting `http://localhost:4000`

Feel free to suggest changes in an issue or submit a pull request!
