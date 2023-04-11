const db = new Dexie("Shopping App");
db.version(1).stores({ items: "++id" });

const itemForm = document.querySelector("#item-form");
const itemList = document.querySelector("#item-list");
const totalPriceDiv = document.querySelector("#total-price");

const createItemDiv = async () => {
    allItems = await db.items.reverse().toArray();

    if (allItems.length !== 0) {
        itemList.innerHTML = allItems
            .map(
                (item) => `
            <div class="item">
                <label>
                    <input
                        type="checkbox"
                        id="checkbox"
                        onchange="toggleStatus(event, ${item.id})"
                        ${item.purchased && "checked"}
                        />
                    <span class="bubble"></span>
                </label>
                <div class="content ${item.purchased && "purchased"}">
                    <input
                        type="text"
                        id="name-content"
                        value="${item.name}"
                        placeholder="none"
                        autocomplete="off"
                        ${!item.readonly && "readonly"}
                        />
                    <div class="price-box">
                        <span>$</span>
                        <input
                            type="number"
                            id="price-content"
                            value="${parseInt(item.price) || (item.price = 0)}"
                            autocomplete="off"
                            ${!item.readonly && "readonly"}
                            />
                    </div>
                    <div class="quantity-box">
                        <span>x</span>
                        <input
                            type="number"
                            id="quantity-content"
                            value="${
                                parseInt(item.quantity) || (item.quantity = 1)
                            }"
                            autocomplete="off"
                            ${!item.readonly && "readonly"}
                            />
                    </div>
                </div>
                <div class="actions">
                    <button class="edit" onclick="toggleEdit(event, ${
                        item.id
                    })">${item.buttonText}</button>
                    <button class="delete" onclick="confirmRemove(event, ${
                        item.id
                    })">X</button>
                </div>
            </div>
        `
            )
            .join("");
    } else {
        itemList.innerHTML = `
            <p class="empty-message1">Your list is empty.</p>
            <p class="empty-message2">Add some items to get started!</p>
        `;
    }

    const uncheckedItems = allItems.filter((item) => item.purchased === false);

    const priceArray = uncheckedItems.map((item) => item.price * item.quantity);
    const totalPrice = priceArray.reduce((a, b) => a + b, 0);

    totalPriceDiv.innerText = "Total price : $" + totalPrice;
};

window.onload = createItemDiv();

itemForm.onsubmit = async (e) => {
    e.preventDefault();

    const nameInput = document.querySelector("#item-name").value;
    const priceInput = document.querySelector("#item-price").value;
    const quantityInput = document.querySelector("#item-quantity").value;

    await db.items.add({
        name: nameInput,
        quantity: quantityInput,
        price: priceInput,
        purchased: false,
        buttonText: "EDIT",
    });

    await createItemDiv();

    itemForm.reset();
};

const clearAll = () => {
    if (allItems.length !== 0) {
        if (
            prompt("Type 'clear-all' to remove all items from list") ===
            "clear-all"
        ) {
            db.items.clear();
            createItemDiv();
        }
    }
};

const toggleEdit = (event, id) => {
    const nameContent = event.target.parentElement.parentElement
        .querySelector(".content")
        .querySelector("#name-content");
    const priceContent = event.target.parentElement.parentElement
        .querySelector(".content")
        .querySelector("#price-content");
    const quantityContent = event.target.parentElement.parentElement
        .querySelector(".content")
        .querySelector("#quantity-content");

    if (event.target.innerHTML == "EDIT") {
        db.items.update(id, { buttonText: "SAVE" });
        db.items.update(id, { readonly: true });

        createItemDiv();
    } else {
        db.items.update(id, { name: nameContent.value });
        db.items.update(id, { price: priceContent.value });
        db.items.update(id, { quantity: quantityContent.value });
        db.items.update(id, { buttonText: "EDIT" });
        db.items.update(id, { readonly: false });

        createItemDiv();
    }
};

const confirmRemove = (event, id) => {
    const nameContent = event.target.parentElement.parentElement
        .querySelector(".content")
        .querySelector("#name-content");

    if (nameContent.value != "") {
        if (
            confirm(
                `Are you sure you want to remove ${nameContent.value} from list?`
            )
        ) {
            db.items.delete(id);
            createItemDiv();
        }
    } else {
        db.items.delete(id);
        createItemDiv();
    }
};

const toggleStatus = async (event, id) => {
    await db.items.update(id, { purchased: event.target.checked });
    await createItemDiv();
};
