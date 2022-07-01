const tela = document.querySelector(".tela");
let qntdPerguntas = 0;
let qntdNiveis = 0;
let existeResposta = [false, false, false];
let prototipoQuizzCriado = {
    title: "",
    image: "",
    questions: []
};

GeraTela1();



function GeraTela1 () {

    tela.innerHTML = 
    `<div class="quizzes-do-usuario"></div>
    <br>
    <br>

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
let id = 1;
function GeraTela2(id){

    tela.innerHTML = "";

    let promisseEntrarPerguntas = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`);
    promisseEntrarPerguntas.then(geraTudo2);

}
function geraTudo2(resposta){
    geraBanner(resposta.data.image,resposta.data.title);
    geraPerguntas(resposta.data.questions);
    console.log(resposta.data);

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
    <ul class="todasOpcoes"></ul>
    </div>
    `
    console.log(perguntas);
    arrayRespostas = [];
    arrayRespostas.push(perguntas[i].answers);
    arrayRespostasEmbaralhado = arrayRespostas[0].sort(comparador);

    ul = document.querySelectorAll("ul");

    for (let i=0; i< arrayRespostasEmbaralhado.length; i++){
        ul[ul.length-1].innerHTML += ` 

        <li class="containerOpcoes">
        <img src="${arrayRespostasEmbaralhado[i].image}">
        <h2>${arrayRespostasEmbaralhado[i].text}</h2>
      </li>
    
     `;
    }
    
  }
}

function comparador() { 
	return Math.random() - 0.5; 
}

function mensagemSucesso(){
    console.log("sucesso");
}

// function confereResposta(){

//     // confere se é resposta certao
//     // gera respostaCerta
//     // else respostaErrada
// }

// function respostaCerta(elemento){

//     elemento.classList.add("respostaCerta");
//     elemento.parentNode;
//     // imagem permanece
//     // nome verde
//     // restante nome vermelho cinza

// }

// function respostaErrada(){

//     // todas outras cinza
//     // verifica a correta e nome verde
//     // restante nome vermelho

// }



// TELA 3
function GerarTela3 () {
    tela.innerHTML = 
    `<br>
    <br>
    
    <div><h1>Comece pelo começo</h1></div>
    <br>
    <br>
    <div class="quest-basico">
    <div>
        <input type="text" placeholder="Título do seu quizz">
        <input type="text" placeholder="URL da imagem do seu quizz">
        <input type="text" placeholder="Quantidade de perguntas do quizz">
        <input type="text" placeholder="Quantidade de níveis do quizz">
    </div>
    </div>
    <br>
    <br>
    <div>
      <button class="botao-para-perguntas" onclick="GeraTelaPerguntas()">
        Prosseguir pra criar perguntas
      </button>
    </div>`;
}

function GeraTelaPerguntas (){
    prototipoQuizzCriado.title = GetResposta(0, 0);
    prototipoQuizzCriado.image = GetResposta(0, 1);
    qntdPerguntas = Number(GetResposta(0, 2));
    qntdNiveis = Number(GetResposta(0, 3));

    const alerta = VerificaValidadeTelaComeco();
    if (alerta)
        alert("Algo deu errado");
    else
        ImprimeTelaPerguntas();
}

function GetResposta (indiceQuest, indiceInput){
    const questionarioAll = document.querySelectorAll(".quest-basico");

    let questionario = questionarioAll[indiceQuest];
    questionario = questionario.querySelectorAll("input");

    const resposta = String(questionario[indiceInput].value);
    return resposta;
}

function VerificaValidadeTelaComeco () {
    if (prototipoQuizzCriado.title.length < 20 || prototipoQuizzCriado.title.length > 65)
        return true;
    try{
        let url = new URL(prototipoQuizzCriado.image)
    } catch(err){
        return true;
    }
    if (qntdPerguntas < 3)
        return true;
    if (qntdNiveis < 2)
        return true;
    
    return false;    
}

function ImprimeTelaPerguntas () {
    tela.innerHTML = `
    <br>
    <br>

    <div><h1>Crie suas perguntas</h1></div>
    `;

    ImprimeQuestBasico();
    
    tela.innerHTML += `
    <br>
    <br>
    <div>
      <button class="botao-para-perguntas" onclick="GeraTelaNiveis()">
        Prosseguir pra criar níveis
      </button>
    </div>`;
}

function ImprimeQuestBasico (){
    for (let i = 0; i < qntdPerguntas; i++){
        tela.innerHTML += `
            <br>
            <br>
            
            <div>
                <div class="quest-basico">
                    <div class="collapsible" onclick="Collapse(this)"><h1>Pergunta ${i+1}</h1> <ion-icon name="create-outline"></ion-icon></div>
                    <div class="conteudoPerguntas"> 
                        <input type="text" placeholder="Texto da pergunta">
                        <input type="text" placeholder="Cor de fundo da pergunta">

                        <br>

                        <h1>Resposta correta</h1>
                        <input type="text" placeholder="Resposta correta">
                        <input type="text" placeholder="URL da imagem">

                        <br>

                        <h1>Respostas Incorretas</h1>
                        <input type="text" placeholder="Resposta incorreta 1">
                        <input type="text" placeholder="URL da imagem 1">

                        <br>

                        <input type="text" placeholder="Resposta incorreta 2">
                        <input type="text" placeholder="URL da imagem 2">

                        <br>

                        <input type="text" placeholder="Resposta incorreta 3">
                        <input type="text" placeholder="URL da imagem 3">
                    </div>
                </div>
            </div>`;
    }
}

function Collapse (doc) {
    let conteudo = doc.nextElementSibling;
    
    if (conteudo.style.maxHeight)
        conteudo.style.maxHeight = null;
    else
        conteudo.style.maxHeight = conteudo.scrollHeight + "px";
}

function GeraTelaNiveis (){
    prototipoQuizzCriado.questions = [];
    
    for (let i = 0; i < qntdPerguntas; i++){
        if (!VerificaValidadePerguntas(i)){
            alert("Algo deu errado");
            existeResposta = [false, false, false];
            return;
        }

        prototipoQuizzCriado.questions.push({
            title: GetResposta(i, 0),
            color: GetResposta(i, 1),
            answers: InsereAnswers(i)
        })

        existeResposta = [false, false, false];
    }
}

function VerificaValidadePerguntas (indice) {
    if (GetResposta(indice, 0).length >= 20)
        return true;
    
    if (GetResposta(indice, 1)[0] === "#" 
    && VerificaHexadecimal(GetResposta(indice, 1).slice(1, GetResposta(indice, 1).length)))
        return true;

    if (GetResposta(indice, 2).length > 0)
        return true

    if (GetResposta(indice, i+1) !== ""){
        try{
            let url = new URL(GetResposta(indice, 3))
        } catch(err){
            return true;
        }
    }
    
    for (let i = 4; i < 9; i+=2){
        if (GetResposta(indice, i).length > 0)
            existeResposta[(i/2)-2] = true;

        if (GetResposta(indice, i+1) !== ""){
            try{
                let url = new URL(GetResposta(indice, 3))
            } catch(err){
                return true;
            }
        }
    }
    return false;
}

function VerificaHexadecimal(string) {

    return Boolean(string.match(/^0x[0-9a-f]+$/i));
  }

function InsereAnswers (indice) {
    let r = [];
    let qntdRespostas = 0;

    r.push({
        text: GetResposta(indice, 2),
        image: GetResposta(indice, 3),
        isCorrectAnswer: true
    });

    for (let i = 0; i < 3; i++)
        if (existeResposta)
            r.push({
                text: GetResposta(indice, (2*(i+2))),
                image: GetResposta(indice, (2*(i+2) + 1)),
                isCorrectAnswer: false
            });
    
    return r;
}