const container = document.querySelector('main');

const ctx = {}

function initEvents() {
    controlsEvents();
    document.querySelector('.add-input').onclick = insertNewInput;
    document.querySelector('.add-select').onclick = insertNewSelect;
    document.querySelector('.controls').onsubmit = (e) => e.preventDefault();
}


function insertNewInput() {
     `
        <div class="container container-target-input">
            <input value="Escreva aqui"/>
            <button class=""></button>
        </div>
    `;
    const wrapper = createElWithClass('div', 'container container-target-input');
    const btnDel = document.createElement('button');
    btnDel.onclick = () => wrapper.remove();
    btnDel.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    wrapper.append(createInput('Input'), btnDel);
    updateWrapper(wrapper);
    container.append(wrapper);
}

function insertNewSelect() {
    `
        <div class="container container-target-select">
            <div class="internal">
                <input value="Escreva aqui o título do select"/>
                <ul>
                    <li class="option">
                        <input value="Escreva aqui a opção>
                        <button>x</button>
                    </li>
                </ul>
            </div>
            <button class="">+</button>
            <button class="">x</button>
        </div>
    `;

    const wrapperE = createElWithClass('div', 'container container-target-select');
    const wrapperI = createElWithClass('div', 'internal');
    const listOpts = document.createElement('ul');

    const btnDel = document.createElement('button');
    btnDel.onclick = () => wrapperE.remove();
    btnDel.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    const btnAdd = document.createElement('button');
    btnAdd.onclick = () => createOpt(listOpts);
    btnAdd.innerHTML = '<i class="fa-solid fa-plus"></i>';
    createOpt(listOpts);

    const signal = createElWithClass('div', 'signal');
    signal.innerHTML = '<i class="fa-solid fa-caret-down"></i>';
    wrapperI.append(createInput('Título do select'), signal, listOpts);
    wrapperE.append(wrapperI, btnDel, btnAdd);
    updateWrapper(wrapperE);
    container.append(wrapperE);
}

function createOpt(recipe) {
    const wrapper = createElWithClass('li', 'option');
    const btnDel = document.createElement('button');
    btnDel.onclick = () => wrapper.remove();
    btnDel.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    wrapper.append(createInput('Nome da opção'), btnDel);
    recipe.append(wrapper);
}

function createElWithClass(type, classList) {
    const el = document.createElement(type);
    el.classList = classList;
    return el;
}

function createInput(value) {
    const input = document.createElement('input');
    updateInput(input);
    input.value = value;
    input.onfocus = () => {
        if (input.value === value) {
            input.value = '' ;
        }
    }
    input.onblur = () => {
        if (!input.value.trim()) {
            input.value = value;
        }
    }
    input.onkeydown = () => input.style.width = input.value.length < 15 ? '15ch' : input.value.length + 'ch';
    return input;
}

function updateInput(input) {
    input.style.fontFamily = ctx.fontFamily;
    input.style.color = ctx.fontColor;
}

function updateAllInput() {
    Array.from(container.querySelectorAll('input')).forEach(updateInput);
}

function updateWrapper(wrapper) {
    wrapper.style.marginBottom = ctx.separator;
    wrapper.style.backgroundColor = ctx.elementsColor;
    const list = wrapper.querySelector('ul');
    if (!list) return;
    list.style.backgroundColor = ctx.optsColor;
}

function updateAllWrapper() {
    Array.from(container.querySelectorAll('.container')).forEach(updateWrapper);
}

function screenshot() {
    return new Promise(async resolve => resolve((await html2canvas(container, {scale: 2})).toDataURL('image/png')))
}

function controlsEvents() {
    const fontFamily = document.querySelector('#font');
    const separator = document.querySelector('#separator');
    const backgroundColor = document.querySelector('#background-color');
    const elementsColor = document.querySelector('#elements-color');
    const fontColor = document.querySelector('#font-color');
    const optsColor = document.querySelector('#options-color');
    const down = document.querySelector('#download');
    const clip = document.querySelector('#clipboard')


    fontFamily.oninput = () => {
        ctx.fontFamily = fontFamily.value;
        container.style.fontFamily = fontFamily.value;
        updateAllInput();
    }
    
    separator.oninput = () => {
        ctx.separator = separator.value + "px";
        updateAllWrapper();
    }
    
    backgroundColor.oninput = () => {
        container.style.backgroundColor = backgroundColor.value;
    }
    
    elementsColor.oninput = () => {
        ctx.elementsColor = elementsColor.value;
        updateAllWrapper();
    }
    
    fontColor.oninput = () => {
        ctx.fontColor = fontColor.value;
        updateAllInput();
    }
    
    optsColor.oninput = () => {
        ctx.optsColor = optsColor.value;
        updateAllWrapper();
    }
    
    [fontFamily, separator, backgroundColor, elementsColor, fontColor, optsColor].forEach(el => el.dispatchEvent(new Event('input')));
    
    down.onclick = async () => {
        container.classList.add('screenshot');
        const b64 = await screenshot();
        const link = document.createElement('a');
        const now = new Date().toLocaleString("sv-SE", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
        link.download = `form_${now}.png`;
        link.href = b64;
        link.click();
        container.classList.remove('screenshot');
    }

    clip.onclick = async () => {
        container.classList.add('screenshot');
        const b64 = await screenshot();
        const bin =  (await fetch(b64)).blob();
        try {
            navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': bin
                })
            ]);
        } catch (error) {
            console.error(error);
        }
        container.classList.remove('screenshot');
    }
}

initEvents();