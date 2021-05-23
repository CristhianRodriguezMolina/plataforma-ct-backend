//DB Schema imports
import { model } from 'mongoose';
import LogicSequence from '../models/LogicSequence';

//Get all logic sequences from DB
export const getLogicSequences = async(req, res) => {
    const logicSequence = await LogicSequence.find();
    res.status(200).json({ message: "Logic sequences list request has been completed satisfactorily", logic_sequence: logicSequence });
};

//Create a new Logic Sequence
export const createLogicSequence = async(activity_id) => {

    //Creating a new Logic Sequence model
    const newLogicSequence = new LogicSequence({ activity_id });

    // Save the Logic Sequence in the DB
    const savedLogicSequence = await newLogicSequence.save();

    return { message: "The Logic Sequence has been created satisfactorily" };
};

//Update an LogicSequence
export const updateLogicSequenceById = async(req, res) => {
    const updatedLogicSequence = await LogicSequence.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    res.status(201).json({ message: "The Logic Sequence has been updated satisfactorily", logic_sequence: updatedLogicSequence });
};

//Delete a logic sequence
export const deleteLogicSequenceById = async(req, res) => {
    const deletedLogicSequence = await LogicSequence.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "The Logic Sequence has been deleted satisfactorily", deleted_logic_sequence });
};