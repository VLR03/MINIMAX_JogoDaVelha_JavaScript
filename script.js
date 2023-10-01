var tabuleiroOriginal;
const jogador = 'O';
const ia = 'X';
const combinacoesVencedoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const casas = document.querySelectorAll('.cell');
iniciarJogo();

function iniciarJogo() {
    document.querySelector(".fimDeJogo").style.display = "none";
    tabuleiroOriginal = Array.from(Array(9).keys());

    for(var i = 0; i < casas.length; i++){
        casas[i].innerText = '';
        casas[i].style.removeProperty('background-color');
        casas[i].addEventListener('click', clickRodada, false);
    }
}

function clickRodada(quadrado) {
    if(typeof tabuleiroOriginal[quadrado.target.id] == 'number') {
        rodada(quadrado.target.id, jogador); // identificando onde o jogador marcou
        if(!checarEmpate()) rodada(melhorJogada(), ia); // Checa se é um empate
    } // Checa se já foram efetuadas jogadas nas casas
}

function rodada(quadradoId, player) {
    tabuleiroOriginal[quadradoId] = player;
    document.getElementById(quadradoId).innerText = player;
    
    let venceuJogo = checarVitoria(tabuleiroOriginal, player);
    if(venceuJogo) perdeuJogo(venceuJogo)
}

function checarVitoria(tabuleiro, player) {
    let jogar = tabuleiro.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let venceuJogo = null;

    for (let [index, vitoria] of combinacoesVencedoras.entries()) {
        if (vitoria.every(elem => jogar.indexOf(elem) > -1)) {
            venceuJogo = { index: index, player: player };
            break;
        }
    }

    return venceuJogo;
}

function perdeuJogo(venceuJogo) {
    for(let index of combinacoesVencedoras[venceuJogo.index]) {
        document.getElementById(index).style.backgroundColor =
          venceuJogo.player == jogador ? "blue" : "red";
    }

    for(var i = 0; i < casas.length; i++) {
        casas[i].removeEventListener('click', clickRodada, false);
    }

    declararVencedor(venceuJogo.player == jogador ? "Você venceu!" : "Você perdeu.");
}

function declararVencedor(quem) {
    document.querySelector(".fimDeJogo").style.display = "block";
    document.querySelector(".fimDeJogo .text").innerText = quem;
}

function casasVazias() {
    return tabuleiroOriginal.filter(s => typeof s == 'number'); // Identifica as casas vazias através de seus identificadores numéricos
}

function melhorJogada() {
    return minimax(tabuleiroOriginal, ia).index;
}

function checarEmpate() {
    if (casasVazias().length == 0) {
        for (var i = 0; i < casas.length; i++) {
            casas[i].style.backgroundColor = "green";
            casas[i].removeEventListener('click', clickRodada, false);
        }

        declararVencedor("Empate!"); // Movendo esta linha para fora do if
        return true;
    }

    return false;
}

function minimax(novoTabuleiro, player) {
    var casasDisponiveis = casasVazias(novoTabuleiro);
    var venceuJogador = checarVitoria(novoTabuleiro, jogador);
    var venceuIA = checarVitoria(novoTabuleiro, ia);

    if (venceuJogador) {
        return { score: -10 };
    } else if (venceuIA) {
        return { score: 10 };
    } else if (casasDisponiveis.length === 0) {
        return { score: 0 };
    }

    var jogadas = [];

    for (var i = 0; i < casasDisponiveis.length; i++) {
        var jogadaAtual = {};
        jogadaAtual.index = novoTabuleiro[casasDisponiveis[i]];
        novoTabuleiro[casasDisponiveis[i]] = player;

        if (player === ia) {
            var resultado = minimax(novoTabuleiro, jogador);
            jogadaAtual.score = resultado.score;
        } else {
            var resultado = minimax(novoTabuleiro, ia);
            jogadaAtual.score = resultado.score;
        }

        novoTabuleiro[casasDisponiveis[i]] = jogadaAtual.index;
        jogadas.push(jogadaAtual);
    }

    var melhorJogada;

    if (player === ia) {
        var melhorPontuacao = -Infinity;

        for (var i = 0; i < jogadas.length; i++) {
            if (jogadas[i].score > melhorPontuacao) {
                melhorPontuacao = jogadas[i].score;
                melhorJogada = i;
            }
        }
    } else {
        var melhorPontuacao = Infinity;

        for (var i = 0; i < jogadas.length; i++) {
            if (jogadas[i].score < melhorPontuacao) {
                melhorPontuacao = jogadas[i].score;
                melhorJogada = i;
            }
        }
    }

    return jogadas[melhorJogada];
}