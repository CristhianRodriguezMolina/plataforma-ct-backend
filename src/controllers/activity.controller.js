//DB Schema imports
import { model } from 'mongoose';
import Activity from '../models/Activity';
import TaskActivity from '../models/TaskActivity';

//API modules imports
import * as logicSequenceCtrl from './logic-sequence.controller';

//Get all activities from DB
export const getActivities = (req, res) => {
	try {
		Activity.find((err, activities) => {
			if (err) {
				console.log("ERROR when we trying to get all activities");
				console.log(err);
				return res.status(500).json({ message: "Unexpected error, try again later!" });
			}
			Activity.countDocuments((error, count) => {
				if (error) {
					console.log("ERROR when we trying to get all activities");
					console.log(error);
					return res.status(500).json({ message: "Unexpected error, try again later!" })
				}
				return res.status(200).json({ message: "Activities list request has been completed satisfactorily", activities, count });
			});

		});
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}

};

export const getMyActivities = (req, res) => {
	try {
		Activity.find({ creator: req.params.creatorId }, null, { sort: { name: 1 } },
			(err, activities) => {
				if (err) return res.status(500).json({ message: "Unexpected error, try again later!" });
				Activity.countDocuments((error, count) => {
					if (error) {
						console.log("ERROR when we trying to get all activities");
						console.log(error);
						return res.status(500).json({ message: "Unexpected error, try again later!" })
					}
					return res.status(200).json({ message: "Activities list request has been completed satisfactorily", activities, count });
				});
			});
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};

//Create a new activity
export const createActivity = (req, res) => {
	try {
		const { name, description, type, creator } = req.body;

		//Verifying Fields
		if (!name) {
			return res.status(400).json({ message: "Field(s) required!" })
		}
		if (type.localeCompare("logic_sequence") != 0 &&
			type.localeCompare("maze") != 0 &&
			type.localeCompare("questionnaire")) {
			return res.status(400).json({ message: "Invalid type" })
		}

		let temName = name.trim();

		//Verifying Fields
		if (temName.localeCompare("") == 0) {
			return res.status(400).json({ message: "Field(s) required!" })
		}

		//Creating a new activity model
		const newActivity = new Activity({ name: temName, description, type, creator })

		// Save the activity in the DB
		newActivity.save((err, savedActivity) => {
			if (err) return res.status(500).json({ message: "Unexpected error, try again later!" })
			let child;
			if (type.localeCompare("logic_sequence") == 0) {
				child = logicSequenceCtrl.createLogicSequence(savedActivity._id);
			} else if (type.localeCompare("maze") == 0) {
				console.log("maze");
				//Do some stuff
			} else if (type.localeCompare("questionnaire") == 0) {
				console.log("questionnaire");
				//Do some stuff
			}

			if (child) {
				child.then(() => {
					return res.status(201).json({ message: "The activity has been created satisfactorily", activity_id: savedActivity._id });
				}).catch(err => {
					console.log("ERROR found in createLogicSequence(logic_sequence.controller)")
					console.error(err);
					return res.status(500).json({ message: "Unexpected error, try again later!" })
				});
			}
			else {
				return res.status(400).json({ message: "Type no accepted" });
			}
		});
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};

//Update an activity
export const updateActivityById = (req, res) => {

	try {
		const { name } = req.body.activity;

		if (!name) {
			return res.status(400).json({ message: "Field(s) required!" })
		}

		let temName = name.trim();

		//Verifying Fields
		if (temName.localeCompare("") == 0) {
			return res.status(400).json({ message: "Field(s) required!" })
		}

		Activity.findById(req.params.id, (err, activity) => {
			if (err) {
				return res.status(500).json({ message: "Unexpected error, try again later!" });
			}
			if (activity) {
				let child;
				if (activity.type.localeCompare("logic_sequence") == 0) {
					child = logicSequenceCtrl.updateLogicSequenceByActivityId(activity._id, req.body.child);
				} else if (activity.type.localeCompare("maze") == 0) {
					console.log("maze");
					//Do some stuff
				} else if (activity.type.localeCompare("questionnaire") == 0) {
					console.log("questionnaire");
					//Do some stuff
				}
				if (!child) return res.status(500).json({ message: "Unexpected error, try again later!" });
				child.then(() => {
					Activity.findByIdAndUpdate(req.params.id, req.body.activity, {
						new: true
					}).then(() => {
						return res.status(201).json({ message: "The activity has been updated satisfactorily" });
					}).catch(error => {
						console.log("ERROR found in updateActivityById(activity.controller)");
						console.error(error);
						return res.status(500).json({ message: "Unexpected error, try again later!" });
					})
				}).catch(e => {
					console.log("ERROR found in updateLogicSequenceByActivityId(logic_sequence.controller)");
					console.error(e);
					return res.status(500).json({ message: "Unexpected error, try again later!" });
				});

			}
			else {
				return res.status(400).json({ message: "Activity not found" });
			}
		});

	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}

};

//Delete an activity
export const deleteActivityById = (req, res) => {

	try {
		Activity.findById(req.params.id, async (err, activity) => {
			if (err) {
				return res.status(500).json({ message: "Unexpected error, try again later!" });
			}

			if (!activity) {
				return res.status(400).json({ message: "Activity not found" });
			}

			let child;
			if (activity.type.localeCompare("logic_sequence") == 0) {
				child = logicSequenceCtrl.deleteLogicSequenceByActivityId(activity._id);
			} else if (activity.type.localeCompare("maze") == 0) {
				console.log("maze");
				//Do some stuff
			} else if (activity.type.localeCompare("questionnaire") == 0) {
				console.log("questionnaire");
				//Do some stuff
			}

			if (child) {
				child.then(() => {
					Activity.deleteOne({ _id: activity._id }, (error) => {
						if (error) {
							console.error("ERROR when try to deleteOne in deleteActivityById (activity.controller)");
							return res.status(500).json({ message: "Unexpected error, try again later!" })
						}

						TaskActivity.deleteMany({ activity: activity._id }, (e) => {
							if (e) return res.status(500).json({ message: "Unexpected error, try again later!" });
							return res.status(200).json({ message: "The activity has been deleted satisfactorily" });
						});
					});
				}).catch((e) => {
					console.log("ERROR found in deleteActivityById(activity.controller)")
					console.error(e);
					return res.status(500).json({ message: "Unexpected error, try again later!" })
				});
			} else {
				Activity.deleteOne({ _id: activity._id }, (error) => {
					if (error) {
						console.error("ERROR when try to deleteOne in deleteActivityById (activity.controller)");
						return res.status(500).json({ message: "Unexpected error, try again later!" });
					}

					TaskActivity.deleteMany({ activity: activity._id }, (e) => {
						if (e) return res.status(500).json({ message: "Unexpected error, try again later!" });
						return res.status(200).json({ message: "The activity has been deleted satisfactorily" });
					});

				});
			}
		});
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};
