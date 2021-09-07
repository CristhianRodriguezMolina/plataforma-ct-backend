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
		console.log('Maze one')
		// Save the Maze in the DB
		newMaze.save((err) => {
			if (err) {
				console.log("ERROR in createMaze (maze.controller)");
				console.error(err)
				throw "Unexpected error, try again later!"
			}
		});
		console.log('Maze two')
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
				return res.status(400).json({ message: "Laberinto no encontrado" });
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

export const resizeMaze = async (req, res) => {
	try {
		const { cells, columns, rows, verified } = req.body;

		if (!cells || !columns || !rows) {
			return res.status(400).json({ message: '¡Campos requeridos!' });
		}

		if (columns <= 0 || rows <= 0) {
			return res.status(400).json({ message: 'El número de columnas o filas debe de ser mayor a cero' });
		}

		var maze = await Maze.findOne({ activity_id: req.params.id });

		if (maze) {

			maze.verified = verified;

			maze = saveCells(maze, cells, columns, rows);

			await maze.save();

			return res.status(201).json({ message: "Cells updated satisfactorily", maze });

		}
		else {
			return res.status(404).json({ message: "Maze not found" });
		}
	}
	catch (e) {
		console.log(e);
		return res.status(500).json({ message: "Unexpected error, please try again later!" });
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

	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {

			let tempOldCell = oldCells.find(cell => cell.j === j && cell.i === i);
			let tempNewCell = newCells.find(cell => cell.j === j && cell.i === i);

			if (tempOldCell) {

				if (tempOldCell.type !== tempNewCell.type) {
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

	if (columns < maze.cols || rows < maze.rows) {

		let eliminatedLeftoverCellsMatrix = oldCells.filter(cell => {
			return cell.j < rows && cell.i < columns;
		});

		maze.cells = eliminatedLeftoverCellsMatrix;

	}

	maze.cols = columns;
	maze.rows = rows;

	return maze;

};

//Delete a maze
export const deleteMazeByActivityId = async (activity_id) => {
	try {

		Maze.findOneAndDelete({ activity_id }, (err) => {
			if (err) {
				console.log("ERROR found in deleteMazeByActivityId(maze.controller)");
				console.error(err);
				throw "Unexpected error, try again later!";
			}
		});
	} catch (e) {
		console.log(e)
		throw "Unexpected error, try again later!";
	}
};

// Update a maze
export const updateMazeByActivityId = async (activity_id, maze_body) => {
	try {
		const { instructions, cells, columns, rows } = maze_body;

		var maze = await Maze.findOne({ activity_id: activity_id });

		if (maze) {

			// maze = saveCells(maze, cells, columns, rows);

			// Se actualizan las celdas del laberinto
			maze.cells = cells;

			// Se actualizan las instrucciones del laberinto
			maze.instructions = instructions;

			// Se guarda el laberinto
			await maze.save();

			return { message: "Laberinto actualizado satisfactoriamente" };
		} else {
			return { message: "Laberinto no encontrado" };
		}

	} catch (e) {
		console.log(e)
		throw "Unexpected error, try again later!";
	}
};
