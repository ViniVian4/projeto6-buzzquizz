let titulo = "";
let urlImagem = "";
let qntdPerguntas = 0;
let qntdNiveis = 0;

//GeraTela1();
GeraTela2();

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

function GeraTela2 () {
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