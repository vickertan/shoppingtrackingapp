const db = new Dexie("Shopping App");
db.version(1).stores({ items: '++id,name,quantity,purchased,readonly' });

const itemForm = document.querySelector("#item-form");
const itemList = document.querySelector("#item-list");
const totalPriceDiv = document.querySelector("#total-price");

const createItemDiv = async () => {
    const allItems = await db.items.reverse().toArray();

    itemList.innerHTML = allItems.map(item => `
    <div class="item">
        <label>
            <input
                type="checkbox"
                id="checkbox"
                onchange="toggleStatus(event, ${item.id})"
                ${item.purchased && 'checked'}
                />
            <span class="bubble"></span>
        </label>
        <div class="content ${item.purchased && 'purchased'}">
            <input
                type="text"
                class="name-content"
                id="name-content"
                value="${item.name}"
                ${item.readonly && 'readonly'}
                />
            <input
                type="text"
                class="price-content"
                id="price-content"
                value="$${item.price}"
                ${item.readonly && 'readonly'}
                />
            <input
                type="text"
                class="quantity-content"
                id="quantity-content"
                value="x ${item.quantity}"
                ${item.readonly && 'readonly'}
                />
        </div>
        <div class="actions">
            <button class="edit" onclick="toggleEdit()">EDIT</button>
            <button class="delete" onclick="removeItem(${item.id})">X</button>
        </div>
    </div>
    `).join('');

    const priceArray = allItems.map(item => item.price * item.quantity);
    const totalPrice = priceArray.reduce((a, b) => a + b, 0); 

    totalPriceDiv.innerText = 'Total Price : $' + totalPrice;
}

window.onload = createItemDiv();

itemForm.onsubmit = async (e) => {
    e.preventDefault();

    const nameInput = document.querySelector('#item-name').value;
    const priceInput = document.querySelector('#item-price').value;
    const quantityInput = document.querySelector('#item-quantity').value;

    await db.items.add({ name: nameInput , quantity: quantityInput, price: priceInput });
    await createItemDiv();

    itemForm.reset();
}

const removeAllItem = async () => {
    await db.items.clear();
    await createItemDiv();
}

const toggleEdit = async (id) => {
    await db.items.update(id, { readonly: false });
}

const removeItem = async (id) => {
    await db.items.delete(id);
    await createItemDiv();
}

const toggleStatus = async (event, id) => {
    await db.items.update(id, { purchased: event.target.checked });
    await createItemDiv();
}