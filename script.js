//VARIABLES

var object = undefined;

var fs = require("fs");
var text = fs.readFileSync("./list1.txt");

var wonList1 = [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
var wonList2 = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1];
var wonList3 = [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0];

var blockedClick = false;

var time = 0;

//FONCTIONS

$("td").click(function () { //CLIC SUR LES CASES DU TABLEAU
	if (blockedClick != true) { //TRUE UNIQUEMENT SI PARTIE TERMINEE
		if($(this).css("background-color") == "rgb(255, 255, 255)"){ //SI LA CASE EST BLANCHE
			$(this).css("background-color", "rgb(0, 0, 0)"); //DEVIENT NOIRE
			$(this).css("border", "1px solid white"); //PREND UNE BORDURE BLANCHE
			$(this).css("color", "white"); //LE TEXTE DEVIENT BLANC
			$(this).attr("data","1"); //L'ATTRIBUT DATA PREND LA VALEUR 1
		}
		else{ //INVERSE : DEVIENT BLANC, BORDURE NOIRE, TEXTE NOIR, DATA=0
			$(this).css("background-color", "rgb(255, 255, 255)");
			$(this).css("border", "1px solid black");
			$(this).css("color", "black");
			$(this).attr("data","0");
		};
	};
});

$("#buttonNew").click(function () { //CLIC SUR LE BOUTON NOUVEAU
	$("#winP").css("display","none"); //ON CACHE SYSTEMATIQUEMENT LES PARAGRAPHES WIN ET CHECK INCORRECT
	$("#loseP").css("display","none");
	startTimer(); //DEBUTE LE TIMER
	if (object == undefined){
		addTable(random());
	} //SI UN TABLEAU EST DEJA AFFICHE, CACHE LE TABLEAU ACTUEL
	else if (object == "#table1") {
		$(object).css("display","none");
		addTable(randomWithTwoValues(1));
	}
	else if (object == "#table2") {
		$(object).css("display","none");
		addTable(randomWithTwoValues(2));
	}
	else if (object == "#table3") {
		$(object).css("display","none");
		addTable(randomWithTwoValues(3));
	}
	blockedClick = false; //DEBLOQUE LE CLIC AU CAS (BLOQUE EN FIN DE PARTIE)
});

function addTable(randomNumber) { //AFFICHE UN TABLEAU AU HASARD ENTRE LE 1, LE 2 ET LE 3
	object = "#table"+randomNumber;
	reset(object);
	$(object).css("display","block");
};

function random(){ //RENVOIE UN NOMBRE DE 1 A 3
	return Math.floor(Math.random() * (3 - 1 + 1)) + 1;
};

function randomWithTwoValues(excludedValue) { //SI PARAMETRE = 1 RENVOIE AUTRE CHOSE QUE 1 (2 ET 3), IDEM SI PARAMETRE = 2.....
	if (excludedValue == 1) {
		var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
		if (rand == 1) {
			return 2;
		}
		else if (rand == 2) {
			return 3;
		}
	}
	else if (excludedValue == 2) {
		var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
		if (rand == 1) {
			return 1;
		}
		else if (rand == 2) {
			return 3;
		}
	}
	else if (excludedValue == 3) {
		var rand = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
		if (rand == 1) {
			return 1;
		}
		else if (rand == 2) {
			return 2;
		}
	};
};

$("#buttonReset").click(function () { //QUAND LE BOUTON REMETTRE A ZERO EST CLIQUE
	if (blockedClick != true) { //NE FONCTIONNE QUE SI LE CLIC N'EST PAS VERROUILLE (INUTILE DE RESET EN FIN DE PARTIE)
		reset(object);
	};
});

function reset(table) { //REMET TOUTES LES CELLULES DANS LEUR ETAT D'ORIGINE (BLANCHE, TEXTE NOIR, BORDURE NOIRE, DATA=0)
	$(table+" td").css("background-color", "rgb(255, 255, 255)");
	$(table+" td").css("border", "1px solid black");
	$(table+" td").css("color", "black");
	$(table+" td").attr("data","0");
};

