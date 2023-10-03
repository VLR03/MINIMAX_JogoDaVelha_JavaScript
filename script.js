var tabuleiroOriginal; // O(1)
const jogador = 'O'; // O(1)
const ia = 'X'; // O(1)
const combinacoesVencedoras = [ // O(1)
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const casas = document.querySelectorAll('.cell'); // O(n)
iniciarJogo(); // O(n)

function iniciarJogo() {
    document.querySelector(".fimDeJogo").style.display = "none"; //O(n)
    tabuleiroOriginal = Array.from(Array(9).keys()); //from --> O(n), keys --> O(n)

    for (var i = 0; i < casas.length; i++) { // O(n)
        casas[i].innerText = ''; // O(1)
        casas[i].style.removeProperty('background-color'); // O(n)
        casas[i].addEventListener('click', clickRodada, false); // O(n)
    }
} // Complexidade assintótica: O(n) && complexidade polinomial: 7n + 1

function escolherQuemComeca(quemComeca) {
    if (quemComeca === 'jogador') { // O(1)
        jogadorComeca(); // O(n^4)
    } else {
        iaComeca(); // O(n)
    }
} // Complexidade assintótica: O(n^4) && complexidade polinomial: n^4 + n + 1

function jogadorComeca() {
    jogadorPodeJogar = true; // O(1) // Permitir que o jogador comece
    iniciarJogo(); // O(n) // Reiniciar o jogo
    checarEmpate(); // O(n^4)
} // Complexidade assintótica: O(n^4) && complexidade polinomial: n^4 + n + 1

function iaComeca() {
    iaComeu = true; // O(1)
    jogadorPodeJogar = false; // O(1) // Impedir que o jogador comece
    iniciarJogo(); // O(n) // Reiniciar o jogo

    var empate = checarEmpate(); // O(n^4) // Verificar se o jogo termina em empate
    if (empate) { // O(1)
        // Exibe a mensagem de empate quando o jogo empata
        declararVencedor("Empate!"); // O(n)
    } else {
        setTimeout(function () { // O(n)
            rodada(melhorJogada(), ia); // A IA começa após um segundo
            jogadorPodeJogar = true; // O(1) // Permitir que o jogador faça sua jogada
            checarEmpate(); // O(n^4)
        }, 1000);
    }
} // Complexidade assintótica: O(n^4) && complexidade polinomial: n^8 + 3n + 4

const playerComecaBtn = document.querySelector('.playerComeca'); // O(n)
const iaComecaBtn = document.querySelector('.iaComeca'); // O(n)

playerComecaBtn.addEventListener('click', () => { // O(n)
    playerComecaBtn.classList.add('playerSelecionado'); // O(n)
    iaComecaBtn.classList.remove('iaSelecionado'); // O(n)
}); // Complexidade assintótica: O(n^3) && complexidade polinomial: 3n

iaComecaBtn.addEventListener('click', () => { // O(n)
    iaComecaBtn.classList.add('iaSelecionado'); // O(n)
    playerComecaBtn.classList.remove('playerSelecionado'); // O(n)
}); // Complexidade assintótica: O(n^3) && complexidade polinomial: 3n

let jogadorPodeJogar = true; // O(1)

function clickRodada(quadrado) {
    if (jogadorPodeJogar && typeof tabuleiroOriginal[quadrado.target.id] == 'number') { // O(1)
        jogadorPodeJogar = false; // O(1) // Desabilita os eventos de clique do jogador temporariamente
        rodada(quadrado.target.id, jogador); // O(n^4)

        var empate = checarEmpate(); // O(n^4) // Verificar se o jogo termina em empate
        if (empate) { // O(1)
            // Exibe a mensagem de empate quando o jogo empata
            declararVencedor("Empate!"); // O(n)
        }

        if (!checarEmpate()) { // O(n^4)
            setTimeout(function () { // O(n)
                rodada(melhorJogada(), ia); // Chama a função da IA após um segundo
                jogadorPodeJogar = true; // O(1) // Habilita os eventos de clique do jogador novamente
            }, 1000); // Atraso de um segundo (1000 milissegundos)
        }
    }
} // Complexidade assintótica: O(n^4) && complexidade polinomial: n^12 + 2n + 4

function rodada(quadradoId, player) {
    tabuleiroOriginal[quadradoId] = player; // O(1)
    document.getElementById(quadradoId).innerText = player; // O(n)

    let venceuJogo = checarVitoria(tabuleiroOriginal, player); // O((n^2) * log(n))
    if (venceuJogo) perdeuJogo(venceuJogo) // O(n)
} // Complexidade assintótica: O(n^4) && complexidade polinomial: (n^2 * log(n)) + 2n + 1

function checarVitoria(tabuleiro, player) { 
    let jogar = tabuleiro.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []); // reduce --> O(n), concat --> O(nLogn) "The minimum time complexity of . reduce is O(n)", "In JavaScript though, there is an optimized implementation of concatenation based on the rope data structure, making the time complexity O(log n) in most cases."
    let venceuJogo = null; // O(1)

    for (let [index, vitoria] of combinacoesVencedoras.entries()) { // for --> O(n), entries --> O(n)
        if (vitoria.every(elem => jogar.indexOf(elem) > -1)) { // every --> O(n), indexOf --> O(n)
            venceuJogo = { index: index, player: player }; // O(1)
            break; // O(1)
        }
    }

    return venceuJogo; // O(1)
} // Complexidade assintótica: O((n^2) * log(n)) && complexidade polinomial: nLogn + 5n + 3

