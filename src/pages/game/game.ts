import { Component , ViewChild , AfterViewInit , ElementRef } from '@angular/core';
import { NavController , Platform } from 'ionic-angular';
import { Menu02Page } from '../Menu02/Menu02';

@Component({
  selector: 'game',
  templateUrl: 'game.html'
})
export class  game 
{
	@ViewChild('currentcolor') currentcolor ;
	@ViewChild('content') ioncontent ;
	@ViewChild('select') selectfield ;
	@ViewChild('cards', {read: ElementRef}) cardfield: ElementRef;
	@ViewChild('current') currentfield ;
	@ViewChild('time') countdowntime ;
	
	// variaveis ainda não separadas
	screenwidth: number = 0;
	numcards: number = 0;
  	numcardsselect: number = 0;
	hand: any[] = [];
	selectcards: any[] = [];
	cardtoadd: any = null;
	socket: any = null;
	cardtoplay: any = null;
	currentcard: any = null;
	// 

	//variaveis de controle do meio do jogo
	currentplayer: number = 0;
	order: number = 1;
	booldrawlock: boolean = false;
	playerscards: any[] = [];
	countertime: number = 0;
	timerid: any = null;
	boolsortlock: boolean = false;
	boolsortlock2: boolean = true;
	// criar variaveis que controlam quantas cartas cada jogador tem

	// variaveis de controle ao primeiro jogador
	isfirst: boolean = false;
	players: any[] = [];
	boolplay: boolean = false;
	//

