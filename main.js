const db = new Dexie("Shopping App");
db.version(1).stores({ items: '++id,name,quantity,purchased' });

const itemForm = document.querySelector("#item-form");
const itemList = document.querySelector("#item-list");
const totalPriceDiv = document.querySelector("#total-price");

const createItemDiv = async () => {
    const allItems = await db.items.toArray();

    itemList.innerHTML = allItems.map(item => `
    <div class="item">
        <label>
            <input
                type="checkbox"
                id="checkbox"
                onchange="toggleItemStatus(event, ${item.id})"
                ${item.purchased && 'checked'}
                />
            <span class="bubble"></span>
        </label>
        <div class="content ${item.purchased && 'purchased'}">
            <p class="name-content">${item.name}</p>
            <p class="price-content">$${item.price}</p>
            <p class="quantity-content">x ${item.quantity}</p>
        </div>
        <div class="actions">
            <button class="edit">EDIT</button>
            <button class="delete">X</button>
        </div>
    </div>
    `);

    totalPriceDiv.innerText = 'Total Price : $' + totalPrice;
}

itemForm.onsubmit = async (e) => {
    e.preventDefault();

    const nameInput = document.querySelector('#item-name').value;
    const priceInput = document.querySelector('#item-price').value;
    const quantityInput = document.querySelector('#item-quantity').value;

    await db.items.add({ name: nameInput , quantity: quantityInput, price: priceInput });
    await createItemDiv();

    itemForm.reset();
}