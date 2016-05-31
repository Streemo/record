import { Meteor } from "meteor/meteor";
import { Collection } from "meteor/mongo";
import { _ } from "meteor/underscore";
import { Random } from "meteor/random";

let Records = new Collection('records');

export default class Record {
	constructor(invoker, name){
		this._record = {
			userId: invoker._id || invoker.userId || null,
			action: name,
			createdAt: new Date(),
			_id: Random.id(),
			app: "customer",
			details:{}
		}
	}
	track(data){
		let d = this._record.details;
		_.each(data,(v,k)=>{
			if (d[k] && _.isObject(v)){
				_.extend(d[k], v)
			} else {
				d[k] = v;
			}
		})
	}
	save(toClient){
		let r = this._record
		r.returnedToClient = toClient;
		r.savedAt = new Date();
		r.lifetime = r.savedAt - r.createdAt;
		Records.insert(r);
	}

}

Meteor.trackedMethods = function(methods){
	_.each(methods, (fn, name) => {
		methods[name] = function(...a){
			let record = new Record(this,name);
			let sendToClient = fn.apply(this,[...a, record]);
			record.save(sendToClient);
			return sendToClient;
		}
	})
	this.methods(methods);
}