#Track what happens on your server.
Track events, data, and metadata in an organized way on your server.
###Automatic user tracking
Exposes `Meteor.trackedMethods`, used exactly how you would use regular methods.
```
//client
Meteor.call('rate-post', postId, rating)

//server
Meteor.trackedMethods({
	rate-post: function(postId, rating, record){
	  let liked = rating > 6;
		record.track({user: this.userId, ratedPost: postId, likedPost: liked})
		// some processing
		return optionalSuccessMessageToUser;
	}
})
```

###Neural network example
`Record` takes an invoker, and a record type. Invoker can be `this` of a method/publisher, or some object which contains an `_id` or `userId` field.

```
import Record from "meteor/streemo:record";

//could also be a trackedMethod (see above), then you don't have to call record.save
//as this happens automatically in trackedMethods

Meteor.methods({
	'buy-item': function(routeHistory, itemId){
		let record = new Record(this, 'neural-network-data');
		record.track({input: routeHistory, output: itemId});
		let item = Items.findOne(itemId);
		braintreeChargeCard(item, this.userId);
		return record.save({thisGetsReturnedToClient: "You successfully placed an order!"});
	}
})
```