function perdeuJogo(venceuJogo) {
    for (let index of combinacoesVencedoras[venceuJogo.index]) { // O(n)
        document.getElementById(index).style.backgroundColor =
            venceuJogo.player == jogador ? "blue" : "red"; // O(1)
    }

    for (var i = 0; i < casas.length; i++) { // O(n)
        casas[i].removeEventListener('click', clickRodada, false); 
    }

    declararVencedor(venceuJogo.player == jogador ? "Você venceu!" : "Você perdeu."); // O(n)
} // Complexidade assintótica: O(n) && complexidade polinomial: 3n + 1

function declararVencedor(quem) {
    document.querySelector(".fimDeJogo").style.display = "block"; // O(n)
    document.querySelector(".fimDeJogo .text").innerText = quem; // O(n)
} // Complexidade assintótica: O(n) && complexidade polinomial: 2n

function casasVazias() {
    return tabuleiroOriginal.filter(s => typeof s == 'number'); // O(n) "filter(): O(n) time complexity" // Identifica as casas vazias através de seus identificadores numéricos
} // Complexidade assintótica: O(n) && complexidade polinomial: n

function melhorJogada() {
    return minimax(tabuleiroOriginal, ia).index; // O(n^m)
} // Complexidade assintótica: O(n^m) && complexidade polinomial: n^m

function checarEmpate() {
    if ((casasVazias().length == 0 || (casasVazias().length == 1 && iaComeu)) || (casasVazias().length == 0 || (casasVazias().length == 1 && jogadorPodeJogar))) {  // O(n^4)
        if (jogadorPodeJogar == true) { // O(1)
            rodada(melhorJogada(), ia);
        } else {
            for (var i = 0; i < casas.length; i++) { // O(n)
                casas[i].style.backgroundColor = "green"; // O(1)
                casas[i].removeEventListener('click', clickRodada, false);
            }
            declararVencedor("Empate!"); // O(n)
        }
        rodada(melhorJogada(), ia);
        declararVencedor("Empate!"); // O(n)
        return true; // O(1)
    }

    return false; // O(1)
} // Complexidade assintótica: O(n^4) && complexidade polinomial: n^4 + 3n + 3

function minimax(novoTabuleiro, player) {
    var casasDisponiveis = casasVazias(novoTabuleiro); // O(n)
    var venceuJogador = checarVitoria(novoTabuleiro, jogador); // O(n^4)
    var venceuIA = checarVitoria(novoTabuleiro, ia); // O(n^4)

    if (venceuJogador) { // O(1)
        return { score: -10 }; // O(1)
    } else if (venceuIA) {
        return { score: 10 }; // O(1)
    } else if (casasDisponiveis.length === 0) {
        return { score: 0 }; // O(1)
    }

    var jogadas = []; // O(1)

    for (var i = 0; i < casasDisponiveis.length; i++) { // O(m)
        var jogadaAtual = {}; // O(1)
        jogadaAtual.index = novoTabuleiro[casasDisponiveis[i]]; // O(1)
        novoTabuleiro[casasDisponiveis[i]] = player; // O(1)

        if (player === ia) { // O(1)
            var resultado = minimax(novoTabuleiro, jogador); //O(n)
            jogadaAtual.score = resultado.score; // O(1)
        } else {
            var resultado = minimax(novoTabuleiro, ia); //O(n)
            jogadaAtual.score = resultado.score; // O(1)
        }

        novoTabuleiro[casasDisponiveis[i]] = jogadaAtual.index; // O(1)
    jogadas.push(jogadaAtual); // O(1) "Since the push() method adds elements to the end of an array, it has a constant time complexity of O(1)"
    }

    var melhorJogada; // O(1)

    if (player === ia) {
        var melhorPontuacao = -Infinity; // O(1)

        for (var i = 0; i < jogadas.length; i++) {  // O(n)
            if (jogadas[i].score > melhorPontuacao) { // O(n)
                melhorPontuacao = jogadas[i].score; // O(1)
                melhorJogada = i; // O(1)
            }
        }
    } else {
        var melhorPontuacao = Infinity; // O(1)

        for (var i = 0; i < jogadas.length; i++) {  // O(n)
            if (jogadas[i].score < melhorPontuacao) { // O(n)
                melhorPontuacao = jogadas[i].score; // O(1)
                melhorJogada = i; // O(1)
            }
        }
    }

    return jogadas[melhorJogada]; // O(1)
} // Complexidade assintótica: O(n^m) && complexidade polinomial: n^8 + 7n + m + 21