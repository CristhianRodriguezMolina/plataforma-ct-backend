import LogicSequence from '../models/LogicSequence';
import fs from 'fs';
import path from 'path';

export const uploadImg = async(req, res) => {
    await LogicSequence.findById(req.params.logic_sequence_id, async(err, oldLogicSequence) => {
        if(err) {
            return res.status(500).json({ message: "Unexpected error, try again later!"});
        }

        if(oldLogicSequence) {
            const filename = req.file.filename;
            /**
             * Search the sequence card to update image
             */
             await LogicSequence.findOneAndUpdate({
                "_id": req.params.logic_sequence_id,
                "sequence_cards._id": req.params.sequence_card_id
               }, { 
                   "$set": {
                    "sequence_cards.$.name": req.body.name,
                    "sequence_cards.$.image": filename
                   }
               }, {
                   new: true
               }, (err, result) => {
                   if(err) {
                       return res.status(500).json({ message: "An error has ocurred when we trying to update a sequence card", error: err })
                   }
                   if(result) {
                    let filePath = path.join(__dirname, `../static_content/i/${oldLogicSequence.image}`);
                    if (fs.existsSync(filePath)) {
                        fs.unlink(filePath, (err) => {
                            if (err) return console.log(err);
                            console.log(`file deleted successfully: ${filePath}`);
                        });
                    }
                       return res.status(201).json({ message: "The Sequence card has been updated satisfatorily", updatedLogicSequence: result })
                   } else {
                       return res.status(400).json({ message: "The logic sequence or the sequence card not found"});
                   }
               }
            );
        } else {
            return res.status(400).json({ message: "Logic sequence not found" });
        }
    });
}