import {elements} from "./table.js";

let elementKeys = Object.keys(elements);
const boxes = document.querySelectorAll('.box');
const mainBox = document.querySelector('.actual-element');
const image = document.querySelectorAll('.image'); // creo que no sirve para nada

const txtName = document.querySelector('.name');
const txtSymbol = document.querySelector('.symbol');
const txtAtomicN = document.querySelector('.atomic-n');
const txtAtomicM = document.querySelector('.atomic-m');
const txtGroup = document.querySelector('.group');

const checkButton = document.querySelector('.check');
const resetButton = document.querySelector('.reset');

mainBox.appendChild(createNewElement());

let imgInBoxData = { img: undefined, isMain: false, from: undefined };
boxes.forEach(box => {
    box.addEventListener('dragstart', ()=> {
        imgInBoxData.img =  box.children[0];
        imgInBoxData.isMain = (box.classList.contains('actual-element')) ? true : false;
        imgInBoxData.from = box;
    });

    box.addEventListener('dragover', e=> {
        e.preventDefault()
        box.classList.add('hovered');
    });

    box.addEventListener('dragleave', ()=> {
        box.classList.remove('hovered');
    });

    box.addEventListener('drop', ()=> {
        if (box.childElementCount !== 0 && !imgInBoxData.isMain && !box.classList.contains('actual-element')) {
            const tempElement = box.children[0];
            box.appendChild(imgInBoxData.img)
            imgInBoxData.from.appendChild(tempElement);
        }
        else if (box.childElementCount === 0) {         
            box.appendChild(imgInBoxData.img);
            box.classList.remove('hovered');
        }
        box.classList.remove('hovered');

        if (mainBox.childElementCount === 0) {
            if (elementKeys.length > 0){
                mainBox.appendChild(createNewElement());
            }
        }
    });
});

let boxOver = undefined

boxes.forEach(box => {
    box.addEventListener('mouseover', () => {
        boxOver = box;
        if (box.childElementCount === 0){
            box.classList.add('interact');
        }
    });

    box.addEventListener('mouseout', () => {
        box.classList.remove('interact');
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'e' || event.key === 'E') {
        if (boxOver.childElementCount === 0) {
            boxOver.appendChild(mainBox.children[0]);
            boxOver.classList.remove('interact')
            if (elementKeys.length > 0) {
                mainBox.appendChild(createNewElement());
            }
        }
    }

    if (event.key === 'f' || event.key === 'F') {
        fillTable(10);
    }
});

checkButton.addEventListener('click', ()=> {
    let score = 0; //test
    for (var k in elements) {
        if (elements.hasOwnProperty(k)) {
            let e = document.getElementById(`${elements[k].symbol}`);
            if (e.childElementCount !== 0 && e.children[0].classList.contains(e.id)){
                score ++;
                console.log(true)
            }
            else {
                e.classList.add('wrong-empty');
                e.classList.add('wrong');
                if (e.childElementCount === 0) {
                    e.classList.remove('wrong-empty');
                }
            }
        }
    }
    console.log(score)
});

resetButton.addEventListener('click', ()=> {
    for (let i in elements) {
        let e = document.getElementById(elements[i].symbol);
        e.classList.remove('wrong-empty');
        e.classList.remove('wrong');
        if (e.childElementCount !== 0) {
            e.removeChild(e.children[0]);
        }
    }
    elementKeys = Object.keys(elements);
    while (mainBox.firstChild) {
        mainBox.removeChild(mainBox.firstChild);
    }
    mainBox.appendChild(createNewElement());
});

function createNewElement() {
    let newImg = document.createElement('div');
    const randomIndex = Math.floor(Math.random() * elementKeys.length);
    const randomKey = elementKeys[randomIndex];
    newImg.classList.add('image', `${elements[randomKey].symbol}`);
    newImg.draggable = true;
    newImg.style.backgroundImage = `url(./sources/elements/${elements[randomKey].symbol}.png)`;
    elementKeys.splice(randomIndex, 1);
    showElementProperties(randomKey);
    return newImg;
}

function showElementProperties(elm) {
    txtName.textContent = `Nombre: ${elements[elm].name}`
    txtSymbol.textContent = `Símbolo: ${elements[elm].symbol}`
    txtAtomicN.textContent = `Número atómico: ${elements[elm].atomicNumber}`
    txtAtomicM.textContent = `Masa atómica: ${elements[elm].atomicMass}µ`
    txtGroup.textContent = `Grupo: ${elements[elm].group}Aún falta xD`
}

function fillTable(exceptNum=0) {
    elementKeys = Object.keys(elements);
    const entries = Object.entries(elements);
    const startIndex = Math.max(0, entries.length - exceptNum);
    entries.slice(0, startIndex).forEach(([key, value]) => {
        let boxL = document.getElementById(`${value.symbol}`);
        if (boxL.childElementCount === 0) {
            let newImg = document.createElement('div');
            newImg.classList.add('image', `${value.symbol}`);
            newImg.draggable = true;
            newImg.style.backgroundImage = `url(./sources/elements/${value.symbol}.png)`;
            boxL.appendChild(newImg);
            let idx = elementKeys.indexOf(key);
            if (idx !== -1) {
                elementKeys.splice(idx, 1);
            }
        }
        else {
            let idx = elementKeys.indexOf(key);
            elementKeys.splice(idx, 1);
        }
    });
    mainBox.removeChild(mainBox.children[0])
    if (elementKeys.length > 0) {
        mainBox.appendChild(createNewElement());
    }
}