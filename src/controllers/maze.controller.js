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

		console.log(newMaze);

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

export const resizeMaze = async(req, res) => {
	try {
		const { cells, columns, rows } = req.body;


		var maze = await Maze.findOne({ activity_id: req.params.id });

		if (maze) {

			maze = saveCells(maze, cells, columns, rows);

			await maze.save();
		

			res.status(201).json({message: "Cells updated satisfactorily", maze});

		}
		else {
			res.status(404).json({messge: "Maze not found"});
		}
	} 
	catch (e) {
		console.log(e);
		return res.status(500).json({message: "Unexpected error, please try again later!"});
	}
};


/**
 * Method for save the cells resizing if it's necesary
 * @param {Object} Maze which contains the old cells.
 * @param {Array} newCells The new cells which will be replaced for the old cells
 * @param {Number} Columns The new number of columns
 * @param {Number} Rows The new number of rows
 * @return {Object} the updated maze
 */
const saveCells = (maze, newCells, columns, rows) => {
			
	var oldCells = maze.cells;

	for(let i = 0; i < columns; i++) {
		for(let j = 0; j < rows; j++) {
			let tempOldCell = oldCells.find(cell => cell.j === j && cell.i === i);
			let tempNewCell = newCells.find(cell => cell.j === j && cell.i === i);

			if(tempOldCell) {

				if(tempOldCell.type !== tempNewCell.type) {
					tempOldCell.type = tempNewCell.type;
				}
			} else {
				const cell = {
					i,
					j,
					type: 'empty'
				}
				oldCells.push(cell);
			}
		}
	}

	if(columns < maze.cols || rows < maze.rows){

		let eliminatedLeftoverCellsMatrix = oldCells.filter(cell => {
			return cell.j < rows && cell.i < columns;
		});

		maze.cells = eliminatedLeftoverCellsMatrix;

	}

	maze.cols = columns;
	maze.rows = rows;

	return maze;

};

export const updateMazeByActivityId = async(req, res) => {
	try {
		const { instructions, cells, columns, rows } = req.body;

		var maze = await Maze.findOne({ activity_id: req.params.id });

		if(maze) {
			
			maze = saveCells(maze, cells, columns, rows);

			maze.instructions = instructions;

			await maze.save();
		
			res.status(201).json({message: "Cells updated satisfactorily", maze});
		} else {
			res.status(404).json({messge: "Maze not found"});
		}

	} catch (e) {
		console.log(e);
		return res.status(500).json({message: "Unexpected error, please try again later!"});
	}
	
};
