//DB Schema imports
import { model } from 'mongoose';
import Activity from '../models/Activity';

//API modules imports
import * as logicSequenceCtrl from './logic_sequence.controller';

//Get all activities from DB
export const getActivities = async(req, res) => {
    const activities = await Activity.find();
    const count = await Activity.countDocuments();
    res.status(200).json({message: "Activities list request has been completed satisfactorily", activities, count});
};

//Create a new activity
export const createActivity = async(req, res) => {
    const { name, description, type } = req.body;

    //Verifying Fields
    if (name == undefined) {
        return res.status(400).json({message: "Field(s) required!"})
    }

    let temName = name.trim();

    //Verifying Fields
    if(temName == undefined || temName.localeCompare("") == 0) {
        return res.status(400).json({message: "Field(s) required!"})
    }

    //Creating a new activity model
    const newActivity = new Activity({name: temName, description, type})

    // Save the activity in the DB
    const savedActivity = await newActivity.save();

    let child; 
    if(type.localeCompare("logic_sequence") == 0) {
        child = logicSequenceCtrl.createLogicSequence(savedActivity._id);
    }

    child.then((result) => {
        res.status(201).json({message: "The activity has been created satisfactorily", activity: savedActivity, savedChild: result});
    }).catch(err => {
        console.log("ERROR found in createLogicSequence(logic_sequence.controller)")
        console.err(err);
        res.status(500).json({ message: "Unexpected error, try again later!"})
    });

    
};

//Update an activity
export const updateActivityById = async(req, res) => {

    const activity = await Activity.findById(req.params.id);
    console.log("req.body.child")
    console.log(req.body.child)
    let child;
    console.log("here")
    if(activity.type.localeCompare("logic_sequence") == 0) {
        child = logicSequenceCtrl.updateLogicSequenceByActivityId(activity._id, req.body.child);
    }
    
    child.then(async(childResult) => {
        console.log("CHILD11");
        console.log(childResult);
        await Activity.findByIdAndUpdate(req.params.id, req.body.activity, {
            new: true
        }).then(result => {
            console.log("CHILD");
            console.log(child);
            res.status(201).json({ message: "The activity has been updated satisfactorily", updatedActivity: result, updatedChild: childResult });
        }).catch(err => {
            console.log("ERROR found in updateActivityById(activity.controller)")
            console.err(err);
            res.status(500).json({ message: "Unexpected error, try again later!"})
        })
    }).catch(err => {
        console.log("ERROR found in updateLogicSequenceByActivityId(logic_sequence.controller)")
        console.err(err);
        res.status(500).json({ message: "Unexpected error, try again later!"})
    });

    
};

//Delete an activity
export const deleteActivityById = async(req, res) => {

    const activity = await Activity.findById(req.params.id);
    let child;
    if(activity.type.localeCompare("logic_sequence") == 0) {
        child = await logicSequenceCtrl.deleteLogicSequenceById(activity._id);
    }

    await Activity.deleteOne({_id: activity._id}, function(err) {
        if (err) return handleError(err);
    });

    res.status(200).json({message: "The activity has been deleted satisfactorily", deletedActivity: activity, deletedChild: child});
};
