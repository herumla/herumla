//hoover object
var hoover = {
	position: {
		x: null,
		y: null
	},
	dirt_patches_cleaned: 0,

	setInitPosition: function (x,y) {
		this.position.x = x;
		this.position.y = y;
	},
	getCurrentPosition: function() {
		return this.position;
	},
	move_hoover: function ( direction, room_dimensions ) {
		switch( direction ) {
			case 'E':
				//adding an if/else check to ensure if hoover hits the wall boundaries, the hoover position coordinates are not incremented
				//ie. if ( x + 1 ) <= room's max x, then x = x+1 else x = x
				this.position.x = (parseFloat(this.position.x) + 1 <= room_dimensions.x) ? parseFloat(this.position.x) + 1 : parseFloat(this.position.x) ;
				break;
			case 'W':
				this.position.x = (parseFloat(this.position.x) - 1 >= 0) ? parseFloat(this.position.x) - 1 : parseFloat(this.position.x);
				break;
			case 'N':
				this.position.y = (parseFloat(this.position.y) + 1 <= room_dimensions.y) ? parseFloat(this.position.y) + 1 : parseFloat(this.position.y);
				break;
			case 'S':
				this.position.y = (parseFloat(this.position.y) - 1 >= 0) ? parseFloat(this.position.y) - 1 : parseFloat(this.position.y);
				break;	
		}
	}
};

//room object
var room = {
	dimensions: {
		x: null,
		y: null
	},

	dirt_patches: [],

	setRoomDimension: function (x,y) {
		this.dimensions.x = x;
		this.dimensions.y = y;
	},
	addDirtPatches: function(x,y){
		var dirt_patch = {x,y};
		this.dirt_patches.push( dirt_patch);
	},
	isDirtPatch: function( hoover_position ) {

		//loop through all the dirt patches and remove the dirt patch once the hover position == dirt patch position and return true
		//else return false
		//assumption is that one dirt patch only shows up once in the file
		for(var i = 0; i < this.dirt_patches.length; i++) {

			if (hoover_position.x == this.dirt_patches[i].x && hoover_position.y == this.dirt_patches[i].y) {
				//starting at index i, remove 1 element ie. remove the dirt patch after it's been picked up
				this.dirt_patches.splice(i,1);
				return true;
			}
		}
		return false;
	}

};

//game object
var game = {
	movement_directions: null,
	
	runHoover: function( hoover, room ) {
		//Start game
		//Before any movement, check if initial hoover position has dirt patch
		if ( room.isDirtPatch( hoover.getCurrentPosition() ) ) {
			hoover.dirt_patches_cleaned++;
			//console.log("Dirt Count Incremented to " + hoover.dirt_patches_cleaned + " as picked up dirt at  " + hoover.getCurrentPosition().x + " " + hoover.getCurrentPosition().y);

		}	

		//loop through the movement directions and move_hoover
		for(const direction of this.movement_directions) {

			hoover.move_hoover(direction, room.dimensions);
			//console.log("Hoover moved " + direction +" and now is at position " + hoover.getCurrentPosition().x + " " + hoover.getCurrentPosition().y);

			if ( room.isDirtPatch( hoover.getCurrentPosition() ) ) {
				hoover.dirt_patches_cleaned++;
				//console.log("Dirt Count Incremented to " + hoover.dirt_patches_cleaned + " as picked up dirt at  " + hoover.getCurrentPosition().x + " " + hoover.getCurrentPosition().y);

			}	
		}
		//Game over
		console.log(hoover.getCurrentPosition().x + " " + hoover.getCurrentPosition().y);
		console.log(hoover.dirt_patches_cleaned);
	}

};


// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Missing FILE ' + process.argv[1]);
  process.exit(1);
}
// Read the file and its contents.
const fs = require('fs')
const filename = process.argv[2];
var data = fs.readFileSync(filename, 'utf-8')

//split each line into an array element --> [ '5 5', '1 2', '1 0', '2 2', '2 3', 'NNESEESWNWW' ]
data = data.split(/\r?\n/);

const room_dimensions = data[0].split(' '); //first line/item in the array is the room dimension
room.setRoomDimension(room_dimensions[0], room_dimensions[1]); 

const hoover_init_position = data[1].split(' ') //second line/item in the array is the hoover initial position
hoover.setInitPosition(hoover_init_position[0],hoover_init_position[1]); 

game.movement_directions = data[data.length - 1]; //last line/item in the array is the hoover movement directions

//loop through lines 3 through length-1, to get all the dirt patches added to the room object
for (var i = 2; i < data.length; i++) {

    dirt_patch_position = data[i].split(' ');
    room.addDirtPatches( dirt_patch_position[0], dirt_patch_position[1] );
}

game.runHoover(hoover, room);





