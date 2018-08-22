import { Component , ViewChild , AfterViewInit , ElementRef } from '@angular/core';
import { NavController , Platform } from 'ionic-angular';
import { Menu02Page } from '../menu02/menu02';

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
	@ViewChild('name1') name1;
	@ViewChild('name2') name2;
	@ViewChild('cards1') cards1;
	@ViewChild('cards2') cards2;
	@ViewChild('box1') box1;
	@ViewChild('box2') box2;
	@ViewChild('baralho') cartasbaralho;
	@ViewChild('vitoria') victoryimg;
	@ViewChild('derrota') loseimg;
	@ViewChild('sentido') sentidoimg;	
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
	endlock: number = 0;
	forceend: number = 0;
	// criar variaveis que controlam quantas cartas cada jogador tem

	// variaveis de controle ao primeiro jogador
	isfirst: boolean = false;
	players: any[] = [];
	boolplay: boolean = false;
	//

	// variaveis de outras páginas
	usuario: any = sessionStorage.getItem('usuario');
	roomkey: any = 1500000;//sessionStorage.getItem('usuario'); //quando tiver sala aqui seria o id da sala
	roomsize: any = 3;//sessionStorage.getItem('roomsize') qaundo tiver sala
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
		this.endlock = 1;
		var playercards4 = JSON.parse(sessionStorage.getItem((this.usuario + " " + "2")));
		var numhand = playercards4[this.players.indexOf(this.usuario)]
		var victory = true
		let i: number = 0;
		while (i < ((playercards4.length) - 1))
		{
			if (numhand > playercards4[i])
			{
				victory = false
			}
			i = i + 1
		}
		if (victory == true)
		{
			var vitoriasatual = sessionStorage.getItem('vitorias');
			vitoriasatual = vitoriasatual + 1;
			sessionStorage.setItem('vitorias',vitoriasatual);
			this.victoryimg.nativeElement.style.zIndex = 500;
			this.victoryimg.nativeElement.style.opacity = 1;
			this.victoryimg.nativeElement.addEventListener("click",(event: Event) =>{this.jumppage(event);});
		}
		else
		{
			var derrotasatual = sessionStorage.getItem('derrotas');
			derrotasatual = derrotasatual + 1;
			sessionStorage.setItem('derrotas',derrotasatual);
			this.loseimg.nativeElement.style.zIndex = 500;
			this.loseimg.nativeElement.style.opacity = 1;
			this.loseimg.nativeElement.addEventListener("click",(event: Event) =>{this.jumppage(event);});
		}
		this.socket.close()
	}
	jumppage(event)
	{
		this.navCtrl.pop();
	}
	selectshow(event) //não tem código de socket e não tem haver 
	{
		if(this.cardfield.nativeElement.children != null)
		{
			var posX = event.clientX;
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
				var string = '<ion-img class="game_card img-loaded" src="..assets/imgs/'+ htmlstring +'.png ng-reflect-src="..assets/imgs/'+ htmlstring +'.png"><img src="..assets/imgs/'+ htmlstring +'.png" alt=""></ion-img>';
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
		  		that.cartasbaralho.nativeElement.innerHTML = String(JSON.parse(sessionStorage.getItem(that.usuario)).length);
		  		return wait(that,(cont));
		  	}
		  	else
		  	{
		  		that.boolsortlock = false;
		  		that.cartasbaralho.nativeElement.innerHTML = String(JSON.parse(sessionStorage.getItem(that.usuario)).length);
		  		return 0;
		  	}
		}
		var cont = times;
		if ((this.booldrawlock == false && this.boolplay == true)|| (skip == true) || (this.forceend == 1 && times == 2 && this.boolplay == false))
		{
			this.boolsortlock = true;
			this.booldrawlock = true;
			if (skip == false)
			{
				var deck = JSON.parse(sessionStorage.getItem(this.usuario));
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
		that.screenwidth = (that.cardfield.nativeElement.offsetWidth);
		var currentzindex = 0;
		var locationsum = ((that.screenwidth - 100)/(that.numcards + 1)); 
		var currentsum = locationsum + 50; //curentsum minumum value = 100
		var cartaadd = null;
		if (that.boolsortlock == false && that.boolsortlock2 == false)
		{
			that.cardfield.nativeElement.innerHTML = "";
			for (var h = 0; h < that.hand.length; h++)  //trocar isso
			{
				cartaadd = that.hand[h];
				var htmlstring = ((cartaadd.number).toString(10)) + cartaadd.color;
				var string = '<ion-img class="game_card img-loaded" src="..assets/imgs/'+ htmlstring +'.png ng-reflect-src="..assets/imgs/'+ htmlstring +'.png"><img src="..assets/imgs/'+ htmlstring +'.png" alt=""></ion-img>';
				that.cardfield.nativeElement.insertAdjacentHTML('beforeend', string);
				that.cardfield.nativeElement.children[h].addEventListener("click",(event: Event) =>{that.selectshow(event);});
				that.cardfield.nativeElement.children[h].style.left = ((currentsum - 50).toString(10)) + "px";
				that.cardfield.nativeElement.children[h].style.zIndex = h;
				currentsum = currentsum + locationsum;
			}
			let i: number = 0;
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

			//while (cont<=hand.length+1){
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
	    var text = this.cardfield.nativeElement.children[cardtoremove].innerHTML.replace('<img src="..assets/imgs/',"");
	    text = text.replace('.png" alt="">',"");
	    var length = text.length;
	    var numberlist = ["0","1","2","3","4","5","6","7","8","9"];
	    var special = numberlist.indexOf(text[1]);
	    if (special < 0)
	    {
		    var numbercard = text[0];
		    var colorcard = text.slice(1,length);
	    }
	    else
	    {
	    	var numbercard = text[0] + text[1];
		    var colorcard = text.slice(2,length);
	    }
	    this.cardtoplay = { "number" : numbercard , "color": colorcard };
		if (((this.cardtoplay.number == this.currentcard.number) || (this.cardtoplay.color == this.currentcard.color)) && this.boolplay == true && this.forceend == 0)
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
		  	if (this.hand.length > 0)
		  	{
			  	this.socket.send(JSON.stringify({"end":0,"action" :"play","user":this.usuario,"card": this.cardtoplay,"key":this.roomkey,"roomsize":this.roomsize}));
			  	this.boolplay = false;
			  	this.currentplayernumber(this);
			}
			else
			{
				this.socket.send(JSON.stringify({"end":1,"action" :"play","user":this.usuario,"card": this.cardtoplay,"key":this.roomkey,"roomsize":this.roomsize}));
				this.booldrawlock = true;
				this.boolsortlock = true;
				this.boolsortlock2 = true;
				this.boolplay = false;
				this.endgame(event);
			}
		}
	}
	playcard() //não tem código de socket, utilizado para atualizar a carta que está em jogo(não precisa alterações..?)
	{
		this.currentfield.nativeElement.innerHTML = ""; 
		this.currentcard = this.cardtoplay;
		var htmlstring = ((this.cardtoplay.number).toString(10)) + this.cardtoplay.color;
		var string = '<ion-img class="game_card img-loaded" src="..assets/imgs/'+ htmlstring +'.png ng-reflect-src="..assets/imgs/'+ htmlstring +'.png"><img src="..assets/imgs/'+ htmlstring +'.png" alt=""></ion-img>';
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
		if ((this.boolplay == true && this.booldrawlock == true) || this.forceend == 1)
		{
			this.boolplay = false;
			this.booldrawlock = true;
			this.forceend = 0;
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
		console.log("Hello");
	}
	currentplayernumber(that)
	{
		//código de num de cartas na mão do player
		var playernum = that.players.indexOf(that.usuario);
		if (playernum == 0)
		{
			var text3 = String(JSON.parse(sessionStorage.getItem((that.usuario + " " + "2")))[1]);
			that.cards1.nativeElement.innerHTML = text3;
			var text4 = String(JSON.parse(sessionStorage.getItem((that.usuario + " " + "2")))[2]);
			that.cards2.nativeElement.innerHTML = text4;
		}
		else if (playernum == 1)
		{
			var text3 = String(JSON.parse(sessionStorage.getItem((that.usuario + " " + "2")))[0]);
			that.cards2.nativeElement.innerHTML = text3;
			var text4 = String(JSON.parse(sessionStorage.getItem((that.usuario + " " + "2")))[2]);
			that.cards1.nativeElement.innerHTML = text4;
		}
		else
		{
			var text3 = String(JSON.parse(sessionStorage.getItem((that.usuario + " " + "2")))[0]);
			that.cards1.nativeElement.innerHTML = text3;
			var text4 = String(JSON.parse(sessionStorage.getItem((that.usuario + " " + "2")))[1]);
			that.cards2.nativeElement.innerHTML = text4;
		}
	}
	currentplayercolor(that)
	{

		//código de brilhar
		var playernum = that.players.indexOf(that.usuario);
		if (that.currentplayer == playernum)
		{
			that.box1.nativeElement.style['background-color'] = "red";
			that.box2.nativeElement.style['background-color']  = "red"; 
		}
		else
		{
			if (playernum == 0)
			{
				if (that.currentplayer == 1)
				{
					that.box1.nativeElement.style['background-color'] = "green";
					that.box2.nativeElement.style['background-color']  = "red"; 
				}
				else
				{
					that.box1.nativeElement.style['background-color'] = "red"; 
					that.box2.nativeElement.style['background-color']  = "green";
				}
			}
			else if (playernum == 1)
			{
				if (that.currentplayer == 0)
				{
					that.box2.nativeElement.style['background-color'] = "green";
					that.box1.nativeElement.style['background-color']  = "red";
				}
				else
				{
					that.box2.nativeElement.style['background-color'] = "red"; 
					that.box1.nativeElement.style['background-color']  = "green";
				}
			}
			else
			{
				if (that.currentplayer == 1)
				{
					that.box1.nativeElement.style['background-color'] = "red";
					that.box2.nativeElement.style['background-color']  = "green"; 
				}
				else
				{
					that.box1.nativeElement.style['background-color'] = "green"; 
					that.box2.nativeElement.style['background-color']  = "red";
				}
			}
		}
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
			if(that.boolplay == false && !((that.players[that.currentplayer] == that.usuario) && that.forceend == 1))
			{
				//mandar voto pro servidor dizendo que o turno do cara acabou
				console.log("Código de votadores...")
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
				//console.log('Width: ' + platform.width());
			 	//console.log('Height: ' + platform.height());
			 	this.socket = new WebSocket('ws://10.10.17.182:8342');
			 	const socketplace = this.socket;
			 	function requirestart(event,that)
				{
				    socketplace.send(JSON.stringify({"action" :"start","user":that.usuario,"roomsize":that.roomsize}));
				};
				function getdata(event,that)
				{
					var action = JSON.parse(event.data);
					if (that.endlock == 0)
					{
						if (action.start == 0)
						{
							that.roomkey = action.key;
							that.boolsortlock = true;
							if (action.first == that.usuario)
							{
								that.isfirst = true;
								//montar deck
								var deck = [];
								var colors = ["red","blue","green","yellow"];
								var numbers = [0,1,2,3,4,5,6,7,8,9,10,11,12];
								for (var i = 0; i < colors.length; i++) 
								{
									for (var k = 0; k < numbers.length; k++)
									{
										var colorr = colors[i];
										var numberr = numbers[k];
										deck.push({"number" : numberr, "color" : colorr});
									}	
								}
							    for (let h = deck.length - 1; h > 0; h--) 
							    {
							        const j = Math.floor(Math.random() * (h + 1));
							        [deck[h], deck[j]] = [deck[j], deck[h]];
							    }
								sessionStorage.setItem(that.usuario, JSON.stringify(deck));
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
							//código dos nomes dos players
							that.players = action.players;
							var playernum = that.players.indexOf(that.usuario);
							if (playernum == 0)
							{
								var text1 = that.players[1].substring(0, 6);
								that.name1.nativeElement.innerHTML = text1;
								var text2 = that.players[2].substring(0, 6);
								that.name2.nativeElement.innerHTML = text2;
							}
							else if (playernum == 1)
							{
								var text1 = that.players[0].substring(0, 6);
								that.name2.nativeElement.innerHTML = text1;
								var text2 = that.players[2].substring(0, 6);
								that.name1.nativeElement.innerHTML = text2;
							}
							else
							{
								var text1 = that.players[0].substring(0, 6);
								that.name1.nativeElement.innerHTML = text1;
								var text2 = that.players[1].substring(0, 6);
								that.name2.nativeElement.innerHTML = text2
							}
							//
							if (that.isfirst == false)
							{
								sessionStorage.setItem(that.usuario, JSON.stringify(action.deck));
							}
							var deck2 = JSON.parse(sessionStorage.getItem(that.usuario));
							that.cardtoplay = deck2.pop();
							that.playcard();
							that.currentplayer = 0;
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
							sessionStorage.setItem((that.usuario + " " + "2"), JSON.stringify(playercards));
							if (that.players[0] == that.usuario)
							{
								that.boolplay = true;
								that.booldrawlock = false;
								that.boolsortlock = false;
							}
							that.startcountdown();
							that.cartasbaralho.nativeElement.innerHTML = String(JSON.parse(sessionStorage.getItem(that.usuario)).length);
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
									var playercards2 = JSON.parse(sessionStorage.getItem((that.usuario + " " + "2")));
									playercards2[that.currentplayer] = playercards2[that.currentplayer] + action.draw;
									sessionStorage.setItem((that.usuario + " " + "2"), JSON.stringify(playercards2));
								}
								if (action.play == 1)
								{
									that.cardtoplay = action.card;
									that.playcard();
									var playercards3 = JSON.parse(sessionStorage.getItem((that.usuario + " " + "2")));
									playercards3[that.currentplayer] = playercards3[that.currentplayer] - 1;
									sessionStorage.setItem((that.usuario + " " + "2"), JSON.stringify(playercards3));
									if ((action.card.color == "black") || (action.card.number > 9))
									{
										if (action.card.number != 12)
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
											if (action.card.number == 10 && (that.players[that.currentplayer] == that.usuario))//+2
											{
												that.forceend = 1;
												that.boolplay = false; //pode dar erro
												that.booldrawlock = true; //pode dar erro
												that.drawcard(2,false);
											}
											else if (action.card.number == 11 && (that.players[that.currentplayer] == that.usuario))//block
											{
												that.forceend = 1;
												that.boolplay = false; //pode dar erro
												that.booldrawlock = true; //pode dar erro
												//auto pass turn, make a bool variable for skip?
											}
										}
										else//invert
										{
											that.order = that.order * (-1);
											that.sentidoimg.nativeElement.style['-moz-transform'] = "scaleX(" + String(that.order) + ")";
											that.sentidoimg.nativeElement.style['-o-transform'] = "scaleX(" + String(that.order) + ")";
											that.sentidoimg.nativeElement.style['-webkit-transform'] = "scaleX(" + String(that.order) + ")";
											that.sentidoimg.nativeElement.style['transform'] = "scaleX(" + String(that.order) + ")";
											that.currentplayer = that.currentplayer + 1 * (that.order);
											while (that.currentplayer >= that.players.length)
											{
												that.currentplayer = that.currentplayer - that.roomsize;
											}
											while (that.currentplayer < 0)
											{
												that.currentplayer = that.currentplayer + that.roomsize;
											}
										}
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
									}
									if ((that.players[that.currentplayer] == that.usuario)&& that.forceend == 0)
									{
										that.boolplay = true;
										that.booldrawlock = false;
									}
									else
									{
										that.boolplay = false; //pode dar erro
										that.booldrawlock = true; //pode dar erro
									}
									that.startcountdown();
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
							that.cartasbaralho.nativeElement.innerHTML = String(JSON.parse(sessionStorage.getItem(that.usuario)).length);
						};
						if (action.start != 0)
						{
							that.currentplayernumber(that);
							that.currentplayercolor(that);
						}
					};
					
				};
				this.socket.addEventListener('open', (event: Event) => {requirestart(event,this)});
				this.socket.addEventListener('message', (event: Event) => {getdata(event,this)});
	}
}