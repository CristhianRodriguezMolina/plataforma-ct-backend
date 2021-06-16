import LogicSequence from '../models/LogicSequence';
import fs from 'fs';
import path from 'path';

export const uploadImg = (req, res) => {

	try {

		if (!req.file) {
			return res.status(400).json({ message: "The image couldn't be uploaded, make sure you are uploading an image file or check your internet connection" });
		}

		LogicSequence.findById(req.params.logic_sequence_id, (err, oldLogicSequence) => {
			if (err) {
				console.log('err');
				console.log(err);
				return res.status(500).json({ message: "Unexpected error, try again later!" });
			}

			if (oldLogicSequence) {
				const filename = req.file.filename;
				/**
				 * Search the sequence card to update image
				 */
				LogicSequence.findOneAndUpdate({
					"_id": req.params.logic_sequence_id,
					"sequence_cards._id": req.params.sequence_card_id
				}, {
					"$set": {
						"sequence_cards.$.name": req.body.name,
						"sequence_cards.$.image": filename
					}
				}, {
					new: true
				}, (error, result) => {
					if (error) {
						console.log('error');
						console.log(error);
						return res.status(500).json({ message: "An error has ocurred when we trying to update a sequence card" });
					}
					if (result) {
						let length = oldLogicSequence.sequence_cards.length;
						let found = false;
						let sequenceCard;
						for (let i = 0; i < length && !found; i++) {
							let tempSequenceCard = oldLogicSequence.sequence_cards[i];
							if (tempSequenceCard._id.equals(req.params.sequence_card_id)) {
								found = true;
								sequenceCard = tempSequenceCard;
							}
						}
						let filePath = path.join(__dirname, `../../static_content/i/${sequenceCard.image}`);
						if (fs.existsSync(filePath)) {
							fs.unlink(filePath, (er) => {
								if (er) return console.log(er);
								console.log(`file deleted successfully: ${filePath}`);
							});
						}
						return res.status(201).json({ message: "The Sequence card has been updated satisfatorily", updatedLogicSequence: result })
					} else {
						return res.status(400).json({ message: "The logic sequence or the sequence card not found" });
					}
				}
				);
			} else {
				return res.status(400).json({ message: "Logic sequence not found" });
			}
		});
	}
	catch (e) {
		console.log('e');
		console.log(e);
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}