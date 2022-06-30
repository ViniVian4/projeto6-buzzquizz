let titulo = "";
let urlImagem = "";
let qntdPerguntas = 0;
let qntdNiveis = 0;

// GeraTela1();
const tela = document.querySelector(".tela");
GeraTela2(1);


function GeraTela1 () {

    document.querySelector(".tela").innerHTML = 
    `<div class="quizzes-do-usuario"></div>

    <div>
      <div class="container-quizzes">
        <h1>Todos os Quizzes</h1>
        <div class="quizzes todos"></div>   
      </div>
    </div>`;

    GeraUsuario ();
    PostaTodosOsQuizzes ();
}

function PostaTodosOsQuizzes () {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(EscreveTodosOsQuizzes);
}

function EscreveTodosOsQuizzes (promessa) {
    const svTodosOsQuizzes = promessa.data;

    for (let i = 0; i < svTodosOsQuizzes.length; i++)
        document.querySelector(".todos").innerHTML += `<div class="quizz" onclick="GeraTela2(${svTodosOsQuizzes[i].id})"><img src="${svTodosOsQuizzes[i].image}" alt=""><div><h2>${svTodosOsQuizzes[i].title}</h2></div></div>`;
    
}

function GeraUsuario () {
    if (VerificaQuizzesDoUsuario())
        GeraComQuizz();
    else
        GeraSemQuizz();
}

function VerificaQuizzesDoUsuario () {
    if (localStorage.getItem("lista de ids"))
        return true;
    else
        return false;
}

function GeraSemQuizz () {
    document.querySelector(".quizzes-do-usuario").innerHTML =
    `<div class="no-quizzes">
        <p>Você ainda não criou nenhum quiz :(</p>
        <button onclick="GerarTela3()">Criar Quizz</button>
    </div>`;
}

// TELA 2


function GeraTela2(id){

    tela.innerHTML = "";

    let promisseEntrarPerguntas = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`);
    promisseEntrarPerguntas.then(geraTudo2);

}
function geraTudo2(resposta){
    geraBanner(resposta.data.image,resposta.data.title);
    geraPerguntas(resposta.data.questions);
    geraGabarito(resposta.data.questions);

}

function geraBanner(imagem,titulo){

    tela.innerHTML += ` 
    
    <div class="banner ">
    <div class="bannerFundo">
    <img src="${imagem}">
  </div>
    <h1> ${titulo}</h1>
  </div>`
         
}

let arrayRespostas = [],arrayRespostasEmbaralhado, espacoRespostas, ul;
function geraPerguntas(perguntas) {
  for (let i = 0; i < perguntas.length; i++) {

    tela.innerHTML += ` 
    
    <div class="containerPerguntas" >
    <h1  style="background-color:${perguntas[i].color}">> ${perguntas[i].title}</h1>
    <span class="id none">${i} </span> 
    <ul class="todasOpcoes"></ul>
    </div>
    `
    arrayRespostas = [];
    arrayRespostas.push(perguntas[i].answers);
    arrayRespostasEmbaralhado = arrayRespostas[0].sort(comparador);

    ul = document.querySelectorAll("ul");

    for (let i=0; i< arrayRespostasEmbaralhado.length; i++){
        ul[ul.length-1].innerHTML += ` 

        <li class="containerOpcoes" onclick="confereResposta(this)">
        <img src="${arrayRespostasEmbaralhado[i].image}">
        <h2>${arrayRespostasEmbaralhado[i].text}</h2>
        <span class="none">${arrayRespostasEmbaralhado[i].isCorrectAnswer}</span>
        
      </li>
    
     `;
    }
    
  }
  console.log(perguntas);
}

function comparador() { 
	return Math.random() - 0.5; 
}

function mensagemSucesso(){
    console.log("sucesso");
}

// Interação pos clique
let respostas, elementoEscolhido,perguntaDaVez;
function confereResposta(elemento){

    
    if (elementoEscolhido){
        console.log("ja escolheu");
        return;
    }
    perguntaDaVez = elemento.parentNode.parentNode;
    // if (elemento.parentNode)
    selecionado(elemento);
  
   
}

function selecionado(elemento){
    respostas = elemento.parentNode.querySelectorAll("li");
    for (let i=0;i<respostas.length;i++){
        respostas[i].classList.add("naoSelecionado");
    }
    elemento.classList.remove("naoSelecionado");
    elementoEscolhido = elemento;
}



// TELA 3
function GerarTela3 () {
    document.querySelector(".tela").innerHTML = 
    `<div><h1>Comece pelo começo</h1></div>
    <div class="quest-basico">
      <input type="text" placeholder="Título do seu quizz">
      <input type="text" placeholder="URL da imagem do seu quizz">
      <input type="text" placeholder="Quantidade de perguntas do quizz">
      <input type="text" placeholder="Quantidade de níveis do quizz">
    </div>
    <div>
      <button class="botao-para-perguntas" onclick="GeraTelaPerguntas()">
        Prosseguir pra criar perguntas
      </button>
    </div>`;
}

function GeraTelaPerguntas (){
    titulo = GetResposta(0);
    urlImagem = GetResposta(1);
    qntdPerguntas = Number(GetResposta(2));
    qntdNiveis = Number(GetResposta(3));

    const alerta = VerificaValidadeTelaComeco();
    if (alerta)
        alert("Algo deu errado");
    else
        ImprimeTelaPerguntas();
}

function GetResposta (indice){
    let questionario = document.querySelector(".quest-basico");
    questionario = questionario.querySelectorAll("input");
    const resposta = String(questionario[indice].value);
    return resposta;
}

function VerificaValidadeTelaComeco () {
    if (titulo.length < 20 || titulo.length > 65)
        return true;
    try{
        let url = new URL(urlImagem)
    } catch(err){
        return true;
    }
    if (qntdPerguntas < 3)
        return true;
    if (qntdNiveis < 2)
        return true;
    
    return false;    
}