	// variaveis de outras páginas
	usuario: any = sessionStorage.getItem('usuario');
	roomkey: any = "okdlwo.d";//sessionStorage.getItem('usuario'); //quando tiver sala aqui seria o id da sala
	roomsize: any = 2;//sessionStorage.getItem('roomsize') qaundo tiver sala
	//
	constructor(public navCtrl: NavController, platform:Platform,) 
	{
		/*variable declarations and start-up*/ 
		//setInterval(()=>{this.displaytext();},2000);
		platform.ready().then((readySource)=> 
		{});
	}
	endgame(event) //código para acabar o jogo
	{
		var playercards4 = JSON.parse(sessionStorage.getItem('playercards'));
		var numhand = playercards4[this.players.indexOf(this.usuario)]
		var victory = true
		let i: number = 0;
		while (i < ((playercards4.length) - 1))
		{
			if (numhand < playercards4[i])
			{
				victory = false
			}
			i = i + 1
		}
		if (victory == true)
		{
			console.log("Player ganhou, mandar mensagem pro banco.")
		}	
		this.socket.close()
		console.log("Figura na frente da tela que ao clicar vai para jumppage.")
	}
	jumppage(event)
	{
		this.navCtrl.push(Menu02Page);
	}
	selectshow(event) //não tem código de socket e não tem haver 
	{
		if(this.cardfield.nativeElement.children != null)
		{
			var posX = event.clientX;
			console.log(this.boolplay);
			console.log(this.usuario);
			this.screenwidth = (this.cardfield.nativeElement.offsetWidth);
			this.selectfield.nativeElement.innerHTML = ""; //clears selectfield
			var locationsum = ((this.screenwidth - 100)/(this.numcards + 1));
			var currentsum = locationsum + 50;
			let i: number = 0;
			this.selectcards = [];
			var locationcard;
			this.numcardsselect = 0;
			while (i < (this.numcards))
			{
				locationcard = currentsum - 50 + 15; //15 margin/padding?
				if ((posX >= (locationcard - 5)) && (posX <= (locationcard + 100 + 5)))
				{
					this.selectcards.push(i);
					this.numcardsselect = this.numcardsselect + 1;
				}
				currentsum = currentsum + locationsum;
				i= i+1;
	  		}
			var locationsum = ((this.screenwidth - 100)/(this.numcardsselect + 1));
			var currentsum = locationsum + 50;
			i = 0;
			while (i < this.numcardsselect)
			{
		  		var string =  String(this.cardfield.nativeElement.children[this.selectcards[i]].outerHTML);
		  		this.selectfield.nativeElement.insertAdjacentHTML('beforeend', string);
		  		this.selectfield.nativeElement.children[i].addEventListener("click",(event: Event) =>{this.removecard(event);});
		  		// swipe up gesture
		  		this.selectfield.nativeElement.children[i].style.left = ((currentsum - 50).toString(10)) + "px";
		  		this.selectfield.nativeElement.children[i].style.zIndex = i;
		  		currentsum = currentsum + locationsum;
		  		i = i + 1;
	  		}
	  	}
  	}
	drawcard(times,skip,event) //por enquanto tem código de socket só no final, mudar para o começo?
	{
		function wait(that,times)
		{
			that.screenwidth = (that.cardfield.nativeElement.offsetWidth);
			that.numcards = that.numcards + 1;
			var currentzindex = 0;
			var locationsum = ((that.screenwidth - 100)/(that.numcards + 1)); 
			var currentsum = locationsum + 50; //curentsum minumum value = 100
			var deck = JSON.parse(sessionStorage.getItem(that.usuario));
			if (deck.length>0)
			{
			    var cartaadd = deck.pop();
				that.hand.push(cartaadd);
				var htmlstring = ((cartaadd.number).toString(10)) + cartaadd.color;
				sessionStorage.setItem(that.usuario, JSON.stringify(deck));
				var string = '<ion-img class="game_card img-loaded" src="../assets/imgs/'+ htmlstring +'.png ng-reflect-src="../assets/imgs/'+ htmlstring +'.png"><img src="../assets/imgs/'+ htmlstring +'.png" alt=""></ion-img>';
				that.cardfield.nativeElement.insertAdjacentHTML('beforeend', string);
				//creates an html element in the end of children list
				that.cardfield.nativeElement.children[that.numcards - 1].addEventListener("click",(event: Event) =>{that.selectshow(event);});
				//add a valid click event that calls a function
				let i: number = 0;
				while(i < (that.numcards))
				{ // also works -> var cards = this.cardfield.nativeElement.querySelectorAll('.card')
					that.cardfield.nativeElement.children[i].style.left = ((currentsum - 50).toString(10)) + "px";
					that.cardfield.nativeElement.children[i].style.zIndex = i;
					currentsum = currentsum + locationsum;
					i = i + 1;
			  	}
		  	}
		  	var cont = times - 1;
		  	if (cont > 0)
		  	{
		  		return wait(that,(cont));
		  	}
		  	else
		  	{
		  		that.boolsortlock = false;
		  		return 0;
		  	}
		}
		var cont = times;
		if ((this.booldrawlock == false && this.boolplay == true)|| (skip == true))
		{
			this.boolsortlock = true;
			this.booldrawlock = true;
			if (skip == false)
			{
				var deck = JSON.parse(sessionStorage.getItem(this.usuario));
				console.log(deck.length);
				console.log(deck);
				if (deck.length>0)
				{
					this.socket.send(JSON.stringify({"end":0,"action": "draw" ,"key": this.roomkey,"roomsize":this.roomsize, "user": this.usuario,"num": times}));
				}
				else
				{
					this.socket.send(JSON.stringify({"end":1,"action": "draw" ,"key": this.roomkey,"roomsize":this.roomsize, "user": this.usuario,"num": times}));
					this.booldrawlock = true;
					this.boolsortlock = true;
					this.boolsortlock2 = true;
					this.boolplay = false;
					this.endgame(event);
				}
			}
			wait(this,(cont));//sets the context
		}
	}
	updatecards(event,that) //código para dar um refresh na ordem que o hand está
	{
		console.log("Sorting...");
		that.screenwidth = (that.cardfield.nativeElement.offsetWidth);
		var currentzindex = 0;
		var locationsum = ((that.screenwidth - 100)/(that.numcards + 1)); 
		var currentsum = locationsum + 50; //curentsum minumum value = 100
		var cartaadd = null;
		if (that.boolsortlock == false && that.boolsortlock2 == false)
		{
			that.cardfield.nativeElement.innerHTML = "";
			console.log(that.hand);
			for (var h = 0; h < that.hand.length; h++)  //trocar isso
			{
				cartaadd = that.hand[h];
				var htmlstring = ((cartaadd.number).toString(10)) + cartaadd.color;
				var string = '<ion-img class="game_card img-loaded" src="../assets/imgs/'+ htmlstring +'.png ng-reflect-src="../assets/imgs/'+ htmlstring +'.png"><img src="../assets/imgs/'+ htmlstring +'.png" alt=""></ion-img>';
				that.cardfield.nativeElement.insertAdjacentHTML('beforeend', string);
				that.cardfield.nativeElement.children[h].addEventListener("click",(event: Event) =>{that.selectshow(event);});
				that.cardfield.nativeElement.children[h].style.left = ((currentsum - 50).toString(10)) + "px";
				that.cardfield.nativeElement.children[h].style.zIndex = h;
				currentsum = currentsum + locationsum;
			}
			let i: number = 0;
			console.log(that.cardfield.nativeElement.children.length)
			while(i < (that.numcards))
			{ // also works -> var cards = that.ca
				//that.cardfield.nativeElement.children[i].style.left = ((currentsum - 50).toString(10)) + "px";
				//that.cardfield.nativeElement.children[i].style.zIndex = i;
				//currentsum = currentsum + locationsum;
				i = i + 1;
		  	}
		}	
	}
	sortcards(event)
	{
		var checkbool = false
		if (this.boolsortlock == false && this.boolsortlock2 == false)
		{
			if(this.cardfield.nativeElement.children != null)
			{
				checkbool = true
			}
		}
		if (checkbool == true)
		{
			var cont=0;
			var MAIOR=0;
			var handlength = this.hand.length;
			while (cont<handlength){
				if (MAIOR<this.hand[cont].number){
					MAIOR=this.hand[cont].number;
				}
				cont+=1;
			}
			var contadores=[];
			for (var i =  0; i <= MAIOR; i++) 
			{
				contadores.push(0);
			}
			cont=0;
			while (cont<handlength){
				contadores[this.hand[cont].number]+=1
				cont+=1;
			}	
			var ordenado = [];
			cont=0;
			var cont2;
			var x;

			//while (cont<=handlength+1){
			//	cont2=0;
			//	while (cont2<contadores[cont]){
			//		ordenado.push(cont);
			//		cont2+=1;
			//	}
			//	cont+=1;
			//} fred errou alguma coisa aqui pq no android da bug ?!?

			while (cont < contadores.length)
			{
				while (contadores[cont] > 0)
				{
					ordenado.push(cont);
					contadores[cont] = contadores[cont] - 1;
				}
				cont = cont + 1;
			}

			cont=0;
			console.log(ordenado)
			var LISTA=[];
			var numeropass=this.hand.length;
			while(cont<numeropass){
				var percorre=0;
				while (percorre<this.hand.length){
					if (this.hand[percorre].number==ordenado[cont]){
						LISTA.push(this.hand[percorre]);
						this.hand.splice(percorre, 1);
						break;
					}
					percorre+=1;
				}
				cont+=1;
			}
			this.hand = LISTA;
			console.log(LISTA);
			this.updatecards(event,this);
		}
	}
	removecard(event)//tem código de socket no final, mudar um pouco
	{
    	//branch to different code when used cardfield or change this.numcardsselect 
		var posX = event.clientX;
		this.screenwidth = (this.cardfield.nativeElement.offsetWidth);
		var locationsum = ((this.screenwidth - 100)/((this.selectcards).length + 1));
		var currentsum = locationsum + 50;
		let i: number = 0;
		var locationcard;
		var numcardsselect = 0;
		var cardtoremove;
		while (i < (this.numcardsselect))
		{
			locationcard = currentsum - 50;
			if ((posX >= (locationcard - 5)) && (posX <= (locationcard + 100 + 5))) //get card to remove
			{
				cardtoremove = this.selectcards[i]; //make it continue so it stops on the one with the highest z-axis
			}
			currentsum = currentsum + locationsum;
			i= i+1;
		}
	    var text = this.cardfield.nativeElement.children[cardtoremove].innerHTML.replace('<img src="../assets/imgs/',"");
	    text = text.replace('.png" alt="">',"");
	    var length = text.length;
	    var numbercard = text[0];
	    var colorcard = text.slice(1,length);
	    this.cardtoplay = { "number" : numbercard , "color": colorcard };
		if (((this.cardtoplay.number == this.currentcard.number) || (this.cardtoplay.color == this.currentcard.color)) && this.boolplay == true)
		{
			this.selectfield.nativeElement.innerHTML = ""; //clears selectfield
		    this.selectcards = []; // both of these lines also in the boolreturn == "False" code
			var currentzindex = 0;
			this.numcards = this.numcards -1;
			var locationsum = ((this.screenwidth - 100)/(this.numcards + 1)); 
			var currentsum = locationsum + 50; //curentsum minumum value = 50
			this.cardfield.nativeElement.children[cardtoremove].remove();
			this.hand.splice(cardtoremove, 1); // CÓDIGO DE UPDATE USA, OLHAR CASO ERRO 
			i = 0;
			while(i < (this.numcards))
			{ 
				this.cardfield.nativeElement.children[i].style.left = ((currentsum - 50).toString(10)) + "px";
				this.cardfield.nativeElement.children[i].style.zIndex = i;
				currentsum = currentsum + locationsum;
				i = i + 1;
		  	}
		  	this.socket.send(JSON.stringify({"action" :"play","user":this.usuario,"card": this.cardtoplay,"key":this.roomkey,"roomsize":this.roomsize}));
		  	this.boolplay = false;
		}
	}
	playcard() //não tem código de socket, utilizado para atualizar a carta que está em jogo(não precisa alterações..?)
	{
		this.currentfield.nativeElement.innerHTML = ""; 
		this.currentcard = this.cardtoplay;
		var htmlstring = ((this.cardtoplay.number).toString(10)) + this.cardtoplay.color;
		var string = '<ion-img class="game_card img-loaded" src="../assets/imgs/'+ htmlstring +'.png ng-reflect-src="../assets/imgs/'+ htmlstring +'.png"><img src="../assets/imgs/'+ htmlstring +'.png" alt=""></ion-img>';
		this.currentfield.nativeElement.insertAdjacentHTML('beforeend', string);
		this.screenwidth = (this.currentfield.nativeElement.offsetWidth);
		var locationsum = ((this.screenwidth - 100)/(2));
		var currentsum = locationsum + 50;
		this.currentfield.nativeElement.children[0].style.left = ((currentsum - 50).toString(10)) + "px";
		this.currentfield.nativeElement.children[0].style.zIndex = 0;
		this.cardtoplay = null;
	}
	passturn(event)
	{
		if (this.boolplay == true && this.booldrawlock == true)
		{
			this.boolplay = false;
			this.booldrawlock = true;
			var deck = JSON.parse(sessionStorage.getItem(this.usuario));
			if (deck.length>0)
			{
				this.socket.send(JSON.stringify({"end":0,"action" : "pass","user":this.usuario,"key":this.roomkey,"roomsize":this.roomsize}));
			}
			else
			{
				this.socket.send(JSON.stringify({"end":1,"action" : "pass","user":this.usuario,"key":this.roomkey,"roomsize":this.roomsize}));
				this.booldrawlock = true;
				this.boolsortlock = true;
				this.boolsortlock2 = true;
				this.boolplay = false;
				this.endgame(event);
			}
		}
	}
	displaytext() //função comentada lá em cima, util caso precise dar um log em cada segundo
	{
		console.log(this.currentcolor.nativeElement.firstChild.data);
		console.log(this.ioncontent._elementRef.nativeElement.className);
		console.log(this.ioncontent._elementRef.nativeElement.style.backgroundColor);
	}
	timecountdown(that) 
	{
		that.countertime= that.countertime - 1;
	    if (that.countdowntime != undefined)
	    {
	    	that.countdowntime.nativeElement.innerHTML = "Time :" + String(that.countertime);
		}
		if(that.countertime <= 1 || that.countertime > 14)
		{
			that.boolsortlock2 = true;
		}
		else
		{
			that.boolsortlock2 = false;
		}
		if (that.countertime > 0)
		{
			that.timerid = setTimeout(that.timecountdown, 1000,that);
		}
		else
		{
			if(that.boolplay == false)
			{
				//mandar voto pro servidor dizendo que o turno do cara acabou
				console.log("Editar aqui caso queira mais proteção..")
			}
			else
			{
				that.drawcard(1,false);
				that.passturn();
			}
		}
	}
	startcountdown()
	{
		if (this.timerid != null)
		{
			clearTimeout(this.timerid);
		}
		this.countertime = 15;
		this.countdowntime.nativeElement.innerHTML = "Time :" + String(this.countertime);
		this.timerid = setTimeout(this.timecountdown, 1000,this);
	}
	ionViewDidEnter() //util caso queira fazer algo logo depois da página carregar por inteiro
	{
				this.screenwidth = 0;
				this.numcards = 0;
				console.log(this.usuario)
				console.log(this.ioncontent); 
				//console.log('Width: ' + platform.width());
			 	//console.log('Height: ' + platform.height());
			 	this.socket = new WebSocket('ws://localhost:8342');
			 	const socketplace = this.socket;
			 	console.log(socketplace);
			 	function requirestart(event,that)
				{
				    socketplace.send(JSON.stringify({"action" :"start","user":that.usuario,"key":that.roomkey,"roomsize":that.roomsize}));
				};
				function getdata(event,that)
				{
					var action = JSON.parse(event.data);
					console.log(action);
					if (action.start == 0)
					{
						that.boolsortlock = true;
						if (action.first == that.usuario)
						{
							that.isfirst = true;
							//montar deck
							var deck = [];
							var colors = ["red","blue","green","yellow"];
							var numbers = [0,1,2,3,4,5,6,7,8,9];
							for (var i = 0; i < colors.length; i++) 
							{
								for (var k = 0; k < numbers.length; k++)
								{
									var colorr = colors[i];
									var numberr = numbers[k];
									deck.push({"number" : numberr, "color" : colorr});
								}	
							}
							sessionStorage.setItem(that.usuario, JSON.stringify(deck));
							//random.shuffle.deck
						}
						if (that.isfirst == true)
						{
							that.players.push(action.user)
						}
						if ((that.players.length == that.roomsize)&&(that.isfirst == true))
						{
							var datasend = JSON.parse(sessionStorage.getItem(that.usuario));
							socketplace.send(JSON.stringify({"action" :"echostart","deck": datasend,"players":that.players,"user":that.usuario,"key":that.roomkey,"roomsize":that.roomsize}));
						}
					};
					if (action.start == 1)
					{
						if (that.isfirst == false)
						{
							sessionStorage.setItem(that.usuario, JSON.stringify(action.deck));
						}
						var deck2 = JSON.parse(sessionStorage.getItem(that.usuario));
						that.cardtoplay = deck2.pop();
						that.playcard();
						that.players = action.players;
						that.currentplayer = 0;
						var playernum = that.players.indexOf(that.usuario);
						var cont0 = 0;
						if (playernum == 0)
						{
							var todraw = deck2.slice(-7);
							deck2.splice(-7,7);
							for (var i = 0;i<(7 * (that.players.length - 1));i++)
							{
								deck2.pop();
							}
							deck2 = deck2.concat(todraw);
						}
						else if (playernum == 1)
						{
							var todraw = deck2.slice(-14,-7);
							deck2.splice(-14,7);
							for (var i = 0;i<(7 * (that.players.length - 1));i++)
							{
								deck2.pop();
							}
							deck2 = deck2.concat(todraw);
						}
						else if (playernum == 2)
						{
							var todraw = deck2.slice(-21,-14);
							deck2.splice(-21,7);
							for (var i = 0;i<(7 * (that.players.length - 1));i++)
							{
								deck2.pop();
							}
							deck2 = deck2.concat(todraw);
						}
						else if (playernum == 3)
						{
							var todraw = deck2.slice(-28,-21);
							deck2.splice(-28,7);
							for (var i = 0;i<(7 * (that.players.length - 1));i++)
							{
								deck2.pop();
							}
							deck2 = deck2.concat(todraw);
						}
						sessionStorage.setItem(that.usuario, JSON.stringify(deck2));
						that.drawcard(7,true);
						var cont1 = 0;
						var playercards = [];
						while (cont1 < that.roomsize)
						{
							playercards.push(7);
							cont1 = cont1 + 1
						}
						sessionStorage.setItem('playercards', JSON.stringify(playercards));
						if (that.players[0] == that.usuario)
						{
							that.boolplay = true;
							that.booldrawlock = false;
							that.boolsortlock = false;
						}
						that.startcountdown();
					};
					if (action.start == 2)
					{
						if (action.end == 0)
						{
							if (action.pass == 1)
							{
								that.currentplayer = that.currentplayer + 1 * (that.order);
								while (that.currentplayer >= that.players.length)
								{
									that.currentplayer = that.currentplayer - that.roomsize;
								}
								while (that.currentplayer < 0)
								{
									that.currentplayer = that.currentplayer + that.roomsize;
								}
								if (that.players[that.currentplayer] == that.usuario)
								{
									that.boolplay = true;
									that.booldrawlock = false;
								}
								that.startcountdown();
							}
							if (action.draw > 0)
							{
								var cont1 = 0;
								var deck3 = JSON.parse(sessionStorage.getItem(that.usuario));
								var usuariotemp = that.usuario;
								while ((cont1 < action.draw)&&(action.player != that.usuario))
								{
									deck3.pop(); //tira a carta de cima... ultima carta?
									cont1 = cont1 + 1
								}
								sessionStorage.setItem(usuariotemp, JSON.stringify(deck3));
								var playercards2 = JSON.parse(sessionStorage.getItem('playercards'));
								playercards2[that.currentplayer] = playercards2[that.currentplayer] + action.draw;
								sessionStorage.setItem('playercards', JSON.stringify(playercards2));
							}
							if (action.play == 1)
							{
								that.cardtoplay = action.card;
								that.playcard();
								var playercards3 = JSON.parse(sessionStorage.getItem('playercards'));
								playercards3[that.currentplayer] = playercards3[that.currentplayer] - 1;
								sessionStorage.setItem('playercards', JSON.stringify(playercards3));
								if ((action.card.color == "black") || (action.card.number > 9))
								{
									console.log("código de cartas especiais");
								}
								else
								{
									that.currentplayer = that.currentplayer + 1 * (that.order);
									while (that.currentplayer >= that.players.length)
									{
										that.currentplayer = that.currentplayer - that.roomsize;
									}
									while (that.currentplayer < 0)
									{
										that.currentplayer = that.currentplayer + that.roomsize;
									}
									if (that.players[that.currentplayer] == that.usuario)
									{
										that.boolplay = true;
										that.booldrawlock = false;
									}
									that.startcountdown();
								}
							}
						}
						else
						{
							that.booldrawlock = true;
							that.boolsortlock = true;
							that.boolsortlock2 = true;
							that.boolplay = false;
							that.endgame(event);
						}
					};
				};
				this.socket.addEventListener('open', (event: Event) => {requirestart(event,this)});
				this.socket.addEventListener('message', (event: Event) => {getdata(event,this)});
	}
}