$("#rulesHover").hover(function() { //QUAND L'IMAGE REGLES DU JEU SERA SURVOLEE PAR LA SOURIS
    $("#rulesP").fadeIn(); //AFFICHE LE § REGLES
  	}, 
  	function() {
	$("#rulesP").fadeOut(); //MASQUE LE § REGLES
	}
);

$("#buttonCheck").click(function () { //LORSQUE LE BOUTON CHECKER EST APPUYE
	if (blockedClick != true) { //NE FONCTIONNE QUE SI LE CLIC N'EST PAS VERROUILLE (INUTILE DE VERIFIER EN FIN DE PARTIE)
		retrieveData(object);
	};
});

function retrieveData(table) {
	var userList = [];
	for (var i = 0; i < 25; i++) { //BOUCLE SUR TOUTES LES CELLULES EN PRENANT LA VALEUR DE LEUR ATTRIBUT DATA
		userList.push(parseInt($(table+" td").eq(i).attr("data"))); //ET EN L'AJOUTANT A LA LISTE JOUEUR
	};
	if (table == "#table1") {
		if (JSON.stringify(userList) === JSON.stringify(wonList1)) { //VERIFIE SI LA LISTE JOUEUR CORRESPOND A LA LISTE DE VICTOIRE DU TABLEAU
			blockedClick = true; //DANS CE CAS, BLOQUE LE CLIC
			clearInterval(timerId); //ARRETE LE TIMER
			$("#winP").fadeIn(); //AFFICHE LE § WIN
		}
		else { //SI CHECK INCORRECT
			time += 15; //AJOUTE 15 SEC AU TIMER
			$("#loseP").fadeIn(); //AFFICHE LE § DE CHECK INCORRECT
			setTimeout(function(){
    			$("#loseP").fadeOut(); //ET LE MASQUE AU BOUT DE 2 SEC
 			}, 2000);	
		}
	}
	else if (table == "#table2") { //IDEM POUR LES 2 AUTRES TABLEAUX
		if (JSON.stringify(userList) === JSON.stringify(wonList2)) {
			blockedClick = true;
			clearInterval(timerId);
			$("#winP").fadeIn();
		}
		else {
			time += 15;
			$("#loseP").fadeIn();
			setTimeout(function(){
    			$("#loseP").fadeOut();
 			}, 2000);	
		}
	}
	else if (table == "#table3") {
		if (JSON.stringify(userList) === JSON.stringify(wonList3)) {
			blockedClick = true;
			clearInterval(timerId);
			$("#winP").fadeIn();
		}
		else {
			time += 15;
			$("#loseP").fadeIn();
			setTimeout(function(){
    			$("#loseP").fadeOut();
 			}, 2000);	
		}
	}
};

function startTimer() {
	time = 0;
	if (typeof timerId != "undefined") { //ARRETE LE TIMER SI IL EST EN COURS D'EXECUTION
		clearInterval(timerId);
	};
	timerId = setInterval(function timer() { //CREE UN TIMER QUI INCREMENTERA LA VARIABLE TIME DE 1 TOUTES LES SECONDES
		time += 1;
		if (time == 1) {
			var text = "Temps écoulé : "+time.toString()+" seconde";
		}
		else if (time < 60) {
			var text = "Temps écoulé : "+time.toString()+" secondes";
		}
		else if (time == 60) {
			var text = "Temps écoulé : "+Math.trunc(time/60).toString()+" minute "+(time%60).toString()+" seconde";
		}
		else {
			var text = "Temps écoulé : "+Math.trunc(time/60).toString()+" minutes "+(time%60).toString()+" secondes";
		};
		$("#timer").css("display","block"); //AFFICHE LE § TIMER
		$("#timer").html(text); //MODIFIE LE HTML DU § TIMER AVEC LA NOUVELLE VALEUR DE TIME
	},1000);
};