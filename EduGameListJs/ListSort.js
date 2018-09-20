//	0		1		2		3					4							5	6	7		8		9			10									11	12
//["Edu","No","Run Marco!","Programming","Basic Programming (Drag 'n drop)","4+","1","0","Web","RunMarko","https://www.brainpop.com/games/runmarco/",,],


function sortList(a, b) {
//		store the variable used to sort the list in slot 12 so the list can be grouped by that variable
	if(sortVar[0] < 2 || sortVar[0] == 3){//		only type, subject, and rating get grouped. Everything else gets set drawn in a continuous list
		a[11] = a[sortVar[0]];
		b[11] = b[sortVar[0]];
	}else{
		a[11] = 0;
		b[11] = 0;
	}
	for (k = 0; k < 3; k++) {//		loop through the 3 variables to sort by
		//		every function called sets itmp internally
		switch (sortVar[k]) {
			case 0://	type
				itmp = sortByType(a, b);
				break;
			case 1://	rating
				itmp = sortByRating(a, b);
				break;
			case 2://	name
				itmp = a[2].localeCompare(b[2]);
				break;
			case 3://	subject
				itmp = a[3].localeCompare(b[3]);
				break;
			case 5://	age
				itmp = a[5].localeCompare(b[5]);
				break;
			case 6://	length
				itmp = a[6].localeCompare(b[6]);
				break;
			case 7://	price
				itmp = a[7].localeCompare(b[7]);
				break;
			case 8://	format
				itmp = a[8].localeCompare(b[8]);
				break;
		}
		if (itmp != 0)
			return itmp;//		if the compared variable was not the same for both, retun which was greater
	}//		if all three sort variables are the same for a game, sort by Name
	return a[4].localeCompare(b[4]);//		sort by name
}

function sortByType(a, b) {
	itmp = 0;
	switch (a[0]) {//		No just leaves itmp at 0
		case "Edu":
			itmp = -3;
			break;
		case "Sim":
			itmp = -2;
			break;
		case "HW":
			itmp = -1;
			break;
		case "Issue":
			itmp = 1;
			break;
	}
	switch (b[0]) {
		case "Edu":
			itmp += 3;
			break;
		case "Sin":
			itmp += 2;
			break;
		case "HW":
			itmp += 1;
			break;
		case "Issue":
			itmp += -1;
			break;
	}
	return itmp;
}

function sortByRating(a, b) {
	switch (a[1]) {//		No just leaves itmp at 0
		case "YES!":
			itmp = -3;
			break;
		case "Yes":
			itmp = -2;
			break;
		case "Maybe":
			itmp = -1;
			break;
		case "No":
			itmp = 0;
			break;
		default:
			itmp = 1;
			break;
	}
	switch (b[1]) {
		case "YES!":
			itmp += 3;
			break;
		case "Yes":
			itmp += 2;
			break;
		case "Maybe":
			itmp += 1;
			break;
		default:
			itmp += -1;
			break;
	}
	return itmp;
}