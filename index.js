const input = document.querySelector('.input');
const items = document.querySelectorAll('.input-item');
const oldDiv = document.querySelector(".disable");

function debounce(func, delay) {
    let timerId;

    return function () {
        const context = this;
        const args = arguments;

        clearTimeout(timerId);

        timerId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    }
}

const deleteEl = (button) => {
    const oldDiv = button.parentNode;
    oldDiv.remove();
}

const listener = (event, value, i) => {
    console.log(event)
    event.stopImmediatePropagation()
    oldDiv.insertAdjacentHTML("afterend", `
<div class="items">
    <div class="item">name: ${value.items[i].name}</div>
    <div class="item">owner: ${value.items[i].owner.login}</div>
    <div class="item">stars: ${value.items[i].stargazers_count}</div>
    <button onclick='deleteEl(this)'>удалить</button>
</div>
`
    )
    input.value = '';
    oldDiv.classList.add('disable')
    oldDiv.classList.remove('active')
}

const fillItems = async (value) => {
    oldDiv.classList.add('active')
    oldDiv.classList.remove('disable')
    for (let i = 0; i < 5; i++) {
        items[i].innerText = value.items[i].name
        items[i].addEventListener('click', (event) => listener(event, value, i), false)
        items[i].removeEventListener('click', (event) => listener(event, value, i))

    }
}

const response = async function (query) {
    if (!query) {
        for (let i = 0; i < items.length; i++) {
            items[i].innerText = ''
            oldDiv.classList.add('disable')
            oldDiv.classList.remove('active')
        }
        return;
    }
    const res = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`, {
        method: 'GET'
    })
    const result = await res.json()
    await fillItems(result)
}

input.addEventListener('keyup', debounce(() => response(input.value), 400))






