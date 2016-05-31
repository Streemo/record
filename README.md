#Automatic user tracking
Exposes `Meteor.trackedMethods`, used exactly how you would use regular methods.
```
//client
Meteor.call('rate-post', postId, rating)
```

```
//server
Meteor.trackedMethods({
	rate-post: function(postId, rating, record){
	  let liked = rating > 6;
		record.track({user: this.userId, ratedPost: postId, likedPost: liked})
		// some processing
		return optionalSuccessMessageToUser;
	}
})

//later, something like this will be added to your database:
Records.findOne()
/*
{
	action: 'rate-post',
	createdAt: [Date],
	details: {
		user: [Id],
		ratedPost: [Id],
		likedPost [Boolean]
	},
	savedAt: [Date],
	returnedToClient: optionalSuccessMessageToUser
}
*/
```

#Neural network example
Manually track anything, anywhere, from user to machine behavior, or logs, or whatever (can do this with or without `Meteor.trackedMethods`):
`Record` takes an invoker, and a record name. Invoker can be `this` of a method/publisher, or some object which contains an `_id` or `userId` field.

```
import Record from "meteor/streemo:record";

//in method
Meteor.methods({
	'buy-item': function(routeHistory, itemId){
		let record = new Record(this, 'neural-network-data');
		record.track({input: routeHistory, output: itemId});
		let item = Items.findOne(itemId);
		braintreeChargeCard(item, this.userId);
		sendConfirmationEmail(item, this.userId);
		return record.save({thisGetsReturnedToClient: "You successfully placed an order!"});
	}
})
```
```
//one week later
let trainingData = db.records.find({type: "neural-network-data"}, {"details.input":1, "details.output":1})
```