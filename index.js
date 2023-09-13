const input = document.querySelector('.input');
const items = document.querySelectorAll('.input-item');

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

const fillItems = async (value) => {
    for (let i = 0; i < items.length; i++) {
        items[i].innerText = value.items[i].name
        items[i].addEventListener('click', () => {
            const oldDiv = document.querySelector(".disable");
            oldDiv.insertAdjacentHTML("afterend", `
<div>
    <div>name: ${value.items[i].name}</div>
    <div>owner: ${value.items[i].owner.login}</div>
    <div>stars: ${value.items[i].stargazers_count}</div>
    <button onclick='deleteEl(this)'>удалить</button>
</div>
`
            )
            input.value = '';
        })
    }
}

const response = async function (query) {
    if (!query) {
        for (let i = 0; i < items.length; i++) {
            items[i].innerText = ''
        }
        return;
    }
    const res = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`, {
        method: 'GET'
    })
    const result = await res.json()
    await fillItems(result)
}

input.addEventListener('keyup', debounce(() => response(input.value), 2000))






