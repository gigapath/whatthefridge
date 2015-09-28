module.exports = {
 'facebookAuth' : {
   'clientID': process.env.FB_ID,
   'clientSecret': process.env.FB_SECRET,
   'callbackURL': process.env.FB_CB
 },
 'twitterAuth' : {
   'consumerKey': process.env.TWITTER_KEY,
   'consumerSecret': process.env.TWITTER_SECRET,
   'callbackURL': process.env.TWITTER_CB
 },
 'instagramAuth' : {
   'clientID': process.env.INSTAGRAM_KEY,
   'clientSecret': process.env.INSTAGRAM_SECRET,
   'callbackURL': process.env.INSTAGRAM_CB
 },
 'googleAuth' : {
   'clientID': process.env.GOOGLE_ID,
   'clientSecret': process.env.GOOGLE_SECRET,
   'callbackURL': process.env.GOOGLE_CB
 }
}
