//DB Schema imports
import Maze from "../models/Maze";

//Create a new Maze
export const createMaze = async (activity_id) => {

	try {
		var mazeCells = [];

		// The cells are created with 5 cols and 5 rows as initial cells
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				const cell = {
					i,
					j,
					type: 'EMPTY'
				}
				mazeCells.push(cell);
			}
		}

		//Creating a new Maze model
		const newMaze = new Maze({ activity_id, cells: mazeCells });

		// Save the Maze in the DB
		newMaze.save((err) => {
			if (err) {
				console.log("ERROR in createMaze (maze.controller)");
				console.error(err)
				throw "Unexpected error, try again later!"
			}
		});
	} catch (e) {
		console.log(e)
		throw "Unexpected error, try again later!"
	}
};

export const getMazeByActivityId = (req, res) => {
	try {
		Maze.findOne({ activity_id: req.params.id }).populate("activity_id")
			.then((result) => {
				if (result) {
					return res.status(200).json(result);
				}
				return res.status(400).json({ message: "Maze not found" });
			})
			.catch(err => {
				console.log("========== ERROR LOG IN MAZE CONTROLLER getMazeIdByActivityId ==========")
				console.error(err);
				return res.status(500).json({ message: "An error has been found while we trying to get a Maze" });
			});
	} catch (e) {
		console.log(e)
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
	}
}