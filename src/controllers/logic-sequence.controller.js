//DB Schema imports
import e from 'cors';
import { model } from 'mongoose';
import LogicSequence from '../models/LogicSequence';

//Get all logic sequences from DB
export const getLogicSequences = async(req, res) => {
    const logicSequence = await LogicSequence.find();
    return res.status(200).json({ message: "Logic sequences list request has been completed satisfactorily", logicSequence });
};

//Create a new Logic Sequence
export const createLogicSequence = async(activity_id) => {

    //Creating a new Logic Sequence model
    const newLogicSequence = new LogicSequence({ activity_id });

    // Save the Logic Sequence in the DB
    await newLogicSequence.save((err) => {
        if(err) {
            console.log("ERROR in createLogicSequence (logic_sequence.controller)");
            console.error(err)
            throw "Unexpected error, try again later!"
        }
    });
};

//Create a new Sequence card
export const createSequenceCardByLogicSequenceId = async(req, res) => {
    const { name, image } = req.body;

    if(!name){
        return res.status(400).json({ message: "Field(s) required!" });
    }

    let tempName = name.trim();

    if(tempName.localeCompare("") == 0) {
        return res.status(400).json({ message: "Field(s) required!" });
    }
    await LogicSequence.findById(req.params.id, async(err, logicSequence) => {
        if(err) {
            return res.status(500).json({ message: "Unexpected error, try again later!"});
        }
        if(logicSequence){
            logicSequence.sequence_cards.push({name, image});
        
            await logicSequence.save((error, updatedLogicSequence) => {
                if (error) return res.status(500).json({ message: "Unexpected error, try again later!"})
                return res.status(201).json({ message: "The new Sequence card has been created satisfatorily", updatedLogicSequence })
            });
        }
        else{
            return res.status(400).json({ message: "Logic sequence not found" })
        }
    });

    

}

export const deleteSequenceCardByLogicSequenceId = async(req, res) => {
    await LogicSequence.findOneAndUpdate({
         "_id": req.params.id
        }, { 
            "$pull": {
                sequence_cards: { _id: req.params.sequence_card_id }
            }
        }, {
            new: true
        }, (err, result) => {
            if(err) {
                return res.status(500).json({ message: "An error has ocurred when we trying to delete a sequence card", error: err })
            }
            if(result) {
                return res.status(201).json({ message: "The Sequence card has been deleted satisfatorily", updatedLogicSequence: result })
            }  else {
                return res.status(400).json({ message: "The logic sequence or the sequence card not found"});
            }
        }
    );
    
   
}


export const updateSequenceCardByLogicSequenceId = async(req, res) => {

    
    const { name, image } = req.body;

    if(!name){
        return res.status(400).json({ message: "Field(s) required!" });
    }

    let tempName = name.trim();

    if(tempName.localeCompare("") == 0) {
        return res.status(400).json({ message: "Field(s) required!" });
    }
    await LogicSequence.findOneAndUpdate({
         "_id": req.params.id,
         "sequence_cards._id": req.params.sequence_card_id
        }, { 
            "$set": {
                "sequence_cards.$.name": name,
                "sequence_cards.$.image": image,
            }
        }, {
            new: true
        }, (err, result) => {
            if(err) {
                return res.status(500).json({ message: "An error has ocurred when we trying to update a sequence card", error: err })
            }
            if(result) {
                return res.status(201).json({ message: "The Sequence card has been updated satisfatorily", updatedLogicSequence: result })
            } else {
                return res.status(400).json({ message: "The logic sequence or the sequence card not found"});
            }
        }
    );
    
   
}


//Delete a logic sequence
export const deleteLogicSequenceByActivityId = async(activity_id) => {
    LogicSequence.findOneAndDelete({ activity_id }, (err) => {
        if(err) {
            console.log("ERROR found in deleteLogicSequenceById(logicsequence.controller)");
            console.error(err);
            throw "Unexpected error, try again later!";
        }
    });
};

//Update Logic Sequence by activity Id
export const updateLogicSequenceByActivityId = async(activity_id, sequence_cards) => {
    await LogicSequence.findOneAndUpdate({ activity_id }, sequence_cards, {
        new: true
    }).then(() => {
        return { message: "The Logic sequence has been updated satisfactorily" };
    }).catch(err => {
        console.log("ERROR found in updateLogicSequenceByActivityId(logicsequence.controller)");
        console.error(err);
        throw "Unexpected error, try again later!";
    });
}

export const getLogicSequenceIdByActivityId = async(req, res) => {
    await LogicSequence.findOne({activity_id: req.params.id}).populate("activity_id")
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch(err => {
            console.log("========== ERROR LOG IN LOGIC SEQUENCE CONTROLLER getLogicSequenceIdByActivityId ==========")
            console.error(err);
            return res.status(400).json({message: "An error has been found while we trying to get the logic sequence"});
        });
       
}
