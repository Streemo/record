import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Mongo } from "meteor/mongo";
import { _ } from "meteor/underscore";

let Records = new Mongo.Collection('records');

export default class Record {
	constructor(invoker, name, appName){
		this._record = {
			userId: invoker._id || invoker.userId || null,
			type: name,
			createdAt: new Date(),
			_id: Random.id(),
			details:{},
			app:appName
		}
		this._shouldSave = true;
	}
	_save(toClient){
		if (this._shouldSave){
			let r = this._record
			r.returnedToClient = toClient;
			r.savedAt = new Date();
			r.lifetime = r.savedAt - r.createdAt;
			Records.insert(r);
		}
		return toClient;
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
	getDate(){
		return this._record.createdAt;
	}
	discard(){
		this._shouldSave = false;
	}

}

Meteor.trackedMethods = function(opts, methods){
	_.each(methods, (fn, name) => {
		methods[name] = function(...a){
			let record = new Record(this,name,opts.appName || "app");
			try {
				let sendToClient = fn.apply(this,[record, ...a]);
				return record._save(sendToClient);
			} catch (e){
				record._save({error:e.error});
				opts.debug && console.log(e.error);
				throw e;
			}
		}
	})
	this.methods(methods);
}