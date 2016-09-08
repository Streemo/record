# Track what happens on your server.
Track events, data, and metadata in an organized way on your server.
## Automatic tracking of events.
Exposes `Meteor.trackedMethods`, used like how you would use regular methods.

### Record methods
```
//record is an instance of Record
//record is available as the first argument to all trackedMethods.

record.getDate() // returns the Datetime the method handler was invoked on.
record.discard() // call this to tell the handler to NOT save the record when it's done.
record.track(obj) // store a custom JSON obj in this record.
```

### Example
```
//client
Meteor.call('rate-post', postId, rating)

//server
const defaultOpts = {
  debug: false, // if true, any error.error thrown in a trackedMethod will be logged
  appName: "app"
}
Meteor.trackedMethods(defaultOpts, {
	rate-post: function(record, postId, rating){
	  let liked = rating > 6;
    //get the date of the record's creation
    let oneHour = record.getDate().getTime() + 3600000
		record.track({
      user: this.userId, 
      ratedPost: postId, 
      likedPost: liked,
      oneHourLater: oneHour
    })
		// some processing
    // oops, we don't wanna save the record after discovering
    // the user's karma is too low.
    record.discard();
		return optionalSuccessMessageToUser;
	}
})
```