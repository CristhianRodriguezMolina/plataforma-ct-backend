//DB Schema imports
import { model } from 'mongoose';
import LogicSequence from '../models/LogicSequence';

//Get all logic sequences from DB
export const getLogicSequences = async(req, res) => {
    const logicSequence = await LogicSequence.find();
    res.status(200).json({ message: "Logic sequences list request has been completed satisfactorily", logicSequence });
};

//Create a new Logic Sequence
export const createLogicSequence = async(activity_id) => {

    //Creating a new Logic Sequence model
    const newLogicSequence = new LogicSequence({ activity_id });

    // Save the Logic Sequence in the DB
    const savedLogicSequence = await newLogicSequence.save();

    return { message: "The Logic Sequence has been created satisfactorily", savedLogicSequence };
};

//Create a new Sequence card
export const createSequenceCardByLogicSequenceId = async(req, res) => {
    const { name, image } = req.body;

    if(req.params.id == undefined){
        res.status(400).json({ message: "Logic Sequence document not found!" });
    }

    if(name.localeCompare("") == 0) {
        res.status(400).json({ message: "Field(s) required!" });
    }
    const logicSequence = await LogicSequence.findById(req.params.id);

    if(logicSequence != undefined){
        logicSequence.sequence_cards.push({name, image});
    
        const updatedLogicSequence = await logicSequence.save();
    
        res.status(201).json({ message: "The new Sequence card has been created satisfatorily", updatedLogicSequence })
    }
    else{
        res.status(400).json({ message: "Logic sequence not found" })
    }

}

export const deleteSequenceCardByLogicSequenceId = async(req, res) => {

    if(req.params.id == undefined){
        res.status(400).json({ message: "Logic Sequence document not found!" });
    }

    const logicSequence = await LogicSequence.findById(req.params.id);

    logicSequence.sequence_cards.pull(req.params.sequence_card_id);

    const updatedLogicSequence = await logicSequence.save();

    res.status(201).json({ message: "The Sequence card has been deleted satisfatorily", updatedLogicSequence })
}

export const updateSequenceCardByLogicSequenceId = async(req, res) => {

    
    const { name, image } = req.body;

    if(req.params.id == undefined){
        res.status(400).json({ message: "Logic Sequence document not found!" });
    }

    if(name.localeCompare("") == 0) {
        res.status(400).json({ message: "Field(s) required!" });
    }
    await LogicSequence.findOneAndUpdate(
        { "_id": req.params.id, "sequence_cards._id": req.params.sequence_card_id },
        { 
            "$set": {
                "sequence_cards.$.name": name,
                "sequence_cards.$.image": image,
            }
        },
        {
            new: true
        },
        function (err, result) {

            if(err) {
                res.status(400).json({ message: "An error has ocurred when we trying to update a sequence Card", error: err })
            }
            res.status(201).json({ message: "The Sequence card has been updated satisfatorily", updatedLogicSequence: result })
        }
    );
    
   
}


//Delete a logic sequence
export const deleteLogicSequenceById = async(activity_id) => {
    const child = await LogicSequence.findOneAndDelete({ activity_id });
};

//Update Logic Sequence by activity Id
export const updateLogicSequenceByActivityId = async(activity_id, sequence_cards) => {
    console.log("data in updateLogicSequenceByActivityId")
    console.log(sequence_cards)
    await LogicSequence.findOneAndUpdate({ activity_id }, sequence_cards, {
        new: true
    }).then(result => {
        return { message: "The Logic sequence has been updated satisfactorily", updatedLogicSequence: result };
    }).catch(err => {
        console.log("ERROR found in updateLogicSequenceByActivityId(logicsequence.controller)");
        console.log(err);
        throw "Unexpected error, try again later!";
    });
}

export const getLogicSequenceIdByActivityId = async(req, res) => {
    await LogicSequence.findOne({activity_id: req.params.id}).populate("activity_id")
        .then((result) => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log("========== ERROR LOG IN LOGIC SEQUENCE CONTROLLER getLogicSequenceIdByActivityId ==========")
            console.error(err);
            res.status(400).json({message: "An error has been found while we trying to get the logic sequence"});
        });
       
}
