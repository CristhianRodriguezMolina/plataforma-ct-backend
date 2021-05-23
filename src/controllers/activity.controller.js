//DB Schema imports
import { model } from 'mongoose';
import Activity from '../models/Activity';

//API modules imports
import * as logicSequenceCtrl from './logic_sequence.controller';

//Get all activities from DB
export const getActivities = async(req, res) => {
    const activities = await Activity.find();
    res.status(200).json({message: "Activities list request has been completed satisfactorily", activities});
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

    let message; 
    if(type.localeCompare("logic_sequence") == 0) {
        message = logicSequenceCtrl.createLogicSequence(savedActivity._id);
    }

    console.log(message);

    res.status(201).json({message: "The activity has been created satisfactorily", activity: savedActivity});
};

//Update an activity
export const updateActivityById = async(req, res) => {
    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    res.status(201).json({ message: "The activity has been updated satisfactorily", activity: updatedActivity });
};

//Delete an activity
export const deleteActivityById = async(req, res) => {
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "The activity has been deleted satisfactorily", deleted_activity});
};