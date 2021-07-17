//DB Schema imports
import LogicSequence from '../models/LogicSequence';

//Get all logic sequences from DB
export const getLogicSequences = async (req, res) => {
	try {
		const logicSequence = await LogicSequence.find();
		return res.status(200).json({ message: "Logic sequences list request has been completed satisfactorily", logicSequence });
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
};

//Create a new Sequence card
export const createSequenceCardByLogicSequenceId = (req, res) => {
	try {

		const { name, image } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Field(s) required!" });
		}

		let tempName = name.trim();

		if (tempName.localeCompare("") == 0) {
			return res.status(400).json({ message: "Field(s) required!" });
		}
		LogicSequence.findById(req.params.id, (err, logicSequence) => {
			if (err) {
				return res.status(500).json({ message: "Unexpected error, try again later!" });
			}
			if (logicSequence) {
				logicSequence.sequence_cards.push({ name, image });

				logicSequence.save((error, updatedLogicSequence) => {
					if (error) return res.status(500).json({ message: "Unexpected error, try again later!" })
					return res.status(201).json({ message: "The new Sequence card has been created satisfatorily", updatedLogicSequence })
				});
			}
			else {
				return res.status(400).json({ message: "Logic sequence not found" })
			}
		});


	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}

}

export const deleteSequenceCardByLogicSequenceId = (req, res) => {
	try {
		LogicSequence.findOneAndUpdate({
			"_id": req.params.id
		}, {
			"$pull": {
				sequence_cards: { _id: req.params.sequence_card_id }
			}
		}, {
			new: true
		}, (err, result) => {
			if (err) {
				return res.status(500).json({ message: "An error has ocurred when we trying to delete a sequence card" })
			}
			if (result) {
				return res.status(201).json({ message: "The Sequence card has been deleted satisfatorily", updatedLogicSequence: result })
			} else {
				return res.status(400).json({ message: "The logic sequence or the sequence card not found" });
			}
		});
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}


export const updateSequenceCardByLogicSequenceId = (req, res) => {

	try {

		const { name, image } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Field(s) required!" });
		}

		let tempName = name.trim();

		if (tempName.localeCompare("") == 0) {
			return res.status(400).json({ message: "Field(s) required!" });
		}
		LogicSequence.findOneAndUpdate({
			"_id": req.params.id,
			"sequence_cards._id": req.params.sequence_card_id
		}, {
			"$set": {
				"sequence_cards.$.name": name
			}
		}, {
			new: true
		}, (err, result) => {
			if (err) {
				return res.status(500).json({ message: "An error has ocurred when we trying to update a sequence card" })
			}
			if (result) {
				return res.status(201).json({ message: "The Sequence card has been updated satisfatorily", updatedLogicSequence: result })
			} else {
				return res.status(400).json({ message: "The logic sequence or the sequence card not found" });
			}
		}
		);

	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}

}

export const getLogicSequenceIdByActivityId = (req, res) => {
	try {
		LogicSequence.findOne({ activity_id: req.params.id }).populate("activity_id")
			.then((result) => {
				if (result) {
					return res.status(200).json(result);
				}
				return res.status(400).json({ message: "Logic Sequence not found" });
			})
			.catch(err => {
				console.log("========== ERROR LOG IN LOGIC SEQUENCE CONTROLLER getLogicSequenceIdByActivityId ==========")
				console.error(err);
				return res.status(500).json({ message: "An error has been found while we trying to get the logic sequence" });
			});
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}

//Create a new Logic Sequence
export const createLogicSequence = async (activity_id) => {

	try {
		//Creating a new Logic Sequence model
		const newLogicSequence = new LogicSequence({ activity_id });

		// Save the Logic Sequence in the DB
		newLogicSequence.save((err) => {
			if (err) {
				console.log("ERROR in createLogicSequence (logic_sequence.controller)");
				console.error(err)
				throw "Unexpected error, try again later!"
			}
		});
	} catch (e) {
		console.log(e)
		throw "Unexpected error, try again later!"
	}
};


//Delete a logic sequence
export const deleteLogicSequenceByActivityId = async (activity_id) => {
	try {

		LogicSequence.findOneAndDelete({ activity_id }, (err) => {
			if (err) {
				console.log("ERROR found in deleteLogicSequenceById(logicsequence.controller)");
				console.error(err);
				throw "Unexpected error, try again later!";
			}
		});
	} catch (e) {
		console.log(e)
		throw "Unexpected error, try again later!";
	}
};

//Update Logic Sequence by activity Id
export const updateLogicSequenceByActivityId = async (activity_id, sequence_cards) => {
	try {
		LogicSequence.findOneAndUpdate({ activity_id }, sequence_cards, {
			new: true
		}).then(() => {
			return { message: "La secuencia logica ha sido actualizada satisfactoriamente" };
		}).catch(err => {
			console.log("ERROR found in updateLogicSequenceByActivityId(logicsequence.controller)");
			console.error(err);
			throw "Unexpected error, try again later!";
		});
	} catch (e) {
		console.log(e)
		throw "Unexpected error, try again later!";
	}
}


