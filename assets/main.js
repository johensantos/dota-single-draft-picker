import {html, render} from 'https://cdn.jsdelivr.net/npm/lit-html@3.1.3/lit-html.min.js';

/**
 * GLOBAL VARIABLES
 */
const D = document;
let playerListData = [];
let intHeroes, strenghtHeroes, agilityHeroes, universalHeroes;
const generateSingleDraftBtn = D.getElementById('generate-single-draft-btn');
const copyBtn = D.getElementById('share-btn');
const addPlayersPAGE = D.getElementById('add-players-page');
const reviewPAGE = D.getElementById('review-page');
let textToShare = '';


/**
 * PLAYER FORM BEHAVIOR
 */
const addPlayerForm = D.getElementById('add-player-form');
const playersList = D.getElementById('players-list');
const inputPlayerNick = D.getElementById('input-player-nick');
addPlayerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const templateContainer = D.createElement('li');
    templateContainer.classList.add('list-group-item', 'list-group-item-primary');
    templateContainer.textContent = inputPlayerNick.value;
    playersList.appendChild(templateContainer);
    playerListData = [...playerListData, inputPlayerNick.value]
    addPlayerForm.reset();
    generateSingleDraftBtn.classList.remove('d-none')
})

/**
 * ORDER HEROES
 */
fetch('heroes-list.json').then(data => {
    return data.json()
}).then(body => {
    const heroesList = body.result.data.heroes
    strenghtHeroes = getHeroesByPrimaryAttr(0, heroesList)
    agilityHeroes = getHeroesByPrimaryAttr(1, heroesList)
    intHeroes = getHeroesByPrimaryAttr(2, heroesList)
    universalHeroes = getHeroesByPrimaryAttr(3, heroesList)

})

/**
 * MAIN BUTTON BEHAVIOR
 */

const playersWithHeroes = [];

generateSingleDraftBtn.addEventListener('click', () => {
    playerListData.forEach(nick => {
        const {randomItem: randomIntHero, copiedArray: newIntArray} = getRandomItemAndCopyArray(intHeroes);
        intHeroes = newIntArray;
        const {randomItem: randomStrHero, copiedArray: newStrArray} = getRandomItemAndCopyArray(strenghtHeroes);
        strenghtHeroes = newStrArray;
        const {randomItem: randomAgilityHero, copiedArray: newAgilityArray} = getRandomItemAndCopyArray(agilityHeroes);
        agilityHeroes = newAgilityArray;
        const {randomItem: randomUnivHero, copiedArray: newUnivArray} = getRandomItemAndCopyArray(universalHeroes);
        universalHeroes = newUnivArray;

        playersWithHeroes.push({
            playerNickName: nick,
            intHero: randomIntHero,
            strHero: randomStrHero,
            agilityHero: randomAgilityHero,
            universalHero: randomUnivHero,
        })
    })
    console.log(playersWithHeroes)
    generateSingleDraftBtn.disabled = true;
    addPlayersPAGE.classList.add('d-none')
    reviewPAGE.classList.remove('d-none')

    goToReviewPage();
})


const goToReviewPage = () => {
    const singleDraftItems = [];
    playersWithHeroes.forEach(playerWithHeroes => {
        textToShare+= `
        ------------------
        ${playerWithHeroes.playerNickName}
        - ${playerWithHeroes.strHero.name_loc}
        - ${playerWithHeroes.agilityHero.name_loc}
        - ${playerWithHeroes.intHero.name_loc}
        - ${playerWithHeroes.universalHero.name_loc}
        
        `
        const element = html`
            <hr>
            <div class="row justify-content-center">
                <h5>${playerWithHeroes.playerNickName}</h5>
                <div class="row row-cols-2 row-cols-md-4">
                    <div class="col pt-1">
                        <div class="card">
                            <img src="${getImageNameByHero(playerWithHeroes.strHero)}" class="card-img-top" alt="...">
                            <div class="card-body py-0 px-1">
                                <strong>${playerWithHeroes.strHero.name_loc}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="col pt-1">
                        <div class="card">
                            <img src="${getImageNameByHero(playerWithHeroes.agilityHero)}" class="card-img-top" alt="...">
                            <div class="card-body py-0 px-1">
                                <strong>${playerWithHeroes.agilityHero.name_loc}</strong>

                            </div>
                        </div>
                    </div>
                    <div class="col pt-1">
                        <div class="card">
                            <img src="${getImageNameByHero(playerWithHeroes.intHero)}" class="card-img-top" alt="...">
                            <div class="card-body py-0 px-1">
                                <strong>${playerWithHeroes.intHero.name_loc}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="col pt-1">
                        <div class="card">
                            <img src="${getImageNameByHero(playerWithHeroes.universalHero)}" class="card-img-top" alt="...">
                            <div class="card-body py-0 px-1">
                                <strong>${playerWithHeroes.universalHero.name_loc}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        singleDraftItems.push(element);

    })
    render(singleDraftItems, reviewPAGE);
}
copyBtn.addEventListener('click',()=>{
    navigator.clipboard.writeText(textToShare)
        .then(() => {
            alert('Texto copiado al portapapeles');
        })
        .catch(_ => {
            alert('Error al copiar texto: ');
        });

})


/**
 * UTILITIES
 */
const getHeroesByPrimaryAttr = (id, heroesList) => heroesList.filter((hero) => hero.primary_attr === id)

function getRandomItemAndCopyArray(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomItem = arr[randomIndex];
    const copiedArray = [...arr.slice(0, randomIndex), ...arr.slice(randomIndex + 1)];
    return {
        randomItem: randomItem,
        copiedArray: copiedArray
    };
}
const getImageNameByHero = ({name}) => 'images/' + name.split('npc_dota_hero_')[1] + '.png'
